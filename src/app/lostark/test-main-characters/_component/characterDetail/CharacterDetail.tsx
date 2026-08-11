'use client';

import { useEffect, useState } from 'react';

import type { TLostarkManualMetrics, TResLostarkMainCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import ProfileHeader from './profileHeader/ProfileHeader';
import EquipmentSection from './equipmentSection/EquipmentSection';

import BoxLoading from '@/components/common/loading/BoxLoading';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import AvatarSection from './AvatarSection';
import ArkPassiveNodeSection from './ArkPassiveNodeSection';
import CardSection from './CardSection';
import DetailPanel from './DetailPanel';
import SkillSection from './SkillSection';

import styles from './characterDetail.module.scss';

export default function CharacterDetail(props: { characterId: string }) {
  const [draftCharacter, setDraftCharacter] = useState<TResLostarkMainCharacter | null>(null);

  const {
    data: savedCharacter,
    isLoading,
    isError,
  } = lostarkQuery.useGetMainCharacterDetail(props.characterId);
  const refreshMainCharacter = lostarkQuery.useRefreshMainCharacter();
  const saveMainCharacter = lostarkQuery.useSaveMainCharacter();

  const character = draftCharacter ?? savedCharacter;
  const hasUnsavedChanges = draftCharacter !== null;

  useEffect(() => {
    if (isError) {
      toast.error('메인 캐릭터 정보를 불러오지 못했습니다.');
    }
  }, [isError]);

  async function handleRefreshCharacter() {
    if (!character || refreshMainCharacter.isPending) return;

    try {
      const refreshedCharacter = await refreshMainCharacter.mutateAsync(character);
      setDraftCharacter(refreshedCharacter);
      toast.success('최신 정보를 불러왔습니다.');
    } catch {
      toast.error('최신 정보를 불러오지 못했습니다.');
    }
  }

  async function handleSaveCharacter() {
    if (!character || !hasUnsavedChanges || saveMainCharacter.isPending) return;

    try {
      await saveMainCharacter.mutateAsync(character);
      setDraftCharacter(null);
      toast.success('메인 캐릭터 정보를 저장했습니다.');
    } catch {
      toast.error('메인 캐릭터 정보를 저장하지 못했습니다.');
    }
  }

  function handleChangeManualMetrics(manualMetrics: TLostarkManualMetrics) {
    if (!character) return;

    setDraftCharacter({
      ...character,
      manualMetrics,
    });
  }

  if (isLoading) {
    return <BoxLoading height={280} />;
  }

  if (!character) {
    return (
      <div className={styles['character-detail']}>
        <p className={styles['empty-info']}>메인 캐릭터 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const { summary } = character;
  return (
    <div className={styles['character-detail']}>
      <ProfileHeader
        character={character}
        isRefreshing={refreshMainCharacter.isPending}
        isSaving={saveMainCharacter.isPending}
        isSaveDisabled={!hasUnsavedChanges}
        onRefresh={() => void handleRefreshCharacter()}
        onSave={() => void handleSaveCharacter()}
        onChangeManualMetrics={handleChangeManualMetrics}
      />

      <div className={styles['top-layout']}>
        <EquipmentSection equipment={summary.equipment} />

        <section className={styles['right-top-section']} />
        <section className={styles['right-bottom-section']} />
      </div>

      <div className={styles['additional-details']}>
        <div className={styles['additional-primary-column']}>
          <DetailPanel title="보석">
            <div className={styles['gem-list']}>
              {summary.gems.map((gem, index) => (
                <div
                  key={`${gem.slot}-${index}`}
                  className={styles['gem-item']}
                  title={[gem.skillName, ...gem.effects, gem.bonusEffect]
                    .filter(Boolean)
                    .join('\n')}
                >
                  <ItemSlot imageUrl={gem.icon} grade={gem.grade} size={42} />
                  <span>{`${gem.level ?? '-'}${gem.kind?.slice(0, 1) ?? ''}`}</span>
                </div>
              ))}
            </div>
          </DetailPanel>

          <CardSection cards={summary.cards} />
        </div>

        <div className={styles['additional-secondary-column']}>
          <DetailPanel title="특성">
            <div className={styles['combat-stat-list']}>
              {getOrderedStats(summary.profiles.stats).map((stat, index) => (
                <div key={`${stat.type}-${index}`} title={stat.tooltip ?? ''}>
                  <span>{stat.type ?? '-'}</span>
                  <strong>{stat.value ?? '-'}</strong>
                </div>
              ))}
            </div>
            {summary.profiles.skillPoints.total !== null && (
              <p
                className={styles['skill-point']}
              >{`스킬 포인트 ${summary.profiles.skillPoints.using ?? 0}/${summary.profiles.skillPoints.total}`}</p>
            )}
            {summary.profiles.stats.length === 0 && (
              <p className={styles['empty-info']}>전투 정보가 없습니다.</p>
            )}
          </DetailPanel>

          <DetailPanel title="각인">
            <div className={styles['engraving-list']}>
              {summary.engravings.map((engraving, index) => (
                <span key={`${engraving.name}-${index}`} title={engraving.description ?? ''}>
                  <b>{engraving.name ?? '-'}</b>
                  <strong>&times;{engraving.level ?? 0}</strong>
                </span>
              ))}
            </div>
          </DetailPanel>
        </div>

        <div className={styles['additional-tertiary-column']}>
          <DetailPanel title="아크 패시브">
            <div className={styles['ark-points']}>
              {summary.arkPassive.points.map((point, index) => (
                <span key={`${point.name}-${index}`} title={point.description ?? ''}>
                  <b>{point.name ?? '-'}</b>
                  <strong>{point.value ?? 0}P</strong>
                </span>
              ))}
            </div>
          </DetailPanel>

          <DetailPanel title="아크 그리드">
            <div className={styles['core-list']}>
              {summary.arkGrid.cores.map((core, index) => (
                <div key={`${core.name}-${index}`}>
                  <ItemSlot imageUrl={core.icon} grade={core.grade} size={36} />
                  <span>{core.name?.split(':').at(-1)?.trim() ?? '-'}</span>
                  <strong>{core.point ?? 0}P</strong>
                </div>
              ))}
            </div>
            <div className={styles['effect-list']}>
              {summary.arkGrid.effects.map((effect, index) => (
                <span key={`${effect.name}-${index}`}>
                  {effect.name ?? '-'} <strong>Lv. {effect.level ?? 0}</strong>
                </span>
              ))}
            </div>
          </DetailPanel>

          {summary.legendaryAvatars.length > 0 && (
            <DetailPanel title="전설 아바타">
              <div className={styles['legacy-avatar-list']}>
                {summary.legendaryAvatars.map((avatar, index) => (
                  <div key={`${avatar.type}-${index}`} title={avatar.name ?? ''}>
                    <ItemSlot imageUrl={avatar.icon} grade={avatar.grade} size={36} />
                    <span>{avatar.type ?? '-'}</span>
                  </div>
                ))}
              </div>
            </DetailPanel>
          )}
        </div>
      </div>

      <DetailPanel title="아크 패시브 상세">
        <ArkPassiveNodeSection arkPassive={summary.arkPassive} />
      </DetailPanel>

      <div className={styles['skills-section']}>
        <SkillSection skills={summary.combatSkills} />
      </div>

      <div className={styles['avatars-section']}>
        <AvatarSection avatars={summary.avatars} />
      </div>

      <div>
        <p>TODO</p>
        <div>프로필 로펙/일로아/로아랩 버튼 + 치명타확률?, 로펙점수</div>
        <p>$page-width: 1024px; $page-wide-width: 1440px;</p>
        <p>일로아, 로펙, 로아업, 로아지지, 로아랩</p>
        <p>장비 - 장비, 악세, 어빌, 팔찌, 보주, 완갑까지 + 아바타는 어쩔까</p>
        <p>특성 - 힘민지최생, 치특신 - 프로필로 옮길까</p>
        <p>각인 - 어빌돌 연계</p>
        <p>보석</p>
        <p>아크패시브 - 찍은것도 보여주기</p>
        <p>아크그리드</p>
        <p>카드</p>
        <p>스킬</p>
        <p>아바타</p>
      </div>
    </div>
  );
}

function getOrderedStats(stats: TResLostarkMainCharacter['summary']['profiles']['stats']) {
  const priorityTypes = ['치명', '특화', '신속', '공격력', '최대 생명력'];

  return [...stats].sort((left, right) => {
    const leftIndex = priorityTypes.indexOf(left.type ?? '');
    const rightIndex = priorityTypes.indexOf(right.type ?? '');

    return (
      (leftIndex === -1 ? priorityTypes.length : leftIndex) -
      (rightIndex === -1 ? priorityTypes.length : rightIndex)
    );
  });
}
