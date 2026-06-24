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
