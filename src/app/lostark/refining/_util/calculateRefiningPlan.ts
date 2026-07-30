import type {
  TBookOption,
  TRefiningAction,
  TRefiningConditionalAction,
  TRefiningMaterialId,
  TRefiningPlan,
  TRefiningPlanInput,
} from '@/app/lostark/refining/_type/refining';

const ARTISAN_SCALE = 1_000_000;
const ARTISAN_DENOMINATOR = 215 * ARTISAN_SCALE;
const GUARANTEE_ARTISAN = 10_000 * ARTISAN_DENOMINATOR;
const ARTISAN_PER_SUCCESS_RATE = 100 * ARTISAN_SCALE;
const POLICY_FRONTIER_WIDTH = 192;
const NONE: TBookOption = { kind: 'none' };

type TConsumedMaterials = Partial<Record<TRefiningMaterialId, number>>;
type TPolicyNode = {
  attempts: number;
  failureBonusRate: number;
  accumulatedRate: number;
  maximumBreathQuantity: number;
  reachProbability: number;
  expectedGold: number;
  priorityGold: number;
  consumedMaterials: TConsumedMaterials;
  conditionalActions: readonly TRefiningConditionalAction[];
};

export type TRefiningPlanMetrics = {
  evaluatedActions: number;
  inventoryStateCount: number;
  inventoryTransitionCount: number;
  isFreeMaxRatePath: boolean;
  maximumStateKey: number;
  memoEntries: number;
  memoHits: number;
  solveCalls: number;
};

function parseArtisanEnergy(value: string): number {
  const normalized = value.trim().replace(/%$/, '');
  if (!/^\d+(?:\.\d{1,6})?$/.test(normalized))
    throw new Error('artisanEnergy must be a non-negative decimal percentage string.');
  const [whole, fractional = ''] = normalized.split('.');
  const micro = `${fractional}000000`.slice(0, 6);
  const parsed = (Number(whole) * ARTISAN_SCALE + Number(micro)) * 100 * 215;
  if (parsed > GUARANTEE_ARTISAN) throw new Error('artisanEnergy must not exceed 100%.');
  return parsed;
}

function artisanToNumber(value: number) {
  return Math.min(100, value / ARTISAN_DENOMINATOR / 100);
}

function currentBaseRate(initialRate: number, failureBonusRate: number) {
  return Math.min(initialRate + failureBonusRate, initialRate * 2);
}

function nextFailureBonusRate(initialRate: number, failureBonusRate: number) {
  return Math.min(initialRate, failureBonusRate + initialRate / 10);
}

function actionKey(action: TRefiningAction) {
  return `${action.book.kind}:${action.breathQuantity}`;
}

function tieBreaker(left: TRefiningAction, right: TRefiningAction) {
  const leftBook = left.book.kind === 'none' ? 0 : 1;
  const rightBook = right.book.kind === 'none' ? 0 : 1;
  return (
    leftBook - rightBook ||
    left.breathQuantity - right.breathQuantity ||
    actionKey(left).localeCompare(actionKey(right))
  );
}

function bookMaterialId(book: TBookOption): TRefiningMaterialId | undefined {
  return book.kind === 'none' ? undefined : book.materialId;
}

function optionalConsumptions(
  step: TRefiningPlanInput['step'],
  action: TRefiningAction,
): readonly { id: TRefiningMaterialId; quantity: number }[] {
  const bookId = bookMaterialId(action.book);
  return [
    { id: step.breathMaterialId, quantity: action.breathQuantity },
    ...(bookId ? [{ id: bookId, quantity: 1 }] : []),
  ];
}

export function getRefiningActions(
  step: TRefiningPlanInput['step'],
  failureBonusRate: number,
): readonly TRefiningAction[] {
  return step.books.flatMap((book) =>
    Array.from({ length: step.breathMax + 1 }, (_, breathQuantity) => ({
      breathQuantity,
      book,
      successRate: Math.min(
        10_000,
        currentBaseRate(step.initialRate, failureBonusRate) +
          breathQuantity * step.breathRateBonus +
          (book.kind === 'none' ? 0 : book.rateBonus),
      ),
    })),
  );
}

