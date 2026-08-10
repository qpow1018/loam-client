'use client';

import { useEffect, useState } from 'react';

import type { TLostarkManualMetrics, TResLostarkMainCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import AvatarSection from './AvatarSection';
import ArkPassiveNodeSection from './ArkPassiveNodeSection';
import CardSection from './CardSection';
import styles from './characterDetail.module.scss';
import DetailSection from './DetailSection';
import EquipmentSection from './EquipmentSection';
import ItemDetailTooltip from './ItemDetailTooltip';
import ProfileHeader from './ProfileHeader';
import SkillSection from './SkillSection';

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
  const { equipment } = summary;

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
        <EquipmentSection>
          <div className={styles['equipment-columns']}>
            <div className={styles['equipment-group']}>
              <h3>무기 · 방어구</h3>
              <div className={styles['equipment-list']}>
                {equipment.gears.map((gear, index) => (
                  <div key={`${gear.type}-${index}`} className={styles['item-row']} tabIndex={0}>
                    <ItemSlot imageUrl={gear.icon} grade={gear.grade} size={42} />
                    <div className={styles['item-copy']}>
                      <strong>{gear.type ?? '-'}</strong>
                      <span>{`${gear.enhancement ? `+${gear.enhancement} · ` : ''}${gear.itemLevel ?? gear.name ?? '-'}`}</span>
                    </div>
                    <QualityChip quality={gear.quality} />
                    <ItemDetailTooltip
                      name={gear.name}
                      grade={gear.grade}
                      details={[
                        {
                          label: '강화',
                          value: gear.enhancement ? `+${gear.enhancement}` : null,
                        },
                        { label: '아이템 레벨', value: gear.itemLevel },
                        { label: '품질', value: gear.quality },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles['equipment-group']}>
              <h3>장신구</h3>
              <div className={styles['equipment-list']}>
                {equipment.accessories.map((accessory, index) => (
                  <div
                    key={`${accessory.type}-${index}`}
                    className={styles['item-row']}
                    tabIndex={0}
                  >
                    <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} size={42} />
                    <div className={styles['item-copy']}>
                      <div className={styles['item-heading']}>
                        <strong>{accessory.type ?? '-'}</strong>
                        {accessory.tier && <span>{formatTier(accessory.tier)}</span>}
                      </div>
                      <span>{accessory.arkPassiveEffects[0] ?? accessory.name ?? '-'}</span>
                      <div className={styles['item-effects']}>
                        {accessory.polishEffects.map((effect, effectIndex) => (
                          <span
                            key={`${effect.text}-${effectIndex}`}
                            title={effect.text}
                            style={{ color: effect.color ?? undefined }}
                          >
                            {formatEquipmentEffect(effect.text)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <QualityChip quality={accessory.quality} />
                    <ItemDetailTooltip
                      name={accessory.name}
                      grade={accessory.grade}
                      details={[{ label: '품질', value: accessory.quality }]}
                      effects={[
                        ...accessory.basicEffects.map((text) => ({ text })),
                        ...accessory.additionalEffects.map((text) => ({ text })),
                        ...accessory.polishEffects,
                        ...accessory.arkPassiveEffects.map((text) => ({ text })),
                      ]}
                    />
                  </div>
                ))}
              </div>
              <div className={styles['extra-list']}>
                <ExtraItem
                  title="어빌리티 스톤"
                  item={equipment.abilityStone}
                  effects={[
                    ...(equipment.abilityStone?.basicEffects ?? []),
                    ...(equipment.abilityStone?.additionalEffects ?? []),
                    ...(equipment.abilityStone?.abilityStoneBonusEffects ?? []),
                  ]}
                  labels={equipment.abilityStone?.abilityStoneEngravings.map((engraving) => ({
                    label: engraving.name,
                    value: engraving.level,
                  }))}
                />
                <ExtraItem
                  title="팔찌"
                  item={equipment.bracelet}
                  effects={equipment.bracelet?.braceletEffects.map((effect) => effect.text) ?? []}
                  labels={equipment.bracelet?.braceletEffects.map((effect) => ({
                    label: effect.text,
                    value: null,
                  }))}
                />
              </div>
            </div>
          </div>
        </EquipmentSection>

        <section className={styles['right-top-section']} />
        <section className={styles['right-bottom-section']} />
      </div>

      <div className={styles['additional-details']}>
        <div className={styles['additional-primary-column']}>
          <DetailSection
            title="보석"
            summary={`피해 ${summary.gems.filter((gem) => gem.effectType === 'damage').length} · 재사용 ${summary.gems.filter((gem) => gem.effectType === 'cooldown').length}`}
          >
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
          </DetailSection>

          <CardSection cards={summary.cards} />
        </div>

        <div className={styles['additional-secondary-column']}>
          <DetailSection title="특성">
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
          </DetailSection>

          <DetailSection title="각인">
            <div className={styles['engraving-list']}>
              {summary.engravings.map((engraving, index) => (
                <span key={`${engraving.name}-${index}`} title={engraving.description ?? ''}>
                  <b>{engraving.name ?? '-'}</b>
                  <strong>&times;{engraving.level ?? 0}</strong>
                </span>
              ))}
            </div>
          </DetailSection>
        </div>

        <div className={styles['additional-tertiary-column']}>
          <DetailSection title="아크 패시브">
            <div className={styles['ark-points']}>
              {summary.arkPassive.points.map((point, index) => (
                <span key={`${point.name}-${index}`} title={point.description ?? ''}>
                  <b>{point.name ?? '-'}</b>
                  <strong>{point.value ?? 0}P</strong>
                </span>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="아크 그리드">
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
          </DetailSection>

          {summary.legendaryAvatars.length > 0 && (
            <DetailSection title="전설 아바타">
              <div className={styles['legacy-avatar-list']}>
                {summary.legendaryAvatars.map((avatar, index) => (
                  <div key={`${avatar.type}-${index}`} title={avatar.name ?? ''}>
                    <ItemSlot imageUrl={avatar.icon} grade={avatar.grade} size={36} />
                    <span>{avatar.type ?? '-'}</span>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}
        </div>
      </div>

      <DetailSection title="아크 패시브 상세">
        <ArkPassiveNodeSection arkPassive={summary.arkPassive} />
      </DetailSection>

      <SkillSection skills={summary.combatSkills} className={styles['skills-section']} />

      <AvatarSection avatars={summary.avatars} className={styles['avatars-section']} />

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

function ExtraItem(props: {
  title: string;
  item: {
    icon: string | null;
    grade: string | null;
    name: string | null;
    tier: string | null;
  } | null;
  effects: string[];
  labels?: { label: string; value: number | null }[];
}) {
  if (!props.item) return null;

  return (
    <div className={styles['extra-item']} tabIndex={0}>
      <ItemSlot imageUrl={props.item.icon} grade={props.item.grade} size={38} />
      <div className={styles['item-copy']}>
        <div className={styles['item-heading']}>
          <strong>{props.title}</strong>
          {props.item.tier && <span>{formatTier(props.item.tier)}</span>}
        </div>
        <span>{props.item.name ?? '-'}</span>
        {props.labels && props.labels.length > 0 && (
          <div className={styles['item-effects']}>
            {props.labels.map((label, index) => (
              <span key={`${label.label}-${index}`} title={label.label}>
                {label.value !== null && <b>{label.value}</b>}
                {formatEquipmentEffect(label.label)}
              </span>
            ))}
          </div>
        )}
      </div>
      <ItemDetailTooltip
        name={props.item.name}
        grade={props.item.grade}
        details={[]}
        effects={props.effects.map((text) => ({ text }))}
      />
    </div>
  );
}

function formatTier(tier: string) {
  const tierNumber = tier.match(/\d+/)?.[0];

  return tierNumber ? `T${tierNumber}` : tier;
}

function formatEquipmentEffect(effect: string) {
  const effectLabels = [
    ['세레나데, 신앙, 조화 게이지 획득량', '서폿 아덴'],
    ['아군 공격력 강화 효과', '아군공%'],
    ['백어택 스킬이 적에게 주는 피해', '백어택 주피증'],
    ['공격이 치명타로 적중 시 적에게 주는 피해', '치명 주피증'],
    ['무기 공격력', '무공'],
    ['치명타 피해', '치피'],
    ['치명타 적중률', '치적'],
    ['적에게 주는 피해', '적피'],
    ['추가 피해', '추피'],
    ['공격력', '공'],
  ] as const;
  const matchedEffect = effectLabels.find(([text]) => effect.includes(text));

  if (!matchedEffect) return effect;

  const value = effect.match(/[+-]?\d+(?:\.\d+)?%?/)?.[0];

  return value ? `${matchedEffect[1]} ${value}` : matchedEffect[1];
}
