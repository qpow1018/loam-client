# Lost Ark Clear Gold Data Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand `/lostark/clear-gold` with the approved Shadow Raid, Horizon Cathedral, and Kazeroth Raid gate rewards grouped by category and ordered from higher-level content to lower-level content.

**Architecture:** Replace the flat content constant with a route-local `category → content → difficulty → gate` constant while preserving the existing content, difficulty, gate, and summary contracts. The client derives a small flat content list only for selection lookup; the sidebar renders the category hierarchy directly and the detail component remains unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, SCSS Modules, Node built-in test runner, ESLint, webpack production build

---

## File map

- Modify `src/app/lostark/clear-gold/_type/clearGold.ts`: add the category contract.
- Modify `src/app/lostark/clear-gold/_define/clearGoldContents.ts`: replace the single-content fixture with the approved categorized data.
- Modify `src/app/lostark/clear-gold/_util/clearGold.test.ts`: lock category/content/difficulty order and every gate value in one compact fixture serialization.
- Modify `src/app/lostark/clear-gold/ClearGoldClient.tsx`: use categorized data for default selection, lookup, and list rendering.
- Modify `src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx`: render category headings around the existing content/difficulty groups.
- Modify `src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss`: style the category hierarchy without changing the 280px desktop sidebar contract.

### Task 1: Replace the flat fixture with fully tested categorized data

**Files:**
- Modify: `src/app/lostark/clear-gold/_util/clearGold.test.ts`
- Modify: `src/app/lostark/clear-gold/_type/clearGold.ts`
- Modify: `src/app/lostark/clear-gold/_define/clearGoldContents.ts`

- [ ] **Step 1: Replace the two old content-specific tests with one failing exact-fixture test**

In `src/app/lostark/clear-gold/_util/clearGold.test.ts`, replace the import of `CLEAR_GOLD_CONTENTS` with:

```ts
import { CLEAR_GOLD_CATEGORIES } from '../_define/clearGoldContents';
import type { TClearGoldCategory, TClearGoldGate } from '../_type/clearGold';
```

Keep the existing empty, mixed-gold, and formatting tests. Replace both Kazeroth Act 1 tests with the serializer and fixture test below:

```ts
function serializeClearGoldCategories(categories: readonly TClearGoldCategory[]) {
  return categories
    .map((category) => {
      const contents = category.contents
        .map((content) => {
          const difficulties = content.difficulties
            .map((difficulty) => {
              const gates = difficulty.gates
                .map(
                  (gate) => `${gate.name}:${gate.tradableGold}:${gate.boundGold}`,
                )
                .join(',');

              return `    ${difficulty.id}|${difficulty.name}|${difficulty.entryItemLevel}|${difficulty.updatedAt}|${gates}`;
            })
            .join('\n');

          return `  ${content.id}|${content.name}\n${difficulties}`;
        })
        .join('\n');

      return `${category.id}|${category.name}\n${contents}`;
    })
    .join('\n');
}

test('provides the approved categorized clear gold fixture', () => {
  assert.equal(
    serializeClearGoldCategories(CLEAR_GOLD_CATEGORIES),
    `shadow-raid|그림자 레이드
  shadow-belgardin|죽음의 계율자, 벨가르딘
    shadow-belgardin-nightmare|나이트메어|1780|2026.06.24|1관문:30000:0,2관문:45000:0
    shadow-belgardin-hard|하드|1770|2026.06.24|1관문:25000:0,2관문:37000:0
    shadow-belgardin-normal|노말|1750|2026.06.24|1관문:20000:0,2관문:30000:0
  shadow-serka|고통의 마녀, 세르카
    shadow-serka-nightmare|나이트메어|1740|2026.06.24|1관문:21000:0,2관문:33000:0
    shadow-serka-hard|하드|1730|2026.06.24|1관문:17500:0,2관문:26500:0
    shadow-serka-normal|노말|1710|2026.06.24|1관문:6500:6500,2관문:9500:9500