function materialCost(
  input: TRefiningPlanInput,
  consumedMaterials: TConsumedMaterials,
  consumptions: readonly { id: TRefiningMaterialId; quantity: number }[],
) {
  let marketGold = 0;
  const nextConsumedMaterials = { ...consumedMaterials };
  for (const { id, quantity } of consumptions) {
    if (!quantity) continue;
    const consumed = nextConsumedMaterials[id] ?? 0;
    const owned = input.ownedMaterials?.[id] ?? 0;
    const ownedUsed = Math.min(Math.max(owned - consumed, 0), quantity);
    marketGold += (quantity - ownedUsed) * input.prices[id];
    nextConsumedMaterials[id] = consumed + quantity;
  }
  return { marketGold, nextConsumedMaterials };
}

function comparePolicyNodes(left: TPolicyNode, right: TPolicyNode) {
  return (
    left.priorityGold - right.priorityGold ||
    left.expectedGold - right.expectedGold ||
    left.attempts - right.attempts ||
    left.maximumBreathQuantity - right.maximumBreathQuantity ||
    left.conditionalActions
      .map((row) => actionKey(row.action))
      .join('|')
      .localeCompare(right.conditionalActions.map((row) => actionKey(row.action)).join('|'))
  );
}

export function calculateRefiningPlan(
  input: TRefiningPlanInput,
  onMetrics?: (metrics: TRefiningPlanMetrics) => void,
): TRefiningPlan {
  if (
    !Number.isInteger(input.failureBonusRate) ||
    input.failureBonusRate < 0 ||
    input.failureBonusRate > input.step.initialRate
  )
    throw new Error('failureBonusRate must be an integer percentage not above the initial rate.');
  for (const [id, owned] of Object.entries(input.ownedMaterials ?? {})) {
    if (!Number.isInteger(owned) || owned < 0) throw new Error(`Invalid owned quantity: ${id}`);
  }

  const relevantIds = new Set<TRefiningMaterialId>([
    ...input.step.requiredMaterials.map(({ id }) => id),
    input.step.breathMaterialId,
    ...input.step.books.flatMap((book) => (book.kind === 'none' ? [] : [book.materialId])),
  ]);
  for (const id of relevantIds) {
    const price = input.prices[id];
    if (!Number.isFinite(price) || price < 0) throw new Error(`Invalid market price: ${id}`);
  }

  const startArtisan = parseArtisanEnergy(input.artisanEnergy);
  const guaranteeRate = Math.ceil((GUARANTEE_ARTISAN - startArtisan) / ARTISAN_PER_SUCCESS_RATE);
  const actionsByFailureBonusRate = new Map<number, readonly TRefiningAction[]>();
  function actionsForFailureBonusRate(failureBonusRate: number) {
    const cached = actionsByFailureBonusRate.get(failureBonusRate);
    if (cached) return cached;
    const actions = getRefiningActions(input.step, failureBonusRate);
    actionsByFailureBonusRate.set(failureBonusRate, actions);
    return actions;
  }

  let boundFailureBonusRate = input.failureBonusRate;
  let boundAccumulatedRate = 0;
  let maxFailureAttempts = 0;
  while (boundAccumulatedRate < guaranteeRate) {
    const minimumRate = Math.min(
      ...actionsForFailureBonusRate(boundFailureBonusRate).map((action) => action.successRate),
    );
    boundAccumulatedRate += minimumRate;
    boundFailureBonusRate = nextFailureBonusRate(input.step.initialRate, boundFailureBonusRate);
    maxFailureAttempts += 1;
  }

  const estimatedContinuationCache = new Map<number, number>();
  const requiredMarketGold =
    input.step.gold +
    input.step.requiredMaterials.reduce(
      (total, material) => total + material.quantity * input.prices[material.id],
      0,
    );
  function estimatedContinuation(
    failureBonusRate: number,
    accumulatedRate: number,
    maximumBreathQuantity: number,
  ): number {
    if (accumulatedRate >= guaranteeRate) return requiredMarketGold;
    const key =
      (failureBonusRate * (guaranteeRate + 1) + accumulatedRate) * (input.step.breathMax + 1) +
      maximumBreathQuantity;
    const cached = estimatedContinuationCache.get(key);
    if (cached !== undefined) return cached;

    let best: number | undefined;
    for (const action of actionsForFailureBonusRate(failureBonusRate)) {
      if (action.breathQuantity > maximumBreathQuantity) continue;
      const optionalMarketGold = optionalConsumptions(input.step, action).reduce(
        (total, material) => total + material.quantity * input.prices[material.id],
        0,
      );
      const probability = action.successRate / 10_000;
      const cost =
        requiredMarketGold +
        optionalMarketGold +
        (1 - probability) *
          estimatedContinuation(
            nextFailureBonusRate(input.step.initialRate, failureBonusRate),
            Math.min(guaranteeRate, accumulatedRate + action.successRate),
            action.breathQuantity,
          );
      if (best === undefined || cost < best) best = cost;
    }
    if (best === undefined) throw new Error('No refining action exists.');
    estimatedContinuationCache.set(key, best);
    return best;
  }

  let evaluatedActions = 0;
  let frontier: readonly TPolicyNode[] = [
    {
      attempts: 0,
      failureBonusRate: input.failureBonusRate,
      accumulatedRate: 0,
      maximumBreathQuantity: input.step.breathMax,
      reachProbability: 1,
      expectedGold: 0,
      priorityGold: estimatedContinuation(input.failureBonusRate, 0, input.step.breathMax),
      consumedMaterials: {},
      conditionalActions: [],
    },
  ];
  const completed: TPolicyNode[] = [];

  for (let depth = 0; depth <= maxFailureAttempts && frontier.length > 0; depth += 1) {
    const candidates: TPolicyNode[] = [];
    for (const node of frontier) {
      if (node.accumulatedRate >= guaranteeRate) {
        const action: TRefiningAction = { breathQuantity: 0, book: NONE, successRate: 10_000 };
        const { marketGold, nextConsumedMaterials } = materialCost(
          input,
          node.consumedMaterials,
          input.step.requiredMaterials,
        );
        const immediateGold = input.step.gold + marketGold;
        completed.push({
          ...node,
          expectedGold: node.expectedGold + node.reachProbability * immediateGold,
          priorityGold: node.expectedGold + node.reachProbability * immediateGold,
          consumedMaterials: nextConsumedMaterials,
          conditionalActions: [
            ...node.conditionalActions,
            {
              failureBonusRate: node.failureBonusRate,
              artisanEnergy: artisanToNumber(
                startArtisan + node.accumulatedRate * ARTISAN_PER_SUCCESS_RATE,
              ),
              action,
              immediateGold,
            },
          ],
        });
        continue;
      }

      for (const action of actionsForFailureBonusRate(node.failureBonusRate)) {
        if (action.breathQuantity > node.maximumBreathQuantity) continue;
        evaluatedActions += 1;
        const { marketGold, nextConsumedMaterials } = materialCost(input, node.consumedMaterials, [
          ...input.step.requiredMaterials,
          ...optionalConsumptions(input.step, action),
        ]);
        const immediateGold = input.step.gold + marketGold;
        candidates.push({
          attempts: node.attempts + 1,
          failureBonusRate: nextFailureBonusRate(input.step.initialRate, node.failureBonusRate),
          accumulatedRate: Math.min(guaranteeRate, node.accumulatedRate + action.successRate),
          maximumBreathQuantity: action.breathQuantity,
          reachProbability: node.reachProbability * (1 - action.successRate / 10_000),
          expectedGold: node.expectedGold + node.reachProbability * immediateGold,
          priorityGold:
            node.expectedGold +
            node.reachProbability *
              (immediateGold +
                (1 - action.successRate / 10_000) *
                  estimatedContinuation(
                    nextFailureBonusRate(input.step.initialRate, node.failureBonusRate),
                    Math.min(guaranteeRate, node.accumulatedRate + action.successRate),
                    action.breathQuantity,
                  )),
          consumedMaterials: nextConsumedMaterials,
          conditionalActions: [
            ...node.conditionalActions,
            {
              failureBonusRate: node.failureBonusRate,
              artisanEnergy: artisanToNumber(
                startArtisan + node.accumulatedRate * ARTISAN_PER_SUCCESS_RATE,
              ),
              action,
              immediateGold,
            },
          ],
        });
      }
    }
    frontier = candidates.sort(comparePolicyNodes).slice(0, POLICY_FRONTIER_WIDTH);
  }

  const selected = completed.sort(comparePolicyNodes)[0];
  if (!selected) throw new Error('No refining policy reached the artisan guarantee.');

  const usage = {} as Record<
    TRefiningMaterialId,
    { owned: number; purchased: number; total: number; gold: number }
  >;
  const reportRemaining: TConsumedMaterials = {};
  for (const id of relevantIds) reportRemaining[id] = input.ownedMaterials?.[id] ?? 0;
  let expectedAttempts = 0;
  let expectedPureGold = 0;
  let expectedMarketGold = 0;
  let reachProbability = 1;
  let worstGold = 0;
  for (const row of selected.conditionalActions) {
    const consumptions = [
      ...input.step.requiredMaterials,
      ...optionalConsumptions(input.step, row.action),
    ];
    let attemptMarketGold = 0;
    for (const { id, quantity } of consumptions) {
      if (!quantity) continue;
      const ownedUsed = Math.min(reportRemaining[id] ?? 0, quantity);
      const purchased = quantity - ownedUsed;
      reportRemaining[id] = (reportRemaining[id] ?? 0) - ownedUsed;
      const gold = purchased * input.prices[id];
      const current = usage[id] ?? { owned: 0, purchased: 0, total: 0, gold: 0 };
      usage[id] = {
        owned: current.owned + reachProbability * ownedUsed,
        purchased: current.purchased + reachProbability * purchased,
        total: current.total + reachProbability * quantity,
        gold: current.gold + reachProbability * gold,
      };
      attemptMarketGold += gold;
    }
    expectedAttempts += reachProbability;
    expectedPureGold += reachProbability * input.step.gold;
    expectedMarketGold += reachProbability * attemptMarketGold;
    worstGold += row.immediateGold;
    reachProbability *= 1 - row.action.successRate / 10_000;
  }

  const plan: TRefiningPlan = {
    expectedGold: selected.expectedGold,
    expectedShilling: input.step.shilling * expectedAttempts,
    expectedAttempts,
    materialExpectations: Object.fromEntries(
      Object.entries(usage).map(([id, value]) => [
        id,
        {
          expectedOwnedUsed: value.owned,
          expectedPurchased: value.purchased,
          expectedTotalUsed: value.total,
          expectedGold: value.gold,
        },
      ]),
    ) as TRefiningPlan['materialExpectations'],
    goldBreakdown: { pureGold: expectedPureGold, marketMaterials: expectedMarketGold },
    conditionalActions: selected.conditionalActions,
    recommendedWorstCase: {
      attempts: selected.conditionalActions.length,
      gold: worstGold,
      shilling: input.step.shilling * selected.conditionalActions.length,
      conditionalActions: selected.conditionalActions,
    },
  };
  onMetrics?.({
    evaluatedActions,
    inventoryStateCount: 1,
    inventoryTransitionCount: 0,
    isFreeMaxRatePath: false,
    maximumStateKey: maxFailureAttempts * (guaranteeRate + 1) * (input.step.breathMax + 1),
    memoEntries: 0,
    memoHits: 0,
    solveCalls: 0,
  });
  return plan;
}

export function calculateRefiningPlanWithNonIncreasingBreath(
  input: TRefiningPlanInput,
  onMetrics?: (metrics: TRefiningPlanMetrics) => void,
): TRefiningPlan {
  return calculateRefiningPlan(input, onMetrics);
}
