'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type { TResLostarkMyCharacter, TReqCreateLostarkMyCharacter } from '@/api/lostark/type';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import Button from '@/components/common/button/Button';
import CharacterList from './CharacterList';
import CreateCharacterModal from './CreateCharacterModal';

import styles from './allCharactersPanel.module.scss';

export default function AllCharactersPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [allCharacters, setAllCharacters] = useState<TResLostarkMyCharacter[]>([]);

  const [togglingMainCharacterId, setTogglingMainCharacterId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    async function getMyCharactersFromServer() {
      try {
        const res = await api.lostark.getMyCharacters();
        setAllCharacters(res);
        setIsLoading(false);
      } catch {
        toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
      }
    }

    getMyCharactersFromServer();
  }, []);

  async function handleSubmitCharacters(nextCharacters: TReqCreateLostarkMyCharacter[]) {
    if (nextCharacters.length === 0) {
      return;
    }

    try {
      const savedCharacters = await api.lostark.addMyCharacters(
        nextCharacters,
        allCharacters.length,
      );
      setAllCharacters(savedCharacters);
      setIsCreateModalOpen(false);
      toast.success('캐릭터를 등록했습니다.');
    } catch {
      toast.error('캐릭터 등록에 실패했습니다.');
    }
  }

  async function handleRefreshCharacters() {
    if (allCharacters.length === 0 || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const resSiblingCharacters = await api.lostark.getSiblingCharacters(
        allCharacters[0].nickname,
      );
      const itemLevelByCharacterName = new Map(
        resSiblingCharacters.data.map((character) => [
          character.CharacterName,
          character.ItemAvgLevel,
        ]),
      );

      const nextCharacters = allCharacters.map((character) => {
        const nextItemLevel = itemLevelByCharacterName.get(character.nickname);
        if (nextItemLevel === undefined) {
          return character;
        }

        return {
          ...character,
          itemLevel: nextItemLevel,
        };
      });

      const resUpdateMyCharacters = await api.lostark.updateMyCharacters(nextCharacters);
      setAllCharacters(resUpdateMyCharacters);
      toast.success('원정대를 갱신했습니다.');
    } catch {
      toast.error('원정대 갱신에 실패했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleReorder(next: TResLostarkMyCharacter[]) {
    const previous = allCharacters;
    setAllCharacters(next);

    try {
      const response = await api.lostark.reorderMyCharacters(next);
      setAllCharacters(response);
    } catch {
      setAllCharacters(previous);
      toast.error('캐릭터 순서 변경에 실패했습니다.');
    }
  }

  async function handleToggleMainCharacter(character: TResLostarkMyCharacter) {
    if (togglingMainCharacterId) return;

    setTogglingMainCharacterId(character.id);

    try {
      const response = await api.lostark.toggleMainCharacter(character);
      setAllCharacters(response);

      toast.success(
        character.isMain === true ? '메인 캐릭터를 해제했습니다.' : '메인 캐릭터를 등록했습니다.',
      );
    } catch {
      toast.error('메인 캐릭터 변경에 실패했습니다.');
    } finally {
      setTogglingMainCharacterId(null);
    }
  }

  async function handleDeleteCharacter(id: string) {
    try {
      const response = await api.lostark.deleteMyCharacter(id);
      setAllCharacters(response);
      toast.success('캐릭터를 삭제했습니다.');
    } catch {
      toast.error('캐릭터 삭제에 실패했습니다.');
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
            isDisabled={allCharacters.length === 0}
          >
            원정대 갱신
          </Button>

          <Button onClick={() => setIsCreateModalOpen(true)} theme="bg-pri">
            원정대 불러오기
          </Button>
        </div>
      </div>

      {isLoading && <BoxLoading height={240} />}

      {!isLoading && allCharacters.length === 0 && (
        <div className={styles['empty']}>
          <p className={styles['empty-message']}>원정대 캐릭터를 불러오세요.</p>
        </div>
      )}

      {!isLoading && allCharacters.length > 0 && (
        <CharacterList
          characters={allCharacters}
          togglingMainCharacterId={togglingMainCharacterId}
          onReorder={handleReorder}
          onToggleMain={handleToggleMainCharacter}
          onDeleteItem={handleDeleteCharacter}
        />
      )}

      {isCreateModalOpen && (
        <CreateCharacterModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          registeredCharacters={allCharacters}
          onSubmit={handleSubmitCharacters}
        />
      )}
    </section>
  );
}
