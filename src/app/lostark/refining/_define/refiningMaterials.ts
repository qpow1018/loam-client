import type { TRefiningMaterialId } from '@/app/lostark/refining/_type/refining';

export const REFINING_MATERIALS: Record<TRefiningMaterialId, { name: string; imageUrl: string }> = {
  'fate-shard': { name: '운명의 파편', imageUrl: '/lostark/refining/fragment.png' },
  'aegir-destruction': { name: '운명의 파괴석', imageUrl: '/lostark/refining/dest-stone.png' },
  'aegir-guardian': { name: '운명의 수호석', imageUrl: '/lostark/refining/guard-stone.png' },
  'aegir-leapstone': { name: '운명의 돌파석', imageUrl: '/lostark/refining/leap-stone.png' },
  'aegir-abidos': { name: '아비도스 융화 재료', imageUrl: '/lostark/refining/abydos-fusion.png' },
  'serka-destruction': {
    name: '운명의 파괴석 결정',
    imageUrl: '/lostark/refining/dest-stone-crystal.png',
  },
  'serka-guardian': {
    name: '운명의 수호석 결정',
    imageUrl: '/lostark/refining/guard-stone-crystal.png',
  },
  'serka-leapstone': {
    name: '위대한 운명의 돌파석',
    imageUrl: '/lostark/refining/great-leap-stone.png',
  },
  'serka-abidos': {
    name: '상급 아비도스 융화 재료',
    imageUrl: '/lostark/refining/advanced-abydos-fusion.png',
  },
  'weapon-breath': { name: '용암의 숨결', imageUrl: '/lostark/refining/lava-breath.png' },
  'armor-breath': { name: '빙하의 숨결', imageUrl: '/lostark/refining/glacier-breath.png' },
  'weapon-book-11-14': {
    name: '야금술 업화 [11-14]',
    imageUrl: '/lostark/refining/metallurgy-hellfire.png',
  },
  'armor-book-11-14': {
    name: '재봉술 업화 [11-14]',
    imageUrl: '/lostark/refining/tailoring-hellfire.png',
  },
  'weapon-book-15-18': {
    name: '야금술 업화 [15-18]',
    imageUrl: '/lostark/refining/metallurgy-hellfire.png',
  },
  'armor-book-15-18': {
    name: '재봉술 업화 [15-18]',
    imageUrl: '/lostark/refining/tailoring-hellfire.png',
  },
  'weapon-book-19-20': {
    name: '야금술 업화 [19-20]',
    imageUrl: '/lostark/refining/metallurgy-hellfire.png',
  },
  'armor-book-19-20': {
    name: '재봉술 업화 [19-20]',
    imageUrl: '/lostark/refining/tailoring-hellfire.png',
  },
  'weapon-strong-book-19-20': {
    name: '강화 야금술 업화 [19-20]',
    imageUrl: '/lostark/refining/metallurgy-hellfire.png',
  },
  'armor-strong-book-19-20': {
    name: '강화 재봉술 업화 [19-20]',
    imageUrl: '/lostark/refining/tailoring-hellfire.png',
  },
};
