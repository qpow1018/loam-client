# Lost Ark Clear Gold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a desktop-only `/lostark/clear-gold` page that lets users select Kazeroth Act 1 normal or hard and inspect entry level plus per-gate tradable, bound, and total clear gold.

**Architecture:** Keep the feature route-local: typed static reward data in `_define`, pure sum/format helpers in `_util`, and two focused view components in `_component`. `page.tsx` remains a server component while `ClearGoldClient.tsx` owns only the selected difficulty id; totals are always derived from gate values.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, SCSS Modules, Node built-in test runner, ESLint, webpack production build

---

## File map

- Create `src/app/lostark/clear-gold/page.tsx`: server route entry.
- Create `src/app/lostark/clear-gold/ClearGoldClient.tsx`: client selection state and master-detail composition.
- Create `src/app/lostark/clear-gold/clearGoldClient.module.scss`: 1024px page shell and desktop two-column layout.
- Create `src/app/lostark/clear-gold/_type/clearGold.ts`: route-local content, difficulty, gate, and summary types.
- Create `src/app/lostark/clear-gold/_define/clearGoldContents.ts`: Kazeroth Act 1 normal/hard static data.
- Create `src/app/lostark/clear-gold/_util/clearGold.ts`: pure total and number-format helpers.
- Create `src/app/lostark/clear-gold/_util/clearGold.test.ts`: built-in Node tests for empty, mixed, and initial reward totals.
- Create `src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx`: hierarchical content/difficulty selector.
- Create `src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss`: selector styling and selected state.
- Create `src/app/lostark/clear-gold/_component/ClearGoldDetail.tsx`: summary cards, gate table, and updated date.
- Create `src/app/lostark/clear-gold/_component/clearGoldDetail.module.scss`: detail card and table styling.
- Modify `src/components/lostark/header/LostarkHeader.tsx`: add the `클리어 골드` navigation item.

### Task 1: Define and test gold calculations

**Files:**
- Create: `src/app/lostark/clear-gold/_type/clearGold.ts`
- Create: `src/app/lostark/clear-gold/_util/clearGold.test.ts`
- Create: `src/app/lostark/clear-gold/_util/clearGold.ts`

- [ ] **Step 1: Define the route-local data contracts**

Create `src/app/lostark/clear-gold/_type/clearGold.ts`:

```ts
export type TClearGoldGate = {
  name: string;
  tradableGold: number;
  boundGold: number;
};

export type TClearGoldDifficulty = {
  id: string;
  name: string;
  entryItemLevel: number;
  updatedAt: string;
  gates: readonly TClearGoldGate[];
};

export type TClearGoldContent = {
  id: string;
  name: string;
  difficulties: readonly TClearGoldDifficulty[];
};

export type TClearGoldSummary = {
  tradableGold: number;
  boundGold: number;
  totalGold: number;
};
```

- [ ] **Step 2: Write failing tests for sum and formatting behavior**

Create `src/app/lostark/clear-gold/_util/clearGold.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import type { TClearGoldGate } from '../_type/clearGold';
import { calculateClearGoldSummary, formatGold } from './clearGold';

test('calculateClearGoldSummary returns zero totals for no gates', () => {
  assert.deepEqual(calculateClearGoldSummary([]), {
    tradableGold: 0,
    boundGold: 0,
    totalGold: 0,
  });
});

test('calculateClearGoldSummary separates tradable and bound gold', () => {
  const gates: TClearGoldGate[] = [
    { name: '1관문', tradableGold: 1000, boundGold: 2000 },
    { name: '2관문', tradableGold: 1500, boundGold: 500 },
  ];

  assert.deepEqual(calculateClearGoldSummary(gates), {
    tradableGold: 2500,
    boundGold: 2500,
    totalGold: 5000,
  });
});

test('formatGold applies Korean thousands separators and keeps zero explicit', () => {
  assert.equal(formatGold(11500), '11,500');
  assert.equal(formatGold(0), '0');
});
```