abyss-dungeon|어비스 던전
  horizon-cathedral|지평의 성당
    horizon-cathedral-stage-3|3단계|1750|2026.06.24|1관문:0:20000,2관문:0:30000
    horizon-cathedral-stage-2|2단계|1720|2026.06.24|1관문:0:16000,2관문:0:24000
    horizon-cathedral-stage-1|1단계|1700|2026.06.24|1관문:0:13500,2관문:0:16500
kazeroth-raid|카제로스 레이드
  kazeroth-finale|종막 최후의 날
    kazeroth-finale-hard|하드|1730|2026.06.24|1관문:16000:0,2관문:32000:0
    kazeroth-finale-normal|노말|1710|2026.06.24|1관문:5500:5500,2관문:10500:10500
  kazeroth-act-4|4막 파멸의 성채
    kazeroth-act-4-hard|하드|1720|2026.06.24|1관문:13500:0,2관문:24500:0
    kazeroth-act-4-normal|노말|1700|2026.06.24|1관문:5000:5000,2관문:8500:8500
  kazeroth-act-3|3막 칠흑, 폭풍의 밤
    kazeroth-act-3-hard|하드|1700|2026.06.24|1관문:2500:2500,2관문:4000:4000,3관문:7000:7000
    kazeroth-act-3-normal|노말|1680|2026.06.24|1관문:2000:2000,2관문:3500:3500,3관문:5000:5000
  kazeroth-act-2|2막 아브렐슈드
    kazeroth-act-2-hard|하드|1690|2026.06.24|1관문:3750:3750,2관문:7750:7750
    kazeroth-act-2-normal|노말|1670|2026.06.24|1관문:2750:2750,2관문:5500:5500
  kazeroth-act-1|1막 에기르
    kazeroth-act-1-hard|하드|1680|2026.06.24|1관문:2750:2750,2관문:6250:6250
    kazeroth-act-1-normal|노말|1660|2026.06.24|1관문:1750:1750,2관문:4000:4000
  kazeroth-prologue|서막 에키드나
    kazeroth-prologue-hard|하드|1640|2026.06.24|1관문:1100:1100,2관문:2500:2500
    kazeroth-prologue-normal|노말|1620|2026.06.24|1관문:0:1900,2관문:0:4200`,
  );
});
```

This serialized fixture locks category, content, and difficulty ordering; IDs and labels; entry levels and update dates; all gate allocations; and the absence of duplicate single difficulties.

- [ ] **Step 2: Compile to verify RED before adding the category export**

Use a fresh, non-existing output directory and run:

```bash
npx tsc \
  src/app/lostark/clear-gold/_util/clearGold.test.ts \
  src/app/lostark/clear-gold/_util/clearGold.ts \
  src/app/lostark/clear-gold/_type/clearGold.ts \
  src/app/lostark/clear-gold/_define/clearGoldContents.ts \
  --outDir /tmp/loam-clear-gold-expansion-red \
  --module commonjs \
  --moduleResolution node \
  --target es2022 \
  --esModuleInterop \
  --skipLibCheck \
  --ignoreConfig \
  --ignoreDeprecations 6.0 \
  --types node
```

Expected: TypeScript fails because `CLEAR_GOLD_CATEGORIES` and `TClearGoldCategory` do not exist yet.

- [ ] **Step 3: Add the category type**

Append to `src/app/lostark/clear-gold/_type/clearGold.ts` after `TClearGoldContent`:

```ts
export type TClearGoldCategory = {
  id: string;
  name: string;
  contents: readonly TClearGoldContent[];
};
```

Do not change the existing gate, difficulty, content, or summary types.

- [ ] **Step 4: Replace the flat constant with the complete categorized fixture**

Replace `src/app/lostark/clear-gold/_define/clearGoldContents.ts` with:

```ts
import type { TClearGoldCategory } from '../_type/clearGold';

const UPDATED_AT = '2026.06.24';

export const CLEAR_GOLD_CATEGORIES = [
  {
    id: 'shadow-raid',
    name: '그림자 레이드',
    contents: [
      {
        id: 'shadow-belgardin',
        name: '죽음의 계율자, 벨가르딘',
        difficulties: [
          {
            id: 'shadow-belgardin-nightmare',
            name: '나이트메어',
            entryItemLevel: 1780,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 30000, boundGold: 0 },
              { name: '2관문', tradableGold: 45000, boundGold: 0 },
            ],
          },
          {
            id: 'shadow-belgardin-hard',
            name: '하드',
            entryItemLevel: 1770,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 25000, boundGold: 0 },
              { name: '2관문', tradableGold: 37000, boundGold: 0 },
            ],
          },
          {
            id: 'shadow-belgardin-normal',
            name: '노말',
            entryItemLevel: 1750,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 20000, boundGold: 0 },
              { name: '2관문', tradableGold: 30000, boundGold: 0 },
            ],
          },
        ],
      },
      {
        id: 'shadow-serka',
        name: '고통의 마녀, 세르카',
        difficulties: [
          {
            id: 'shadow-serka-nightmare',
            name: '나이트메어',
            entryItemLevel: 1740,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 21000, boundGold: 0 },
              { name: '2관문', tradableGold: 33000, boundGold: 0 },
            ],
          },
          {
            id: 'shadow-serka-hard',
            name: '하드',
            entryItemLevel: 1730,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 17500, boundGold: 0 },
              { name: '2관문', tradableGold: 26500, boundGold: 0 },
            ],
          },
          {
            id: 'shadow-serka-normal',
            name: '노말',
            entryItemLevel: 1710,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 6500, boundGold: 6500 },
              { name: '2관문', tradableGold: 9500, boundGold: 9500 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'abyss-dungeon',
    name: '어비스 던전',
    contents: [
      {
        id: 'horizon-cathedral',
        name: '지평의 성당',
        difficulties: [
          {
            id: 'horizon-cathedral-stage-3',
            name: '3단계',
            entryItemLevel: 1750,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 0, boundGold: 20000 },
              { name: '2관문', tradableGold: 0, boundGold: 30000 },
            ],
          },
          {
            id: 'horizon-cathedral-stage-2',
            name: '2단계',
            entryItemLevel: 1720,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 0, boundGold: 16000 },
              { name: '2관문', tradableGold: 0, boundGold: 24000 },
            ],
          },
          {
            id: 'horizon-cathedral-stage-1',
            name: '1단계',
            entryItemLevel: 1700,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 0, boundGold: 13500 },
              { name: '2관문', tradableGold: 0, boundGold: 16500 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kazeroth-raid',
    name: '카제로스 레이드',
    contents: [
      {
        id: 'kazeroth-finale',
        name: '종막 최후의 날',
        difficulties: [
          {
            id: 'kazeroth-finale-hard',
            name: '하드',
            entryItemLevel: 1730,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 16000, boundGold: 0 },
              { name: '2관문', tradableGold: 32000, boundGold: 0 },
            ],
          },
          {
            id: 'kazeroth-finale-normal',
            name: '노말',
            entryItemLevel: 1710,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 5500, boundGold: 5500 },
              { name: '2관문', tradableGold: 10500, boundGold: 10500 },
            ],
          },
        ],
      },
      {
        id: 'kazeroth-act-4',
        name: '4막 파멸의 성채',
        difficulties: [
          {
            id: 'kazeroth-act-4-hard',
            name: '하드',
            entryItemLevel: 1720,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 13500, boundGold: 0 },
              { name: '2관문', tradableGold: 24500, boundGold: 0 },
            ],
          },
          {
            id: 'kazeroth-act-4-normal',
            name: '노말',
            entryItemLevel: 1700,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 5000, boundGold: 5000 },
              { name: '2관문', tradableGold: 8500, boundGold: 8500 },
            ],
          },
        ],
      },
      {
        id: 'kazeroth-act-3',
        name: '3막 칠흑, 폭풍의 밤',
        difficulties: [
          {
            id: 'kazeroth-act-3-hard',
            name: '하드',
            entryItemLevel: 1700,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 2500, boundGold: 2500 },
              { name: '2관문', tradableGold: 4000, boundGold: 4000 },
              { name: '3관문', tradableGold: 7000, boundGold: 7000 },
            ],
          },
          {
            id: 'kazeroth-act-3-normal',
            name: '노말',
            entryItemLevel: 1680,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 2000, boundGold: 2000 },
              { name: '2관문', tradableGold: 3500, boundGold: 3500 },
              { name: '3관문', tradableGold: 5000, boundGold: 5000 },
            ],
          },
        ],
      },
      {
        id: 'kazeroth-act-2',
        name: '2막 아브렐슈드',
        difficulties: [
          {
            id: 'kazeroth-act-2-hard',
            name: '하드',
            entryItemLevel: 1690,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 3750, boundGold: 3750 },
              { name: '2관문', tradableGold: 7750, boundGold: 7750 },
            ],
          },
          {
            id: 'kazeroth-act-2-normal',
            name: '노말',
            entryItemLevel: 1670,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 2750, boundGold: 2750 },
              { name: '2관문', tradableGold: 5500, boundGold: 5500 },
            ],
          },
        ],
      },
      {
        id: 'kazeroth-act-1',
        name: '1막 에기르',
        difficulties: [
          {
            id: 'kazeroth-act-1-hard',
            name: '하드',
            entryItemLevel: 1680,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 2750, boundGold: 2750 },
              { name: '2관문', tradableGold: 6250, boundGold: 6250 },
            ],
          },
          {
            id: 'kazeroth-act-1-normal',
            name: '노말',
            entryItemLevel: 1660,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 1750, boundGold: 1750 },
              { name: '2관문', tradableGold: 4000, boundGold: 4000 },
            ],
          },
        ],
      },
      {
        id: 'kazeroth-prologue',
        name: '서막 에키드나',
        difficulties: [
          {
            id: 'kazeroth-prologue-hard',
            name: '하드',
            entryItemLevel: 1640,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 1100, boundGold: 1100 },
              { name: '2관문', tradableGold: 2500, boundGold: 2500 },
            ],
          },
          {
            id: 'kazeroth-prologue-normal',
            name: '노말',
            entryItemLevel: 1620,
            updatedAt: UPDATED_AT,
            gates: [
              { name: '1관문', tradableGold: 0, boundGold: 1900 },
              { name: '2관문', tradableGold: 0, boundGold: 4200 },
            ],
          },
        ],
      },
    ],
  },
] as const satisfies readonly TClearGoldCategory[];
```

