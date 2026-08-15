'use client';

import { useEffect } from 'react';

import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import styles from './myCharactersClient.module.scss';

export default function MyCharactersClient() {
  const { data: mainCharacters = [], isLoading, isError } = lostarkQuery.useGetMainCharacters();

  useEffect(() => {
    if (isError) {
      toast.error('메인 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isError]);

  return (
    <div className={styles['my-characters-client']}>
      <LostarkHeader />

      <div className={styles['my-characters-client-container']}>
        <div className={styles['character-section']}>
          {isLoading && <BoxLoading height={180} />}

          {!isLoading && !isError && mainCharacters.length === 0 && (
            <div className={styles['empty']}>
              <p className={styles['empty-message']}>등록된 메인 캐릭터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