- [ ] **Step 3: Compile and run the test to verify it fails**

Run:

```bash
rm -rf /tmp/loam-clear-gold-tests
npx tsc \
  src/app/lostark/clear-gold/_util/clearGold.test.ts \
  src/app/lostark/clear-gold/_type/clearGold.ts \
  --outDir /tmp/loam-clear-gold-tests \
  --module commonjs \
  --moduleResolution node \
  --target es2022 \
  --esModuleInterop \
  --skipLibCheck
```

Expected: TypeScript fails with `Cannot find module './clearGold'` because the helper has not been created.

- [ ] **Step 4: Implement the minimal pure helpers**

Create `src/app/lostark/clear-gold/_util/clearGold.ts`:

```ts
import type { TClearGoldGate, TClearGoldSummary } from '../_type/clearGold';

const GOLD_NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR');

export function calculateClearGoldSummary(
  gates: readonly TClearGoldGate[],
): TClearGoldSummary {
  const summary = gates.reduce(
    (acc, gate) => ({
      tradableGold: acc.tradableGold + gate.tradableGold,
      boundGold: acc.boundGold + gate.boundGold,
    }),
    { tradableGold: 0, boundGold: 0 },
  );

  return {
    ...summary,
    totalGold: summary.tradableGold + summary.boundGold,
  };
}

export function formatGold(value: number) {
  return GOLD_NUMBER_FORMATTER.format(value);
}
```

- [ ] **Step 5: Compile and run the tests to verify they pass**

Run:

```bash
rm -rf /tmp/loam-clear-gold-tests
npx tsc \
  src/app/lostark/clear-gold/_util/clearGold.test.ts \
  src/app/lostark/clear-gold/_util/clearGold.ts \
  src/app/lostark/clear-gold/_type/clearGold.ts \
  --outDir /tmp/loam-clear-gold-tests \
  --module commonjs \
  --moduleResolution node \
  --target es2022 \
  --esModuleInterop \
  --skipLibCheck
node --test /tmp/loam-clear-gold-tests/_util/clearGold.test.js
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Commit the calculation slice**

```bash
git add src/app/lostark/clear-gold/_type/clearGold.ts \
  src/app/lostark/clear-gold/_util/clearGold.ts \
  src/app/lostark/clear-gold/_util/clearGold.test.ts
git commit -m "feat: add clear gold calculations"
```

### Task 2: Add verified static Kazeroth Act 1 data

**Files:**
- Modify: `src/app/lostark/clear-gold/_util/clearGold.test.ts`
- Create: `src/app/lostark/clear-gold/_define/clearGoldContents.ts`

- [ ] **Step 1: Add failing assertions for the initial normal and hard totals**

Add these imports and tests to `src/app/lostark/clear-gold/_util/clearGold.test.ts`:

```ts
import { CLEAR_GOLD_CONTENTS } from '../_define/clearGoldContents';

test('Kazeroth Act 1 normal totals 11,500 tradable gold', () => {
  const normal = CLEAR_GOLD_CONTENTS[0]?.difficulties[0];

  assert.ok(normal);
  assert.equal(normal.entryItemLevel, 1660);
  assert.deepEqual(calculateClearGoldSummary(normal.gates), {
    tradableGold: 11500,
    boundGold: 0,
    totalGold: 11500,
  });
});

test('Kazeroth Act 1 hard totals 18,000 tradable gold', () => {
  const hard = CLEAR_GOLD_CONTENTS[0]?.difficulties[1];

  assert.ok(hard);
  assert.equal(hard.entryItemLevel, 1680);
  assert.deepEqual(calculateClearGoldSummary(hard.gates), {
    tradableGold: 18000,
    boundGold: 0,
    totalGold: 18000,
  });
});
```

- [ ] **Step 2: Compile to verify the data test fails**

Run the Task 1 compile command with `_define/clearGoldContents.ts` omitted.

Expected: TypeScript fails with `Cannot find module '../_define/clearGoldContents'`.

- [ ] **Step 3: Add the minimal static reward data**

Create `src/app/lostark/clear-gold/_define/clearGoldContents.ts`:

```ts
import type { TClearGoldContent } from '../_type/clearGold';