- [ ] **Step 5: Compile and run the four tests to verify GREEN**

Use a different fresh output directory:

```bash
npx tsc \
  src/app/lostark/clear-gold/_util/clearGold.test.ts \
  src/app/lostark/clear-gold/_util/clearGold.ts \
  src/app/lostark/clear-gold/_type/clearGold.ts \
  src/app/lostark/clear-gold/_define/clearGoldContents.ts \
  --outDir /tmp/loam-clear-gold-expansion-green \
  --module commonjs \
  --moduleResolution node \
  --target es2022 \
  --esModuleInterop \
  --skipLibCheck \
  --ignoreConfig \
  --ignoreDeprecations 6.0 \
  --types node
node --test /tmp/loam-clear-gold-expansion-green/_util/clearGold.test.js
```

Expected: 4 tests pass, 0 fail: empty summary, mixed summary, formatting, and the complete categorized fixture.

- [ ] **Step 6: Run scoped format and lint checks**

```bash
npx prettier --check \
  src/app/lostark/clear-gold/_type/clearGold.ts \
  src/app/lostark/clear-gold/_define/clearGoldContents.ts \
  src/app/lostark/clear-gold/_util/clearGold.test.ts
npm run lint
```

Expected: all three files are formatted and ESLint exits with no errors.

