'use client';

import { useEffect } from 'react';

import type { TMaplestoryUnionGroup, TResMaplestoryUnionCharacter } from '@/api/maplestory/type';
import maplestoryQuery from '@/queries/maplestoryQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import UnionGroup from './_component/UnionGroup';

import styles from './unionClient.module.scss';

const UNION_GROUPS: { value: TMaplestoryUnionGroup; label: string }[] = [
  { value: 'special1', label: '특수1' },
  { value: 'luk', label: '럭' },
  { value: 'str', label: '힘' },
  { value: 'dex', label: '덱' },
  { value: 'int', label: '인트' },
  { value: 'special2', label: '특수2' },
];

export default function UnionClient() {
  const { data: characters = [], isLoading, isError } = maplestoryQuery.useGetUnionCharacters();
  const saveUnionCharacterLevel = maplestoryQuery.useSaveUnionCharacterLevel();
  const reorderUnionCharacters = maplestoryQuery.useReorderUnionCharacters();

  useEffect(() => {
    if (isError) {
      toast.error('유니온 목록을 불러오지 못했습니다.');
    }
  }, [isError]);

  async function handleLevelChange(characterId: string, level: number | null): Promise<boolean> {
    const character = characters.find((item) => item.id === characterId);

    if (character === undefined) return false;

    try {
      await saveUnionCharacterLevel.mutateAsync({ ...character, level });
      return true;
    } catch {
      toast.error('레벨 저장에 실패했습니다.');
      return false;
    }
  }

  async function handleReorder(reorderedCharacters: TResMaplestoryUnionCharacter[]) {
    try {
      await reorderUnionCharacters.mutateAsync(reorderedCharacters);
    } catch {
      toast.error('유니온 순서 변경에 실패했습니다.');
    }
  }

  return (
    <div className={styles['union-client']}>
      <MaplestoryHeader />

      <main className={styles['union-client-container']}>
        {isLoading && <BoxLoading height={360} />}

        {!isLoading && !isError && (
          <div className={styles['group-list']}>
            {UNION_GROUPS.map((group) => {
              const groupCharacters = characters
                .filter((character) => character.group === group.value)
                .sort((a, b) => a.sortOrder - b.sortOrder);

              return (
                <UnionGroup
                  key={group.value}
                  label={group.label}
                  characters={groupCharacters}
                  onLevelChange={handleLevelChange}
                  onReorder={handleReorder}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