export const CLEAR_GOLD_CONTENTS = [
  {
    id: 'kazeroth-act-1',
    name: '카제로스 레이드 1막',
    difficulties: [
      {
        id: 'kazeroth-act-1-normal',
        name: '노말',
        entryItemLevel: 1660,
        updatedAt: '2026.03.15',
        gates: [
          { name: '1관문', tradableGold: 3500, boundGold: 0 },
          { name: '2관문', tradableGold: 8000, boundGold: 0 },
        ],
      },
      {
        id: 'kazeroth-act-1-hard',
        name: '하드',
        entryItemLevel: 1680,
        updatedAt: '2026.03.15',
        gates: [
          { name: '1관문', tradableGold: 5500, boundGold: 0 },
          { name: '2관문', tradableGold: 12500, boundGold: 0 },
        ],
      },
    ],
  },
] as const satisfies readonly TClearGoldContent[];
```

- [ ] **Step 4: Compile and run all five utility/data tests**

Run:

```bash
rm -rf /tmp/loam-clear-gold-tests
npx tsc \
  src/app/lostark/clear-gold/_util/clearGold.test.ts \
  src/app/lostark/clear-gold/_util/clearGold.ts \
  src/app/lostark/clear-gold/_type/clearGold.ts \
  src/app/lostark/clear-gold/_define/clearGoldContents.ts \
  --outDir /tmp/loam-clear-gold-tests \
  --module commonjs \
  --moduleResolution node \
  --target es2022 \
  --esModuleInterop \
  --skipLibCheck
node --test /tmp/loam-clear-gold-tests/_util/clearGold.test.js
```

Expected: 5 tests pass, 0 fail.

- [ ] **Step 5: Commit the verified initial data**

```bash
git add src/app/lostark/clear-gold/_define/clearGoldContents.ts \
  src/app/lostark/clear-gold/_util/clearGold.test.ts
git commit -m "feat: add Kazeroth clear gold data"
```

### Task 3: Build the hierarchical selector and detail view

**Files:**
- Create: `src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx`
- Create: `src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss`
- Create: `src/app/lostark/clear-gold/_component/ClearGoldDetail.tsx`
- Create: `src/app/lostark/clear-gold/_component/clearGoldDetail.module.scss`

- [ ] **Step 1: Create the content/difficulty selector component**

Create `src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx`:

```tsx
import type { TClearGoldContent } from '../_type/clearGold';

import styles from './clearGoldContentList.module.scss';

