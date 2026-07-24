import type {
  TBookOption,
  TMarketMaterialId,
  TMaterialExpectation,
  TRefiningAction,
  TRefiningPlan,
  TRefiningPlanInput,
} from '@/app/lostark/refining/_type/refining';

const ARTISAN_SCALE = 1_000_000;
const ARTISAN_DENOMINATOR = 215 * ARTISAN_SCALE;
const GUARANTEE_ARTISAN = 10_000 * ARTISAN_DENOMINATOR;
const ARTISAN_PER_SUCCESS_RATE = 100 * ARTISAN_SCALE;
const NONE: TBookOption = { kind: 'none' };
const ZERO_USAGE = { owned: 0, purchased: 0, total: 0, gold: 0 };

type TRemaining = Partial<Record<TMarketMaterialId, number>>;
type TState = { failures: number; accumulatedRate: number; remainingCode: number };
type TScalarValue = { gold: number; action: TRefiningAction };
type TInventorySlot = {
  id: TMarketMaterialId;
  base: number;
  multiplier: number;
};
type TUsage = Record<
  TMarketMaterialId,
  { owned: number; purchased: number; total: number; gold: number }
>;

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

function currentBaseRate(initialRate: number, failures: number) {
  return Math.min(initialRate + failures * (initialRate / 10), initialRate * 2);
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

function bookMaterialId(book: TBookOption): TMarketMaterialId | undefined {
  return book.kind === 'none' ? undefined : book.materialId;
}

function optionalConsumptions(
  step: TRefiningPlanInput['step'],
  action: TRefiningAction,
): readonly { id: TMarketMaterialId; quantity: number }[] {
  const bookId = bookMaterialId(action.book);
  return [
    { id: step.breathMaterialId, quantity: action.breathQuantity },
    ...(bookId ? [{ id: bookId, quantity: 1 }] : []),
  ];
}

export function getRefiningActions(
  step: TRefiningPlanInput['step'],
  failureCount: number,
): readonly TRefiningAction[] {
  return step.books.flatMap((book) =>
    Array.from({ length: step.breathMax + 1 }, (_, breathQuantity) => ({
      breathQuantity,
      book,
      successRate: Math.min(
        10_000,
        currentBaseRate(step.initialRate, failureCount) +
          breathQuantity * step.breathRateBonus +
          (book.kind === 'none' ? 0 : book.rateBonus),
      ),
    })),
  );
}

export function calculateRefiningPlan(input: TRefiningPlanInput): TRefiningPlan {
  if (!Number.isInteger(input.failureCount) || input.failureCount < 0)
    throw new Error('failureCount must be a non-negative integer.');
  for (const [id, owned] of Object.entries(input.ownedMaterials ?? {})) {
    if (!owned || !Number.isInteger(owned.quantity) || owned.quantity < 0)
      throw new Error(`Invalid owned quantity: ${id}`);
  }

  const relevantIds = new Set<TMarketMaterialId>([
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
  const optionalIds = new Set<TMarketMaterialId>([
    input.step.breathMaterialId,
    ...input.step.books.flatMap((book) => (book.kind === 'none' ? [] : [book.materialId])),
  ]);
  const actionsByFailure = new Map<number, readonly TRefiningAction[]>();

  function actionsForFailure(failures: number) {
    const cached = actionsByFailure.get(failures);
    if (cached) return cached;
    const actions = getRefiningActions(input.step, failures);
    actionsByFailure.set(failures, actions);
    return actions;
  }

  // No failure path can outlive this bound: even the cheapest-rate action adds
  // positive artisan energy on every failure.
  let boundFailures = input.failureCount;
  let boundAccumulatedRate = 0;
  let maxFailureAttempts = 0;
  while (boundAccumulatedRate < guaranteeRate) {
    const minimumRate = Math.min(
      ...actionsForFailure(boundFailures).map((action) => action.successRate),
    );
    boundAccumulatedRate += minimumRate;
    boundFailures += 1;
    maxFailureAttempts += 1;
  }

  const optionalIdList = [...optionalIds].filter((id) => {
    const owned = input.ownedMaterials?.[id];
    return owned && !owned.isValuedAtMarket && owned.quantity > 0 && input.prices[id] > 0;
  });
  const initialRemaining: TRemaining = {};
  for (const id of optionalIdList) {
    const perAttemptMaximum =
      id === input.step.breathMaterialId
        ? input.step.breathMax
        : input.step.books.some((book) => book.kind !== 'none' && book.materialId === id)
          ? 1
          : 0;
    initialRemaining[id] = Math.min(
      input.ownedMaterials?.[id]?.quantity ?? 0,
      perAttemptMaximum * maxFailureAttempts,
    );
  }
  const inventorySlotById = new Map<TMarketMaterialId, TInventorySlot>();
  let inventoryStateCount = 1;
  let initialRemainingCode = 0;
  for (const id of optionalIdList) {
    const quantity = initialRemaining[id] ?? 0;
    const slot = { id, base: quantity + 1, multiplier: inventoryStateCount };
    inventorySlotById.set(id, slot);
    initialRemainingCode += quantity * slot.multiplier;
    inventoryStateCount *= slot.base;
  }
  if (!Number.isSafeInteger(inventoryStateCount))
    throw new Error('Optional material inventory is too large to optimize exactly.');

  function requiredAttemptCost(state: TState) {
    const elapsedAttempts = state.failures - input.failureCount;
    return input.step.requiredMaterials.reduce((total, material) => {
      const owned = input.ownedMaterials?.[material.id];
      if (!owned || owned.isValuedAtMarket)
        return total + material.quantity * input.prices[material.id];
      const freeRemaining = Math.max(0, owned.quantity - elapsedAttempts * material.quantity);
      const purchased = material.quantity - Math.min(freeRemaining, material.quantity);
      return total + purchased * input.prices[material.id];
    }, input.step.gold);
  }

  function consumeOptional(remainingCode: number, action: TRefiningAction) {
    let nextRemainingCode = remainingCode;
    let gold = 0;
    for (const { id, quantity } of optionalConsumptions(input.step, action)) {
      if (!quantity) continue;
      const slot = inventorySlotById.get(id);
      const remaining = slot ? Math.floor(remainingCode / slot.multiplier) % slot.base : 0;
      const free = Math.min(remaining, quantity);
      if (slot) nextRemainingCode -= free * slot.multiplier;
      gold += (quantity - free) * input.prices[id];
    }
    return { remainingCode: nextRemainingCode, gold };
  }

  function maxRateAction(failures: number) {
    return actionsForFailure(failures).reduce((best, action) => {
      if (action.successRate > best.successRate) return action;
      if (action.successRate === best.successRate && tieBreaker(action, best) < 0) return action;
      return best;
    });
  }

  // When the maximum-rate failure path can consume every optional item for free
  // (or its market price is zero), every competing action has the same or a
  // higher immediate cost and a weakly worse chance of reaching later costs.
  const maxPathConsumption: TRemaining = {};
  let maxPathFailures = input.failureCount;
  let maxPathAccumulatedRate = 0;
  while (maxPathAccumulatedRate < guaranteeRate) {
    const action = maxRateAction(maxPathFailures);
    for (const { id, quantity } of optionalConsumptions(input.step, action))
      maxPathConsumption[id] = (maxPathConsumption[id] ?? 0) + quantity;
    maxPathAccumulatedRate += action.successRate;
    maxPathFailures += 1;
  }
  const isFreeMaxRatePath = [...optionalIds].every((id) => {
    const requiredQuantity = maxPathConsumption[id] ?? 0;
    if (requiredQuantity === 0) return true;
    if (input.prices[id] === 0) return true;
    const owned = input.ownedMaterials?.[id];
    return Boolean(owned && !owned.isValuedAtMarket && owned.quantity >= requiredQuantity);
  });

  const rateStateCount = guaranteeRate + 1;
  const maximumStateKey = maxFailureAttempts * rateStateCount * inventoryStateCount;
  if (!Number.isSafeInteger(maximumStateKey))
    throw new Error('Refining state space is too large to optimize exactly.');
  const memo = new Map<number, TScalarValue>();
  const noInventoryActionCache = new Map<
    number,
    { action: TRefiningAction; optionalGold: number; nextRemainingCode: number }[]
  >();
  const inventoryTransitionCache = new Map<
    number,
    { gold: Float64Array; nextRemainingCode: Float64Array }
  >();
  const transitionActions = actionsForFailure(input.failureCount);

  function actionIndex(action: TRefiningAction) {
    const bookIndex = input.step.books.indexOf(action.book);
    if (bookIndex < 0) return -1;
    return bookIndex * (input.step.breathMax + 1) + action.breathQuantity;
  }

  function inventoryTransitions(remainingCode: number) {
    const cached = inventoryTransitionCache.get(remainingCode);
    if (cached) return cached;
    const gold = new Float64Array(transitionActions.length);
    const nextRemainingCode = new Float64Array(transitionActions.length);
    for (let index = 0; index < transitionActions.length; index += 1) {
      const transition = consumeOptional(remainingCode, transitionActions[index]);
      gold[index] = transition.gold;
      nextRemainingCode[index] = transition.remainingCode;
    }
    const transitions = { gold, nextRemainingCode };
    inventoryTransitionCache.set(remainingCode, transitions);
    return transitions;
  }

  function stateKey(state: TState) {
    const failureOffset = state.failures - input.failureCount;
    return (
      (failureOffset * rateStateCount + state.accumulatedRate) * inventoryStateCount +
      state.remainingCode
    );
  }

  function solve(state: TState): TScalarValue {
    const key = stateKey(state);
    const cached = memo.get(key);
    if (cached) return cached;

    const guaranteed = state.accumulatedRate >= guaranteeRate;
    const rawActions: readonly TRefiningAction[] = guaranteed
      ? [{ breathQuantity: 0, book: NONE, successRate: 10_000 }]
      : isFreeMaxRatePath
        ? [maxRateAction(state.failures)]
        : actionsForFailure(state.failures);
    let best: TScalarValue | undefined;
    const requiredGold = requiredAttemptCost(state);
    if (optionalIdList.length > 0) {
      const transitions = inventoryTransitions(state.remainingCode);
      for (const action of rawActions) {
        const index = actionIndex(action);
        const optionalGold = index < 0 ? 0 : transitions.gold[index];
        const nextRemainingCode =
          index < 0 ? state.remainingCode : transitions.nextRemainingCode[index];
        const immediate = requiredGold + optionalGold;
        const probability = action.successRate / 10_000;
        const gold = guaranteed
          ? immediate
          : immediate +
            (1 - probability) *
              solve({
                failures: state.failures + 1,
                accumulatedRate: Math.min(
                  guaranteeRate,
                  state.accumulatedRate + action.successRate,
                ),
                remainingCode: nextRemainingCode,
              }).gold;
        if (
          !best ||
          gold < best.gold ||
          (gold === best.gold && tieBreaker(action, best.action) < 0)
        )
          best = { gold, action };
      }
    } else {
      let actions: {
        action: TRefiningAction;
        optionalGold: number;
        nextRemainingCode: number;
      }[];
      const cachedActions = guaranteed ? undefined : noInventoryActionCache.get(state.failures);
      if (cachedActions) actions = cachedActions;
      else {
        let highestRate = -1;
        actions = rawActions
          .map((action) => {
            const optional = consumeOptional(state.remainingCode, action);
            return {
              action,
              optionalGold: optional.gold,
              nextRemainingCode: optional.remainingCode,
            };
          })
          .sort(
            (left, right) =>
              left.optionalGold - right.optionalGold ||
              right.action.successRate - left.action.successRate ||
              tieBreaker(left.action, right.action),
          )
          .filter(({ action }) => {
            if (action.successRate <= highestRate) return false;
            highestRate = action.successRate;
            return true;
          });
        if (!guaranteed) noInventoryActionCache.set(state.failures, actions);
      }
      for (const { action, optionalGold, nextRemainingCode } of actions) {
        const immediate = requiredGold + optionalGold;
        const probability = action.successRate / 10_000;
        const gold = guaranteed
          ? immediate
          : immediate +
            (1 - probability) *
              solve({
                failures: state.failures + 1,
                accumulatedRate: Math.min(
                  guaranteeRate,
                  state.accumulatedRate + action.successRate,
                ),
                remainingCode: nextRemainingCode,
              }).gold;
        if (
          !best ||
          gold < best.gold ||
          (gold === best.gold && tieBreaker(action, best.action) < 0)
        )
          best = { gold, action };
      }
    }
    if (!best) throw new Error('No refining action exists.');
    memo.set(key, best);
    return best;
  }

  const start: TState = {
    failures: input.failureCount,
    accumulatedRate: 0,
    remainingCode: initialRemainingCode,
  };
  const expectedGold = solve(start).gold;

  const usage = {} as TUsage;
  const reportRemaining: TRemaining = {};
  for (const id of relevantIds) reportRemaining[id] = input.ownedMaterials?.[id]?.quantity ?? 0;
  let expectedAttempts = 0;
  let expectedPureGold = 0;
  let expectedMarketGold = 0;
  let reachProbability = 1;
  let trace = start;
  let worstGold = 0;
  let worstAttempts = 0;
  const conditionalActions: TRefiningPlan['conditionalActions'][number][] = [];
  const worstActions: TRefiningPlan['recommendedWorstCase']['conditionalActions'][number][] = [];

  while (true) {
    const action = solve(trace).action;
    const consumptions = [
      ...input.step.requiredMaterials,
      ...optionalConsumptions(input.step, action),
    ];
    let attemptMarketGold = 0;
    for (const { id, quantity } of consumptions) {
      if (!quantity) continue;
      const ownedUsed = Math.min(reportRemaining[id] ?? 0, quantity);
      const purchased = quantity - ownedUsed;
      reportRemaining[id] = (reportRemaining[id] ?? 0) - ownedUsed;
      const isValued = input.ownedMaterials?.[id]?.isValuedAtMarket ?? false;
      const gold = (isValued ? ownedUsed * input.prices[id] : 0) + purchased * input.prices[id];
      const current = usage[id] ?? ZERO_USAGE;
      usage[id] = {
        owned: current.owned + reachProbability * ownedUsed,
        purchased: current.purchased + reachProbability * purchased,
        total: current.total + reachProbability * quantity,
        gold: current.gold + reachProbability * gold,
      };
      attemptMarketGold += gold;
    }

    const immediateGold = input.step.gold + attemptMarketGold;
    expectedAttempts += reachProbability;
    expectedPureGold += reachProbability * input.step.gold;
    expectedMarketGold += reachProbability * attemptMarketGold;
    worstAttempts += 1;
    worstGold += immediateGold;
    conditionalActions.push({
      failureCount: trace.failures,
      artisanEnergy: artisanToNumber(
        startArtisan + trace.accumulatedRate * ARTISAN_PER_SUCCESS_RATE,
      ),
      action,
      immediateGold,
    });
    worstActions.push({
      failureCount: trace.failures,
      artisanEnergy: artisanToNumber(
        startArtisan + trace.accumulatedRate * ARTISAN_PER_SUCCESS_RATE,
      ),
      action,
      immediateGold,
    });

    if (trace.accumulatedRate >= guaranteeRate) break;
    const optional = consumeOptional(trace.remainingCode, action);
    reachProbability *= 1 - action.successRate / 10_000;
    trace = {
      failures: trace.failures + 1,
      accumulatedRate: Math.min(guaranteeRate, trace.accumulatedRate + action.successRate),
      remainingCode: optional.remainingCode,
    };
  }

  const materialExpectations = Object.fromEntries(
    Object.entries(usage).map(([id, value]) => [
      id,
      {
        expectedOwnedUsed: value.owned,
        expectedPurchased: value.purchased,
        expectedTotalUsed: value.total,
        expectedGold: value.gold,
      } satisfies TMaterialExpectation,
    ]),
  ) as TRefiningPlan['materialExpectations'];

  return {
    expectedGold,
    expectedSilver: input.step.silver * expectedAttempts,
    expectedAttempts,
    materialExpectations,
    goldBreakdown: {
      pureGold: expectedPureGold,
      marketMaterials: expectedMarketGold,
    },
    conditionalActions,
    recommendedWorstCase: {
      attempts: worstAttempts,
      gold: worstGold,
      silver: input.step.silver * worstAttempts,
      conditionalActions: worstActions,
    },
  };
}
