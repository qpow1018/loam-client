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
            tone: 'nightmare',
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
            tone: 'hard',
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
            tone: 'normal',
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
            tone: 'nightmare',
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
            tone: 'hard',
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
            tone: 'normal',
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
            tone: 'nightmare',
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
            tone: 'hard',
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
            tone: 'normal',
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
        name: '종막: 최후의 날',
        difficulties: [
          {
            id: 'kazeroth-finale-hard',
            name: '하드',
            tone: 'hard',
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
            tone: 'normal',
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
        name: '4막: 파멸의 성채',
        difficulties: [
          {
            id: 'kazeroth-act-4-hard',
            name: '하드',
            tone: 'hard',
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
            tone: 'normal',
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
        name: '3막: 칠흑, 폭풍의 밤',
        difficulties: [
          {
            id: 'kazeroth-act-3-hard',
            name: '하드',
            tone: 'hard',
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
            tone: 'normal',
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
        name: '2막: 아브렐슈드',
        difficulties: [
          {
            id: 'kazeroth-act-2-hard',
            name: '하드',
            tone: 'hard',
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
            tone: 'normal',
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
        name: '1막: 에기르',
        difficulties: [
          {
            id: 'kazeroth-act-1-hard',
            name: '하드',
            tone: 'hard',
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
            tone: 'normal',
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
        name: '서막: 에키드나',
        difficulties: [
          {
            id: 'kazeroth-prologue-hard',
            name: '하드',
            tone: 'hard',
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
            tone: 'normal',
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
