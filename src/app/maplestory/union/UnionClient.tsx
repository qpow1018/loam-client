'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type { TMaplestoryUnionGroup, TResMaplestoryUnionCharacter } from '@/api/maplestory/type';
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
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState<TResMaplestoryUnionCharacter[]>([]);

  useEffect(() => {
    async function loadUnionCharacters() {
      try {
        const response = await api.maplestory.getUnionCharacters();
        setCharacters(response);
      } catch {
        toast.error('유니온 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadUnionCharacters();
  }, []);

  async function handleLevelChange(characterId: string, level: number | null): Promise<boolean> {
    const previousCharacters = characters;
    const nextCharacters = characters.map((character) =>
      character.id === characterId ? { ...character, level } : character,
    );
    const nextCharacter = nextCharacters.find((character) => character.id === characterId);

    if (nextCharacter === undefined) return false;

    setCharacters(nextCharacters);

    try {
      await api.maplestory.saveUnionCharacterLevel(nextCharacter);
      return true;
    } catch {
      setCharacters(previousCharacters);
      toast.error('레벨 저장에 실패했습니다.');
      return false;
    }
  }

  async function handleReorder(
    group: TMaplestoryUnionGroup,
    reorderedCharacters: TResMaplestoryUnionCharacter[],
  ) {
    const previousCharacters = characters;
    const nextOrderById = new Map(
      reorderedCharacters.map((character, index) => [character.id, index]),
    );
    const nextCharacters = characters.map((character) => {
      if (character.group !== group) return character;

      return {
        ...character,
        sortOrder: nextOrderById.get(character.id) ?? character.sortOrder,
      };
    });

    setCharacters(nextCharacters);

    try {
      await api.maplestory.reorderUnionCharacters(reorderedCharacters);
    } catch {
      setCharacters(previousCharacters);
      toast.error('유니온 순서 변경에 실패했습니다.');
    }
  }

  return (
    <div className={styles['union-client']}>
      <MaplestoryHeader />

      <main className={styles['union-client-container']}>
        {isLoading && <BoxLoading height={360} />}

        {!isLoading && (
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
                  onReorder={(nextCharacters) => handleReorder(group.value, nextCharacters)}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
