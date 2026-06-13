'use client';

import { useEffect, useMemo, useState } from 'react';

import maplestoryQuery from '@/queries/maplestoryQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import Tabs from '@/components/common/tabs/Tabs';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import EquipmentContent from './_component/EquipmentContent';

import styles from './equipmentClient.module.scss';

export default function EquipmentClient() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const {
    data: characters = [],
    isLoading: isCharacterLoading,
    isError: isCharacterLoadError,
  } = maplestoryQuery.useGetMyCharacters();

  const activeCharacterId = characters.some((character) => character.id === selectedCharacterId)
    ? selectedCharacterId
    : (characters[0]?.id ?? null);

  useEffect(() => {
    if (isCharacterLoadError) {
      toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isCharacterLoadError]);

  const characterTabs = useMemo(
    () => characters.map((character) => ({ value: character.id, label: character.nickname })),
    [characters],
  );

  return (
    <div className={styles['equipment-client']}>
      <MaplestoryHeader />

      <main className={styles['equipment-client-container']}>
        {isCharacterLoading && <BoxLoading height={320} />}

        {!isCharacterLoading && !isCharacterLoadError && characters.length === 0 && (
          <div className={styles['empty-state']}>내 캐릭터를 먼저 등록해 주세요.</div>
        )}

        {!isCharacterLoading && activeCharacterId !== null && (
          <section className={styles['equipment-section']}>
            <Tabs
              options={characterTabs}
              value={activeCharacterId}
              onChange={setSelectedCharacterId}
            />
            <EquipmentContent key={activeCharacterId} characterId={activeCharacterId} />
          </section>
        )}
      </main>
    </div>
  );
}