- [ ] **Step 7: Commit the categorized fixture**

```bash
git add \
  src/app/lostark/clear-gold/_type/clearGold.ts \
  src/app/lostark/clear-gold/_define/clearGoldContents.ts \
  src/app/lostark/clear-gold/_util/clearGold.test.ts
git commit -m "feat: expand clear gold reward data"
```

### Task 2: Render category groups and connect selection

**Files:**
- Modify: `src/app/lostark/clear-gold/ClearGoldClient.tsx`
- Modify: `src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx`
- Modify: `src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss`

- [ ] **Step 1: Change the client to use category-first data**

Replace `src/app/lostark/clear-gold/ClearGoldClient.tsx` with:

```tsx
'use client';

import { useState } from 'react';

import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import ClearGoldContentList from './_component/ClearGoldContentList';
import ClearGoldDetail from './_component/ClearGoldDetail';
import { CLEAR_GOLD_CATEGORIES } from './_define/clearGoldContents';

import styles from './clearGoldClient.module.scss';

const CLEAR_GOLD_CONTENTS = CLEAR_GOLD_CATEGORIES.flatMap((category) => category.contents);
const DEFAULT_DIFFICULTY_ID =
  CLEAR_GOLD_CATEGORIES[0]?.contents[0]?.difficulties[0]?.id ?? '';

export default function ClearGoldClient() {
  const [selectedDifficultyId, setSelectedDifficultyId] = useState<string>(DEFAULT_DIFFICULTY_ID);
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
          categories={CLEAR_GOLD_CATEGORIES}
          selectedDifficultyId={selectedDifficultyId}
          onSelectDifficulty={setSelectedDifficultyId}
        />
        <ClearGoldDetail contentName={selectedContent?.name} difficulty={selectedDifficulty} />
      </main>
    </div>
  );
}
```

This keeps the default selection at `shadow-belgardin-nightmare` and derives the flat list only once at module initialization.

- [ ] **Step 2: Render category, content, and difficulty headings in order**

Replace `src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx` with:

```tsx
import type { TClearGoldCategory } from '../_type/clearGold';

import styles from './clearGoldContentList.module.scss';

type TClearGoldContentListProps = {
  categories: readonly TClearGoldCategory[];
  selectedDifficultyId: string;
  onSelectDifficulty: (difficultyId: string) => void;
};

export default function ClearGoldContentList({
  categories,
  selectedDifficultyId,
  onSelectDifficulty,
}: TClearGoldContentListProps) {
  return (
    <aside className={styles['content-list']} aria-label="클리어 골드 콘텐츠 목록">
      <h1 className={styles['title']}>클리어 골드</h1>

      <div className={styles['category-groups']}>
        {categories.map((category) => (
          <section className={styles['category-group']} key={category.id}>
            <h2 className={styles['category-name']}>{category.name}</h2>

            <div className={styles['content-groups']}>
              {category.contents.map((content) => (
                <section className={styles['content-group']} key={content.id}>
                  <h3 className={styles['content-name']}>{content.name}</h3>

                  <div className={styles['difficulty-list']}>
                    {content.difficulties.map((difficulty) => {
                      const isSelected = difficulty.id === selectedDifficultyId;

                      return (
                        <button
                          className={`${styles['difficulty-button']} ${
                            isSelected ? styles['is-selected'] : ''
                          }`}
                          type="button"
                          aria-pressed={isSelected}
                          key={difficulty.id}
                          onClick={() => onSelectDifficulty(difficulty.id)}
                        >
                          <span>{difficulty.name}</span>
                          <span className={styles['item-level']}>
                            Lv. {difficulty.entryItemLevel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Style the category layer without changing the sidebar width**

Replace `src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss` with:

```scss
.content-list {
  width: 280px;
  flex-shrink: 0;
  padding: 16px;
  border-radius: $border-radius;
  background-color: $gray-800;

  .title {
    padding-bottom: 12px;
    border-bottom: 1px solid $gray-600;
    font-size: 13px;
    font-weight: 500;
  }

  .category-groups {
    margin-top: 16px;

    .category-group {
      & + .category-group {
        margin-top: 24px;
      }

      .category-name {
        padding-bottom: 8px;
        border-bottom: 1px solid $gray-700;
        color: $mint-300;
        font-size: 12px;
        font-weight: 600;
      }

      .content-groups {
        margin-top: 12px;

        .content-group {
          & + .content-group {
            margin-top: 16px;
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

            .difficulty-button {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding: 10px 12px;
              border: 1px solid $gray-600;
              border-radius: $border-radius;
              background-color: $gray-700;
              color: $text-primary;
              font-size: 12px;
              text-align: left;
              transition: $transition;
              cursor: pointer;

              &:hover,
              &.is-selected {
                border-color: $mint-500;
                background-color: $mint-900;
              }

              .item-level {
                color: $gray-300;
                font-size: 11px;
              }
            }
          }
        }
      }
    }
  }
}
```

- [ ] **Step 4: Run the exact fixture test, format check, and lint**

Compile to a new fresh directory and run the same four tests from Task 1, then run:

```bash
npx prettier --check \
  src/app/lostark/clear-gold/ClearGoldClient.tsx \
  src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx \
  src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss
npm run lint
```

Expected: 4 tests pass, all three UI files are formatted, and ESLint exits with no errors.

- [ ] **Step 5: Run the production build**

```bash
npm run build:webpack
```

Expected: webpack build succeeds and lists `/lostark/clear-gold`. If `next/font` cannot reach Google Fonts in the sandbox, rerun the same command with network permission; do not change application code for that environmental failure.

- [ ] **Step 6: Verify the desktop interaction**

Run `npm run dev`, open `/lostark/clear-gold`, and confirm:

- category headings appear in the order `그림자 레이드 → 어비스 던전 → 카제로스 레이드`;
- `벨가르딘 나이트메어` is selected by default;
- content and difficulty buttons follow the exact serialized fixture order;
- selecting `지평의 성당 3단계` shows entry level 1750, general 0, bound 50,000, total 50,000;
- selecting `에기르 하드` shows entry level 1680, general 9,000, bound 9,000, total 18,000;
- selecting `에키드나 노말` shows entry level 1620, general 0, bound 6,100, total 6,100;
- no single difficulty, extra-reward gold, search, filter, or mobile control appears.

- [ ] **Step 7: Commit the grouped list UI**

```bash
git add \
  src/app/lostark/clear-gold/ClearGoldClient.tsx \
  src/app/lostark/clear-gold/_component/ClearGoldContentList.tsx \
  src/app/lostark/clear-gold/_component/clearGoldContentList.module.scss
git commit -m "feat: group clear gold content by category"
```

### Task 3: Final scope and regression verification

**Files:**
- Verify: `src/app/lostark/clear-gold/**`

- [ ] **Step 1: Run all automated checks from a clean worktree**

Run the Task 1 TypeScript compile and Node test command with another fresh output directory, then:

```bash
npx prettier --check src/app/lostark/clear-gold
npm run lint
npm run build:webpack
git diff --check
git status --short
```

Expected: 4 tests pass, Prettier and lint pass, production build succeeds, no whitespace errors, and the worktree is clean.

- [ ] **Step 2: Review the final diff against the approved design**

Confirm the final diff changes only the six files listed in the file map and implements every completion criterion from `docs/superpowers/specs/2026-06-24-lostark-clear-gold-data-expansion-design.md`. Confirm especially that `ClearGoldDetail.tsx`, header navigation, routing, and clear-gold calculation helpers remain unchanged.
