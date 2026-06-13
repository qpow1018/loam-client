'use client';

import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import MainCharacterCard from './MainCharacterCard';

import styles from './mainCharactersPanel.module.scss';

export default function MainCharactersPanel(props: {
  characters: TResLostarkMainCharacter[];
  unsavedCharacterIds: Set<string>;
  onChangeCharacter: (character: TResLostarkMainCharacter) => void;
  onSaveCharacter: (characterId: string) => void;
}) {
  const refreshMainCharacter = lostarkQuery.useRefreshMainCharacter();
  const saveMainCharacter = lostarkQuery.useSaveMainCharacter();

  async function handleRefreshCharacter(character: TResLostarkMainCharacter) {
    try {
      const refreshedCharacter = await refreshMainCharacter.mutateAsync(character);
      props.onChangeCharacter(refreshedCharacter);
      toast.success('최신 정보를 불러왔습니다.');
    } catch {
      toast.error('최신 정보를 불러오지 못했습니다.');
    }
  }

  async function handleSaveCharacter(character: TResLostarkMainCharacter) {
    try {
      await saveMainCharacter.mutateAsync(character);
      props.onSaveCharacter(character.id);
      toast.success('메인 캐릭터 정보를 저장했습니다.');
    } catch {
      toast.error('메인 캐릭터 정보를 저장하지 못했습니다.');
    }
  }

  return (
    <section className={styles['main-characters-panel']}>
      <div className={styles['character-list']}>
        {props.characters.map((character) => (
          <MainCharacterCard
            key={character.id}
            summary={character.summary}
            isRefreshing={
              refreshMainCharacter.isPending && refreshMainCharacter.variables?.id === character.id
            }
            isSaving={
              saveMainCharacter.isPending && saveMainCharacter.variables?.id === character.id
            }
            hasUnsavedChanges={props.unsavedCharacterIds.has(character.id)}
            onRefresh={() => void handleRefreshCharacter(character)}
            onSave={() => void handleSaveCharacter(character)}
          />
        ))}
      </div>
    </section>
  );
}
