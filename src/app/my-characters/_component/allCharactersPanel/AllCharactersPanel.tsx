'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type { TCreateLostarkMyCharacter, TLostarkMyCharacter } from '@/api/lostark/type';
import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import toast from '@/utils/toast';

import CharacterList from './CharacterList';
import CreateCharacterModal from './CreateCharacterModal';

import styles from './allCharactersPanel.module.scss';

export default function AllCharactersPanel() {
  const [characters, setCharacters] = useState<TLostarkMyCharacter[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [togglingMainCharacterId, setTogglingMainCharacterId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function loadCharacters() {
      try {
        setCharacters(await api.lostark.getMyCharacters());
      } catch {
        toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadCharacters();
  }, []);

  async function handleReorder(next: TLostarkMyCharacter[]) {
    const previous = characters;
    setCharacters(next);

    try {
      setCharacters(await api.lostark.reorderMyCharacters(next));
    } catch {
      setCharacters(previous);
      toast.error('캐릭터 순서 변경에 실패했습니다.');
    }
  }

  async function handleSubmitCharacters(nextCharacters: TCreateLostarkMyCharacter[]) {
    if (nextCharacters.length === 0) {
      return;
    }

    try {
      const savedCharacters = await api.lostark.addMyCharacters(nextCharacters, characters.length);
      setCharacters(savedCharacters);
      setIsCreateModalOpen(false);
      toast.success('캐릭터를 등록했습니다.');
    } catch {
      toast.error('캐릭터 등록에 실패했습니다.');
    }
  }

  async function handleDeleteCharacter(id: string) {
    try {
      setCharacters(await api.lostark.deleteMyCharacter(id));
      toast.success('캐릭터를 삭제했습니다.');
    } catch {
      toast.error('캐릭터 삭제에 실패했습니다.');
    }
  }

  async function handleRefreshCharacters() {
    if (characters.length === 0 || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const response = await api.lostark.getSiblingCharacters(characters[0].nickname);
      const itemLevelByCharacterName = new Map(
        response.data.map((character) => [character.CharacterName, character.ItemAvgLevel]),
      );

      const nextCharacters = characters.map((character) => {
        const nextItemLevel = itemLevelByCharacterName.get(character.nickname);
        if (nextItemLevel === undefined) {
          return character;
        }

        return {
          ...character,
          itemLevel: nextItemLevel,
        };
      });

      setCharacters(await api.lostark.updateMyCharacters(nextCharacters));
      toast.success('원정대를 갱신했습니다.');
    } catch {
      toast.error('원정대 갱신에 실패했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleToggleMainCharacter(character: TLostarkMyCharacter) {
    if (togglingMainCharacterId) return;

    setTogglingMainCharacterId(character.id);

    try {
      setCharacters(await api.lostark.toggleMainCharacter(character.id));
      toast.success(
        character.isMain === true ? '메인 캐릭터를 해제했습니다.' : '메인 캐릭터를 등록했습니다.',
      );
    } catch {
      toast.error('메인 캐릭터 변경에 실패했습니다.');
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
            isDisabled={characters.length === 0}
          >
            원정대 갱신
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} theme="bg-pri">
            원정대 불러오기
          </Button>
        </div>
      </div>

      {isLoading ? (
        <BoxLoading height={240} />
      ) : characters.length === 0 ? (
        <div className={styles['empty']}>
          <p className={styles['empty-message']}>원정대 캐릭터를 불러오세요.</p>
        </div>
      ) : (
        <CharacterList
          characters={characters}
          togglingMainCharacterId={togglingMainCharacterId}
          onReorder={handleReorder}
          onDeleteItem={handleDeleteCharacter}
          onToggleMain={handleToggleMainCharacter}
        />
      )}

      {isCreateModalOpen && (
        <CreateCharacterModal
          isOpen={isCreateModalOpen}
          registeredCharacters={characters}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmitCharacters}
        />
      )}
    </section>
  );
}
