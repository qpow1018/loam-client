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

  return (
    <div className={styles['effect-table-section']}>
      <table className={styles['effect-table']}>
        <thead>
          <tr>
            <th>효과</th>
            {coreGroups.map(({ type }) => (
              <th key={type}>{type}</th>
            ))}
            <th>전체</th>
          </tr>
        </thead>
        <tbody>
          {totalEffects.map((effect) => (
            <tr key={effect.name}>
              <th>{effect.name}</th>
              {gemEffectsByType.map(({ type, effects }) => (
                <td key={type}>Lv. {getEffectLevel(effects, effect.name)}</td>
              ))}
              <td>Lv. {effect.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
