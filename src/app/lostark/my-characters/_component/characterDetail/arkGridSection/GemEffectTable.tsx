import type { TLostarkArkGrid } from '@/api/lostark/type';

import styles from './gemEffectTable.module.scss';

const EFFECT_ORDER = ['보스 피해', '추가 피해', '공격력'];

type TArkGridCore = TLostarkArkGrid['cores'][number];
type TGemEffect = {
  name: string;
  level: number;
};

export default function GemEffectTable(props: {
  coreGroups: { type: string; cores: TArkGridCore[] }[];
}) {
  const { coreGroups } = props;

  const totalEffects = getGemEffects(coreGroups.flatMap(({ cores }) => cores));
  const gemEffectsByType = coreGroups.map(({ type, cores }) => ({
    type,
    effects: getGemEffects(cores),
  }));
  const importantEffects = totalEffects.filter((effect) => EFFECT_ORDER.includes(effect.name));
  const secondaryEffects = totalEffects.filter((effect) => !EFFECT_ORDER.includes(effect.name));

  return (
    <div className={styles['gem-effect-table']}>
      <div className={styles['effect-header']}>
        <span className={styles['effect-label']}>효과</span>
        {coreGroups.map(({ type }) => (
          <span key={type} className={styles['effect-value']}>
            {type}
          </span>
        ))}
        <span className={styles['total-value']}>전체</span>
      </div>

      <EffectList effects={importantEffects} gemEffectsByType={gemEffectsByType} isImportant />
      <EffectList effects={secondaryEffects} gemEffectsByType={gemEffectsByType} />
    </div>
  );
}

function EffectList(props: {
  effects: TGemEffect[];
  gemEffectsByType: { type: string; effects: TGemEffect[] }[];
  isImportant?: boolean;
}) {
  const { effects, gemEffectsByType, isImportant = false } = props;

  return (
    <div className={`${styles['effect-list']} ${isImportant ? styles['important'] : ''}`}>
      {effects.map((effect) => (
        <div key={effect.name} className={styles['effect-row']}>
          <span className={styles['effect-name']}>{effect.name}</span>
          {gemEffectsByType.map(({ type, effects: effectsByType }) => (
            <span key={type} className={styles['effect-value']}>
              Lv. {getEffectLevel(effectsByType, effect.name)}
            </span>
          ))}
          <span className={styles['total-value']}>Lv. {effect.level}</span>
        </div>
      ))}
    </div>
  );
}

function getGemEffects(cores: TArkGridCore[]) {
  const effectLevels = new Map<string, number>();

  cores.forEach((core) => {
    core.gems.forEach((gem) => {
      gem.effects.forEach((effect) => {
        const level = effect.level ?? 0;
        effectLevels.set(effect.name, (effectLevels.get(effect.name) ?? 0) + level);
      });
    });
  });

  return [...effectLevels].map(([name, level]) => ({ name, level })).sort(sortEffects);
}

function getEffectLevel(effects: TGemEffect[], effectName: string) {
  return effects.find((effect) => effect.name === effectName)?.level ?? 0;
}

function sortEffects(left: TGemEffect, right: TGemEffect) {
  const leftOrder = EFFECT_ORDER.indexOf(left.name);
  const rightOrder = EFFECT_ORDER.indexOf(right.name);

  if (leftOrder !== rightOrder) {
    return (
      (leftOrder === -1 ? Number.MAX_SAFE_INTEGER : leftOrder) -
      (rightOrder === -1 ? Number.MAX_SAFE_INTEGER : rightOrder)
    );
  }

  return left.name.localeCompare(right.name);
}
