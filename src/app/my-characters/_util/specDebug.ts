import type { TCharacterSpec } from '@/api/lostark/type';

const RAW_SECTION_LABELS: Record<string, string> = {
  profiles: '기본 스펙 profiles',
  equipment: '장비 equipment',
  engravings: '각인 engravings',
  gems: '보석 gems',
  avatars: '아바타 avatars',
  arkpassive: '아크패시브 arkpassive',
  arkgrid: '코어/젬/카르마 후보 arkgrid',
};

export function isLostarkSpecDebugEnabled() {
  return (
    process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_LOSTARK_SPEC_DEBUG === 'true'
  );
}

export function logCharacterSpecDebug(source: string, spec: TCharacterSpec) {
  if (!isLostarkSpecDebugEnabled()) return;

  console.groupCollapsed(`[Lostark Spec][${source}] ${spec.characterName}`);
  console.log('meta', {
    characterName: spec.characterName,
    serverName: spec.serverName,
    characterClass: spec.characterClass,
    itemLevel: spec.itemLevel,
    savedAt: spec.savedAt,
    updatedAt: spec.updatedAt,
  });
  console.log('sectionStatus', spec.sectionStatus);
  console.log('summary.profile', spec.summary.profile);
  console.log('summary.equipment', spec.summary.equipment);
  console.log('summary.accessories', spec.summary.accessories);
  console.log('summary.bracelet', spec.summary.bracelet);
  console.log('summary.abilityStone', spec.summary.abilityStone);
  console.log('summary.engravings', spec.summary.engravings);
  console.log('summary.gems', spec.summary.gems);
  console.log('summary.legendaryAvatars', spec.summary.legendaryAvatars);
  console.log('summary.needsReview', spec.summary.needsReview);

  for (const [key, value] of Object.entries(spec.rawPayload)) {
    const label = RAW_SECTION_LABELS[key] ?? key;
    console.groupCollapsed(`rawPayload.${label}`);
    console.log(value);
    console.groupEnd();
  }

  console.groupEnd();
}
