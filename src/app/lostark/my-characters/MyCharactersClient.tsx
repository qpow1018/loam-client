'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import toast from '@/utils/toast';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import Tabs from '@/components/common/tabs/Tabs';
import LostarkHeader from '@/components/lostark/header/LostarkHeader';
import MainCharacterOrderModal from './_component/MainCharacterOrderModal';
import MainCharactersPanel from './_component/mainCharactersPanel/MainCharactersPanel';
import SpecSummaryPanel from './_component/specSummaryPanel/SpecSummaryPanel';

import styles from './myCharactersClient.module.scss';

type TMyCharactersTab = 'main' | 'spec-summary';

const MY_CHARACTER_TABS = [
  { value: 'main', label: '메인캐릭터' },
  { value: 'spec-summary', label: '스펙요약' },
] as const;

export default function MyCharactersClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [mainCharacters, setMainCharacters] = useState<TResLostarkMainCharacter[]>([]);
  const [activeTab, setActiveTab] = useState<TMyCharactersTab>('main');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    async function loadMainCharacters() {
      try {
        const response = await api.lostark.getMainCharacters();
        setMainCharacters(response);
      } catch {
        toast.error('메인 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadMainCharacters();
  }, []);

  async function handleSubmitMainCharacterOrder(nextCharacters: TResLostarkMainCharacter[]) {
    setIsReordering(true);

    try {
      const response = await api.lostark.reorderMainCharacters(nextCharacters);
      setMainCharacters(response);
      setIsOrderModalOpen(false);
      toast.success('메인 캐릭터 순서를 저장했습니다.');
    } catch {
      toast.error('메인 캐릭터 순서를 저장하지 못했습니다.');
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <div className={styles['my-characters-client']}>
      <LostarkHeader />

      <div className={styles['my-characters-client-container']}>
        <div className={styles['tab-section']}>
          <div className={styles['tab-box']}>
            <Tabs<TMyCharactersTab>
              options={MY_CHARACTER_TABS}
              value={activeTab}
              onChange={(next) => setActiveTab(next)}
            />
          </div>

          <Button
            theme="bg-gray600"
            onClick={() => setIsOrderModalOpen(true)}
            isDisabled={isLoading || mainCharacters.length === 0}
          >
            순서변경
          </Button>
        </div>

        <div className={styles['character-section']}>
          {isLoading && <BoxLoading height={180} />}

          {!isLoading && mainCharacters.length === 0 && (
            <div className={styles['empty']}>
              <p className={styles['empty-message']}>등록된 메인 캐릭터가 없습니다.</p>
            </div>
          )}

          {!isLoading && mainCharacters.length > 0 && activeTab === 'main' && (
            <MainCharactersPanel
              characters={mainCharacters}
              onChangeCharacters={setMainCharacters}
            />
          )}

          {!isLoading && mainCharacters.length > 0 && activeTab === 'spec-summary' && (
            <SpecSummaryPanel characters={mainCharacters} />
          )}
        </div>
      </div>

      {isOrderModalOpen && (
        <MainCharacterOrderModal
          isOpen={isOrderModalOpen}
          isSaving={isReordering}
          characters={mainCharacters}
          onClose={() => setIsOrderModalOpen(false)}
          onSubmit={handleSubmitMainCharacterOrder}
        />
      )}
    </div>
  );
}