export default function ClearGoldContentList(props: {
  contents: readonly TClearGoldContent[];
  selectedDifficultyId: string;
  onSelectDifficulty: (difficultyId: string) => void;
}) {
  const { contents, selectedDifficultyId, onSelectDifficulty } = props;

  return (
    <aside className={styles['content-list']} aria-label="클리어 골드 콘텐츠 목록">
      <h1 className={styles['title']}>클리어 골드</h1>

      <div className={styles['content-groups']}>
        {contents.map((content) => (
          <section key={content.id} className={styles['content-group']}>
            <h2 className={styles['content-name']}>{content.name}</h2>

            <div className={styles['difficulty-list']}>
              {content.difficulties.map((difficulty) => {
                const isSelected = difficulty.id === selectedDifficultyId;

                return (
                  <button
                    key={difficulty.id}
                    type="button"
                    className={`${styles['difficulty-button']} ${
                      isSelected ? styles['is-selected'] : ''
                    }`}
                    aria-pressed={isSelected}
                    onClick={() => onSelectDifficulty(difficulty.id)}
                  >
                    <span>{difficulty.name}</span>
                    <span className={styles['item-level']}>Lv. {difficulty.entryItemLevel}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Style the fixed-width hierarchical selector**

Create `src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss`:

```scss
.content-list {
  width: 280px;
  flex-shrink: 0;
  padding: 16px;
  border-radius: $border-radius;
  background: $gray-800;

  .title {
    padding-bottom: 12px;
    border-bottom: 1px solid $gray-600;
    font-size: 13px;
    font-weight: 500;
  }

  .content-groups {
    margin-top: 16px;
  }

  .content-group {
    & + .content-group {
      margin-top: 20px;
    }

    .content-name {
      margin-bottom: 8px;
      color: $text-secondary;
      font-size: 12px;
      font-weight: 500;
    }

    .difficulty-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .difficulty-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 12px;
      border: 1px solid $gray-600;
      border-radius: $border-radius;
      background: $gray-700;
      color: $text-primary;
      font-size: 12px;
      text-align: left;
      transition: $transition;
      cursor: pointer;

      &:hover,
      &.is-selected {
        border-color: $mint-500;
        background: $mint-900;
      }

      .item-level {
        color: $gray-300;
        font-size: 11px;
      }
    }
  }
}
```

- [ ] **Step 3: Create the derived summary and gate table**

Create `src/app/lostark/clear-gold/_component/ClearGoldDetail.tsx`:

```tsx
import type { TClearGoldDifficulty } from '../_type/clearGold';
import { calculateClearGoldSummary, formatGold } from '../_util/clearGold';

import styles from './clearGoldDetail.module.scss';

export default function ClearGoldDetail(props: {
  contentName?: string;
  difficulty?: TClearGoldDifficulty;
}) {
  const { contentName, difficulty } = props;

  if (difficulty === undefined || contentName === undefined) {
    return (
      <section className={styles['empty']}>
        <p>확인할 콘텐츠와 난이도를 선택해 주세요.</p>
      </section>
    );
  }

  const summary = calculateClearGoldSummary(difficulty.gates);

  return (
    <section className={styles['detail']}>
      <header className={styles['detail-header']}>
        <div>
          <p className={styles['content-name']}>{contentName}</p>
          <h1>{difficulty.name}</h1>
        </div>
        <span className={styles['item-level']}>입장 Lv. {difficulty.entryItemLevel}</span>
      </header>

      <div className={styles['summary-list']}>
        <div className={styles['summary-item']}>
          <span>일반 골드</span>
          <strong>{formatGold(summary.tradableGold)}</strong>
        </div>
        <div className={styles['summary-item']}>
          <span>귀속 골드</span>
          <strong>{formatGold(summary.boundGold)}</strong>
        </div>
        <div className={styles['summary-item']}>
          <span>총 획득 골드</span>
          <strong>{formatGold(summary.totalGold)}</strong>
        </div>
      </div>

      <div className={styles['gate-table']}>
        <div className={styles['gate-row']} role="row">
          <span role="columnheader">관문</span>
          <span role="columnheader">일반 골드</span>
          <span role="columnheader">귀속 골드</span>
          <span role="columnheader">합계</span>
        </div>

        {difficulty.gates.map((gate) => (
          <div key={gate.name} className={styles['gate-row']} role="row">
            <span role="cell">{gate.name}</span>
            <span role="cell">{formatGold(gate.tradableGold)}</span>
            <span role="cell">{formatGold(gate.boundGold)}</span>
            <strong role="cell">{formatGold(gate.tradableGold + gate.boundGold)}</strong>
          </div>
        ))}
      </div>

      <p className={styles['updated-at']}>데이터 기준: {difficulty.updatedAt}</p>
    </section>
  );
}
```

- [ ] **Step 4: Style the detail summary and table**

Create `src/app/lostark/clear-gold/_component/clearGoldDetail.module.scss`:

```scss
.detail,
.empty {
  flex: 1;
  min-width: 0;
  border-radius: $border-radius;
  background: $gray-800;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  color: $text-secondary;
  font-size: 13px;
}

.detail {
  padding: 16px;

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid $gray-600;

    .content-name {
      margin-bottom: 3px;
      color: $text-secondary;
      font-size: 11px;
    }

    h1 {
      font-size: 16px;
      font-weight: 500;
    }

    .item-level {
      padding: 5px 8px;
      border-radius: $border-radius;
      background: $gray-700;
      color: $mint-300;
      font-size: 11px;
    }
  }

  .summary-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 16px;

    .summary-item {
      padding: 14px;
      border-radius: $border-radius;
      background: $gray-700;

      span {
        display: block;
        margin-bottom: 6px;
        color: $text-secondary;
        font-size: 11px;
      }

      strong {
        color: $mint-300;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .gate-table {
    margin-top: 16px;
    border: 1px solid $gray-600;
    border-radius: $border-radius;
    overflow: hidden;

    .gate-row {
      display: grid;
      grid-template-columns: 1fr repeat(3, 120px);

      & + .gate-row {
        border-top: 1px solid $gray-600;
      }

      &:first-child {
        background: $gray-700;
        color: $text-secondary;
      }

      span,
      strong {
        padding: 11px 12px;
        font-size: 12px;
        text-align: right;

        &:first-child {
          text-align: left;
        }
      }

      strong {
        color: $mint-300;
        font-weight: 500;
      }
    }
  }

  .updated-at {
    margin-top: 10px;
    color: $gray-400;
    font-size: 10px;
    text-align: right;
  }
}
```

- [ ] **Step 5: Run targeted formatting and lint checks**

Run:

```bash
npx prettier --check \
  src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx \
  src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss \
  src/app/lostark/clear-gold/_component/ClearGoldDetail.tsx \
  src/app/lostark/clear-gold/_component/clearGoldDetail.module.scss
npm run lint
```

Expected: Prettier reports all four files formatted and ESLint exits with no errors.

- [ ] **Step 6: Commit the two view components**

```bash
git add src/app/lostark/clear-gold/_component
git commit -m "feat: add clear gold reward views"
```

### Task 4: Compose the page and add navigation

**Files:**
- Create: `src/app/lostark/clear-gold/page.tsx`
- Create: `src/app/lostark/clear-gold/ClearGoldClient.tsx`
- Create: `src/app/lostark/clear-gold/clearGoldClient.module.scss`
- Modify: `src/components/lostark/header/LostarkHeader.tsx:3-8`

- [ ] **Step 1: Add the server route entry**

Create `src/app/lostark/clear-gold/page.tsx`:

```tsx
import ClearGoldClient from './ClearGoldClient';

export default function ClearGoldPage() {
  return <ClearGoldClient />;
}
```

- [ ] **Step 2: Compose selection state without duplicating reward data**

Create `src/app/lostark/clear-gold/ClearGoldClient.tsx`:

```tsx
'use client';

import { useState } from 'react';

import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import ClearGoldContentList from './_component/ClearGoldContentList';
import ClearGoldDetail from './_component/ClearGoldDetail';
import { CLEAR_GOLD_CONTENTS } from './_define/clearGoldContents';

import styles from './clearGoldClient.module.scss';

const DEFAULT_DIFFICULTY_ID = CLEAR_GOLD_CONTENTS[0]?.difficulties[0]?.id ?? '';

export default function ClearGoldClient() {
  const [selectedDifficultyId, setSelectedDifficultyId] =
    useState<string>(DEFAULT_DIFFICULTY_ID);

  const selectedContent = CLEAR_GOLD_CONTENTS.find((content) =>
    content.difficulties.some((difficulty) => difficulty.id === selectedDifficultyId),
  );
  const selectedDifficulty = selectedContent?.difficulties.find(
    (difficulty) => difficulty.id === selectedDifficultyId,
  );

  return (
    <div className={styles['clear-gold-client']}>
      <LostarkHeader />

      <main className={styles['clear-gold-container']}>
        <ClearGoldContentList
          contents={CLEAR_GOLD_CONTENTS}
          selectedDifficultyId={selectedDifficultyId}
          onSelectDifficulty={setSelectedDifficultyId}
        />
        <ClearGoldDetail
          contentName={selectedContent?.name}
          difficulty={selectedDifficulty}
        />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Add the desktop-only 1024px master-detail shell**

Create `src/app/lostark/clear-gold/clearGoldClient.module.scss`:

```scss
.clear-gold-client {
  min-width: 100%;

  .clear-gold-container {
    display: flex;
    gap: 12px;
    width: 1024px;
    padding: 16px;
  }
}
```

- [ ] **Step 4: Add the Lost Ark header link in the approved position**

Update `PRIMARY_MENUS` in `src/components/lostark/header/LostarkHeader.tsx`:

```ts
const PRIMARY_MENUS: THeaderMenu[] = [
  { name: '할일', link: '/lostark/loado' },
  { name: '메인캐릭터', link: '/lostark/my-characters' },
  { name: '전체캐릭터', link: '/lostark/all-characters' },
  { name: '클리어 골드', link: '/lostark/clear-gold' },
  { name: '참고 사이트', link: '/lostark/reference-sites' },
];
```

- [ ] **Step 5: Run the complete automated verification set**

Run the five-test compile/run command from Task 2, then:

```bash
npx prettier --check \
  src/app/lostark/clear-gold \
  src/components/lostark/header/LostarkHeader.tsx
npm run lint
npm run build:webpack
```

Expected:

- 5 Node tests pass.
- Targeted Prettier check reports all files formatted.
- ESLint exits with no errors.
- Webpack production build succeeds and lists `/lostark/clear-gold` as a route.

- [ ] **Step 6: Commit the working route and navigation**

```bash
git add src/app/lostark/clear-gold \
  src/components/lostark/header/LostarkHeader.tsx
git commit -m "feat: add Lost Ark clear gold page"
```

### Task 5: Verify the desktop interaction and scope

**Files:**
- Verify only: `src/app/lostark/clear-gold/**`
- Verify only: `src/components/lostark/header/LostarkHeader.tsx`

- [ ] **Step 1: Start the app for visual verification**

Run:

```bash
npm run dev
```

Expected: Next.js reports a ready local URL without compilation errors.

- [ ] **Step 2: Verify the default normal selection at `/lostark/clear-gold`**

Open the route at a desktop viewport and confirm:

- Header order is `전체캐릭터`, `클리어 골드`, `참고 사이트`.
- The page shell is 1024px wide with a 280px left selector.
- `카제로스 레이드 1막 > 노말` is selected by default.
- Entry level is 1660.
- Gate rows are 3,500 and 8,000 tradable, both 0 bound.
- Summary is 11,500 tradable, 0 bound, 11,500 total.
- Data date is `2026.03.15`.

- [ ] **Step 3: Verify selecting hard updates the fixed detail area**

Click `하드` and confirm:

- The selected mint state moves from normal to hard.
- Entry level changes to 1680.
- Gate rows change to 5,500 and 12,500 tradable, both 0 bound.
- Summary changes to 18,000 tradable, 0 bound, 18,000 total.
- The page does not navigate or vertically jump when switching difficulty.

- [ ] **Step 4: Confirm excluded scope is absent**

Confirm the page has no maximum-gold calculator, material rewards, extra-reward costs, search, item-level filter, or mobile-specific controls.

- [ ] **Step 5: Check the final diff and commit any visual-only correction**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors and only intentional files are changed. If browser verification required a scoped visual correction, rerun `npm run lint` and `npm run build:webpack`, then commit only that correction:

```bash
git add src/app/lostark/clear-gold
git commit -m "fix: polish clear gold layout"
```
