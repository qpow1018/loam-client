'use client';

import { type Dispatch, type SetStateAction, useState } from 'react';

import api from '@/api';
import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import toast from '@/utils/toast';

import MainCharacterCard from './MainCharacterCard';

import styles from './mainCharactersPanel.module.scss';

export default function MainCharactersPanel(props: {
  characters: TResLostarkMainCharacter[];
  onChangeCharacters: Dispatch<SetStateAction<TResLostarkMainCharacter[]>>;
}) {
  const [refreshingCharacterId, setRefreshingCharacterId] = useState<string | null>(null);
  const [savingCharacterId, setSavingCharacterId] = useState<string | null>(null);
  const [unsavedCharacterIds, setUnsavedCharacterIds] = useState<Set<string>>(new Set());

  async function handleRefreshCharacter(character: TResLostarkMainCharacter) {
    setRefreshingCharacterId(character.id);

    try {
      const response = await api.lostark.getCharacterDetails(character.characterName);
      const details = response.data;

      props.onChangeCharacters((prev) =>
        prev.map((item) =>
          item.id === character.id
            ? {
                ...item,
                characterName: details.characterName || item.characterName,
                characterClass: details.characterClass || item.characterClass,
                itemLevel: details.itemLevel || item.itemLevel,
                summary: details.summary,
                rawPayload: details.rawPayload ?? null,
              }
            : item,
        ),
      );
      setUnsavedCharacterIds((prev) => {
        const next = new Set(prev);
        next.add(character.id);
        return next;
      });
      toast.success('최신 정보를 불러왔습니다.');
    } catch {
      toast.error('최신 정보를 불러오지 못했습니다.');
    } finally {
      setRefreshingCharacterId(null);
    }
  }

  async function handleSaveCharacter(character: TResLostarkMainCharacter) {
    setSavingCharacterId(character.id);

    try {
      const savedCharacter = await api.lostark.saveMainCharacter(character);

      props.onChangeCharacters((prev) =>
        prev.map((item) => (item.id === savedCharacter.id ? savedCharacter : item)),
      );
      setUnsavedCharacterIds((prev) => {
        const next = new Set(prev);
        next.delete(character.id);
        return next;
      });
      toast.success('메인 캐릭터 정보를 저장했습니다.');
    } catch {
      toast.error('메인 캐릭터 정보를 저장하지 못했습니다.');
    } finally {
      setSavingCharacterId(null);
    }
  }

  return (
    <section className={styles['main-characters-panel']}>
      <div className={styles['character-list']}>
        {props.characters.map((character) => (
          <MainCharacterCard
            key={character.id}
            summary={character.summary}
            isRefreshing={refreshingCharacterId === character.id}
            isSaving={savingCharacterId === character.id}
            hasUnsavedChanges={unsavedCharacterIds.has(character.id)}
            onRefresh={() => void handleRefreshCharacter(character)}
            onSave={() => void handleSaveCharacter(character)}
          />
        ))}
      </div>
    </section>
  );
}
