import type { TLostarkCombatSkill } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailPanel from './DetailPanel';

import styles from './skillSection.module.scss';

export default function SkillSection(props: { skills: TLostarkCombatSkill[] }) {
  return (
    <DetailPanel title="스킬">
      {props.skills.length === 0 && <p className={styles['empty']}>스킬 정보가 없습니다.</p>}

      {props.skills.length > 0 && (
        <div className={styles['skill-list']}>
          {props.skills.map((skill, index) => (
            <div key={`${skill.name}-${index}`} className={styles['skill-item']}>
              <ItemSlot imageUrl={skill.icon} size={44} />
              <div className={styles['skill-copy']}>
                <p>
                  <strong>{skill.name ?? '-'}</strong>
                  {skill.level !== null && <span>{`Lv. ${skill.level}`}</span>}
                  {skill.isAwakening && <em>각성기</em>}
                </p>
                <div className={styles['tripod-list']}>
                  {skill.tripods.map((tripod, tripodIndex) => (
                    <span key={`${tripod.slot}-${tripodIndex}`}>{tripod.name ?? '-'}</span>
                  ))}
                </div>
              </div>
              {skill.rune && (
                <ItemSlot imageUrl={skill.rune.icon} grade={skill.rune.grade} size={30} />
              )}
            </div>
          ))}
        </div>
      )}
    </DetailPanel>
  );
}
