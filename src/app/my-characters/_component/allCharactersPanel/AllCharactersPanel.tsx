'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type {
  TCreateMyCharacterInfo,
  TMyCharacterInfo,
} from '@/app/my-characters/_type/myCharacters';
import { getAnonymousClientId } from '@/app/my-characters/_util/anonymousClient';
import {
  addMyCharacters,
  deleteMyCharacter,
  getMyCharacters,
  reorderMyCharacters,
  toggleMainCharacter,
  updateMyCharacters,
} from '@/app/my-characters/_util/myCharacter';
import {
  isLostarkSpecDebugEnabled,
  logCharacterSpecDebug,
} from '@/app/my-characters/_util/specDebug';
import Button from '@/components/common/button/Button';
import toast from '@/utils/toast';

import CharacterList from './CharacterList';
import CreateCharacterModal from './CreateCharacterModal';

import styles from './allCharactersPanel.module.scss';

export default function AllCharactersPanel(props: {
  characters: TMyCharacterInfo[];
  onCharactersChange: (characters: TMyCharacterInfo[]) => void;
}) {
  const [anonymousClientId, setAnonymousClientId] = useState('');
  const [togglingMainCharacterId, setTogglingMainCharacterId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnonymousClientId(getAnonymousClientId());
  }, []);

  function handleReorder(next: TMyCharacterInfo[]) {
    props.onCharactersChange(next);
    reorderMyCharacters(next);
  }

  function handleSubmitCharacters(nextCharacters: TCreateMyCharacterInfo[]) {
    if (nextCharacters.length === 0) {
      return;
    }

    addMyCharacters(nextCharacters);
    props.onCharactersChange(getMyCharacters());
    setIsCreateModalOpen(false);
    toast.success('캐릭터를 등록했습니다.');
  }

  function handleDeleteCharacter(id: string) {
    deleteMyCharacter(id);
    props.onCharactersChange(getMyCharacters());
  }

  async function handleRefreshCharacters() {
    if (props.characters.length === 0 || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const response = await api.lostark.getSiblingCharacters(props.characters[0].nickname);
      const itemLevelByCharacterName = new Map(
        response.data.map((character) => [character.CharacterName, character.ItemAvgLevel]),
      );

      const nextCharacters = props.characters.map((character) => {
        const nextItemLevel = itemLevelByCharacterName.get(character.nickname);
        if (nextItemLevel === undefined) {
          return character;
        }

        return {
          ...character,
          itemLevel: nextItemLevel,
        };
      });

      updateMyCharacters(nextCharacters);
      props.onCharactersChange(nextCharacters);
      toast.success('원정대를 갱신했습니다.');
    } catch {
      toast.error('원정대 갱신에 실패했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleToggleMainCharacter(character: TMyCharacterInfo) {
    if (!anonymousClientId) {
      toast.error('브라우저 식별자를 준비 중입니다.');
      return;
    }

    if (togglingMainCharacterId) return;

    setTogglingMainCharacterId(character.id);

    try {
      const nextCharacters = toggleMainCharacter(character.id);
      props.onCharactersChange(nextCharacters);

      if (character.isMain === true) {
        toast.success('메인 캐릭터를 해제했습니다.');
        return;
      }

      const target = nextCharacters.find((nextCharacter) => nextCharacter.id === character.id);
      if (!target) return;

      const response = await api.lostark.getCharacterSpec({
        characterName: target.nickname,
        debug: isLostarkSpecDebugEnabled(),
      });

      const saveResponse = await api.lostark.saveMainCharacterSpec({
        anonymousClientId,
        spec: {
          ...response.data,
          savedAt: null,
          updatedAt: null,
        },
      });

      logCharacterSpecDebug('first-save', saveResponse.data);
      toast.success('메인 캐릭터를 등록했습니다.');
    } catch {
      const rollbackCharacters = toggleMainCharacter(character.id);
      props.onCharactersChange(rollbackCharacters);
      toast.error('메인 캐릭터 등록에 실패했습니다.');
    } finally {
      setTogglingMainCharacterId(null);
    }
  }

  return (
    <section className={styles['all-characters-panel']}>
      <div className={styles['list-header']}>
        <p className={styles['title']}>내 캐릭터 목록</p>
        <div className={styles['header-actions']}>
          <Button
            onClick={handleRefreshCharacters}
            theme="bg-gray600"
            isLoading={isRefreshing}
            isDisabled={props.characters.length === 0}
          >
            원정대 갱신
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} theme="bg-pri">
            원정대 불러오기
          </Button>
        </div>
      </div>

      {props.characters.length === 0 ? (
        <div className={styles['empty']}>
          <p className={styles['empty-message']}>원정대 캐릭터를 불러오세요.</p>
        </div>
      ) : (
        <CharacterList
          characters={props.characters}
          togglingMainCharacterId={togglingMainCharacterId}
          onReorder={handleReorder}
          onDeleteItem={handleDeleteCharacter}
          onToggleMain={handleToggleMainCharacter}
        />
      )}

      {isCreateModalOpen && (
        <CreateCharacterModal
          isOpen={isCreateModalOpen}
          registeredCharacters={props.characters}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmitCharacters}
        />
      )}
    </section>
  );
}
