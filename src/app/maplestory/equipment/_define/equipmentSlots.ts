export type TMaplestoryEquipmentCategory = 'weapon' | 'armor' | 'accessory';

export type TMaplestoryEquipmentSlot = {
  key: string;
  defaultName: string;
};

export type TMaplestoryEquipmentGroup = {
  category: TMaplestoryEquipmentCategory;
  label: string;
  slots: readonly TMaplestoryEquipmentSlot[];
};

export const MAPLESTORY_EQUIPMENT_GROUPS: readonly TMaplestoryEquipmentGroup[] = [
  {
    category: 'weapon',
    label: '무보엠',
    slots: [
      { key: 'weapon', defaultName: '무기' },
      { key: 'secondaryWeapon', defaultName: '보조무기' },
      { key: 'emblem', defaultName: '엠블렘' },
    ],
  },
  {
    category: 'armor',
    label: '방어구',
    slots: [
      { key: 'hat', defaultName: '모자' },
      { key: 'top', defaultName: '상의' },
      { key: 'bottom', defaultName: '하의' },
      { key: 'glove', defaultName: '장갑' },
      { key: 'shoes', defaultName: '신발' },
      { key: 'cape', defaultName: '망토' },
      { key: 'shoulder', defaultName: '견장' },
    ],
  },
  {
    category: 'accessory',
    label: '장신구',
    slots: [
      { key: 'ring1', defaultName: '반지 1' },
      { key: 'ring2', defaultName: '반지 2' },
      { key: 'ring3', defaultName: '반지 3' },
      { key: 'ring4', defaultName: '반지 4' },
      { key: 'pendant1', defaultName: '펜던트 1' },
      { key: 'pendant2', defaultName: '펜던트 2' },
      { key: 'earring', defaultName: '귀걸이' },
      { key: 'eyeAccessory', defaultName: '눈장식' },
      { key: 'faceAccessory', defaultName: '얼굴장식' },
      { key: 'belt', defaultName: '벨트' },
      { key: 'mechanicalHeart', defaultName: '기계 심장' },
      { key: 'pocketItem', defaultName: '포켓 아이템' },
      { key: 'badge', defaultName: '뱃지' },
    ],
  },
] as const;
