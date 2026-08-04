import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import styles from './characterSummaryList.module.scss';

export default function CharacterSummaryList(props: {
  characters: TResLostarkMainCharacter[];
  onSelectCharacter: (characterId: string) => void;
}) {
  return (
    <div className={styles['character-summary-list']}>
      <div className={styles['intro']}>
        <p className={styles['eyebrow']}>등록한 메인 캐릭터</p>
        <h1>전체 캐릭터 요약</h1>
        <p>장비와 세팅 상태를 빠르게 비교하고, 캐릭터를 선택해 상세 정보를 확인하세요.</p>
      </div>

      <div className={styles['list']}>
        {props.characters.map((character) => (
          <SummaryItem
            key={character.id}
            character={character}
            onSelect={() => props.onSelectCharacter(character.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SummaryItem(props: { character: TResLostarkMainCharacter; onSelect: () => void }) {
  const { summary } = props.character;
  const { profiles, equipment } = summary;
  const sortedGears = [...equipment.gears].sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0));
  const gemCounts = [10, 9, 8, 7]
    .map((level) => ({
      level,
      count: summary.gems.filter((gem) => (gem.level ?? 0) === level).length,
    }))
    .filter((group) => group.count > 0);

  return (
    <button type="button" className={styles['summary-item']} onClick={props.onSelect}>
      <div className={styles['identity']}>
        <div className={styles['portrait']}>
          {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
        </div>
        <div>
          <p className={styles['class-name']}>{profiles.characterClassName ?? '-'}</p>
          <strong>{profiles.characterName ?? '-'}</strong>
          <span>{profiles.serverName ?? '-'}</span>
        </div>
      </div>

      <div className={styles['primary-stats']}>
        <Stat label="아이템 레벨" value={profiles.itemAvgLevel ?? '-'} />
        <Stat label="전투력" value={profiles.combatPower ?? '-'} />
      </div>

      <div className={styles['summary-group']}>
        <p className={styles['group-title']}>장비 품질</p>
        <div className={styles['quality-list']}>
          {sortedGears.map((gear, index) => (
            <span
              key={`${gear.type}-${index}`}
              title={`${gear.type ?? '장비'} 품질 ${gear.quality ?? '-'}`}
            >
              <QualityChip quality={gear.quality} />
            </span>
          ))}
        </div>
      </div>

      <div className={styles['summary-group']}>
        <p className={styles['group-title']}>보석</p>
        <div className={styles['gem-list']}>
          {gemCounts.length === 0 && <span>-</span>}
          {gemCounts.map((group) => (
            <span key={group.level}>{`${group.level}레벨 ${group.count}`}</span>
          ))}
        </div>
      </div>

      <div className={`${styles['summary-group']} ${styles['build-group']}`}>
        <p className={styles['group-title']}>세팅</p>
        <div className={styles['build-list']}>
          <span>
            {summary.engravings
              .map((engraving) => `${engraving.name ?? '-'} ${engraving.level ?? 0}`)
              .join(' · ') || '-'}
          </span>
          <span>
            {summary.arkPassive.points
              .map((point) => `${point.name ?? '-'} ${point.value ?? 0}P`)
              .join(' · ') || '-'}
          </span>
        </div>
      </div>

      <span className={styles['detail-link']}>상세 보기</span>
    </button>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className={styles['stat']}>
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </div>
  );
}
