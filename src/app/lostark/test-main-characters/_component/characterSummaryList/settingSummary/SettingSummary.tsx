import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '../SummarySection';

import styles from './settingSummary.module.scss';

const AVATAR_PARTS = ['머리', '상의', '하의', '무기'] as const;

export default function SettingSummary(props: { summary: TResLostarkCharacterSummary }) {
  const avatarCount = props.summary.legendaryAvatars.filter((avatar) =>
    AVATAR_PARTS.some((part) => avatar.type?.includes(part)),
  ).length;

  return (
    <div className={styles['setting-summary']}>
      <SummarySection title="보석">
        <div className={styles['gem-list']}>
          {getGemCounts(props.summary.gems).map((group) => (
            <span key={group.level}>{`${group.level}레벨 ${group.count}개`}</span>
          ))}
          {props.summary.gems.length === 0 && <span className={styles['empty-value']}>-</span>}
        </div>
      </SummarySection>

      <SummarySection title="각인">
        <div className={styles['engraving-list']}>
          {props.summary.engravings.map((engraving, index) => (
            <span
              key={`${engraving.name}-${index}`}
            >{`${engraving.name ?? '-'} ×${engraving.level ?? 0}`}</span>
          ))}
          {props.summary.engravings.length === 0 && (
            <span className={styles['empty-value']}>-</span>
          )}
        </div>
      </SummarySection>

      <SummarySection title="전설 아바타">
        <div className={styles['avatar-list']}>
          {AVATAR_PARTS.map((part) => (
            <span
              key={part}
              className={
                props.summary.legendaryAvatars.some((avatar) => avatar.type?.includes(part))
                  ? styles['avatar-equipped']
                  : styles['avatar-empty']
              }
            >
              {part}
            </span>
          ))}
          <b>{`${avatarCount} / 4`}</b>
        </div>
      </SummarySection>
    </div>
  );
}

function getGemCounts(gems: TResLostarkCharacterSummary['gems']) {
  return [10, 9, 8, 7]
    .map((level) => ({
      level,
      count:
        level === 7
          ? gems.filter((gem) => (gem.level ?? 0) <= level).length
          : gems.filter((gem) => gem.level === level).length,
    }))
    .filter((group) => group.count > 0);
}
