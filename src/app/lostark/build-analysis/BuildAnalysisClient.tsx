'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import api from '@/api';
import type { TLostarkCharacterRawPayload } from '@/api/lostark/type';

import BoxLoading from '@/components/common/loading/BoxLoading';

import BuildAnalysisSnapshot from './_component/BuildAnalysisSnapshot';
import styles from './buildAnalysisPage.module.scss';

type TSearchTarget = {
  characterName: string;
};

export default function BuildAnalysisClient() {
  const [searchCharacterName, setSearchCharacterName] = useState('반포동딜키리');
  const [searchTarget, setSearchTarget] = useState<TSearchTarget | null>(null);
  const [rawPayload, setRawPayload] = useState<TLostarkCharacterRawPayload | null>(null);
  const searchCharacter = useMutation({
    mutationFn: api.lostark.getCharacterDetails,
    onSuccess(response) {
      setRawPayload(response.data.rawPayload);
    },
  });

  useEffect(() => {
    if (!searchTarget || !rawPayload || searchCharacter.isPending || searchCharacter.isError)
      return;

    console.log('[세팅 분석] raw_payload', rawPayload);
  }, [rawPayload, searchCharacter.isError, searchCharacter.isPending, searchTarget]);

  function handleSearch() {
    const normalizedCharacterName = searchCharacterName.trim();

    setSearchTarget({
      characterName: normalizedCharacterName,
    });
    setRawPayload(null);
    searchCharacter.mutate(normalizedCharacterName);
  }

  return (
    <main className={styles['build-analysis-page']}>
      <header className={styles['page-header']}>
        <h1>세팅 분석</h1>
        <p>시뮬레이션 기준으로 사용할 캐릭터를 검색해주세요.</p>
      </header>

      <form
        className={styles['search-form']}
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <label className={styles['search-label']} htmlFor="build-analysis-character-name">
          캐릭터명
        </label>
        <div className={styles['search-control']}>
          <input
            id="build-analysis-character-name"
            value={searchCharacterName}
            onChange={(event) => setSearchCharacterName(event.target.value)}
            placeholder="캐릭터명을 입력해주세요"
          />
          <button type="submit" disabled={searchCharacterName.trim().length === 0}>
            검색
          </button>
        </div>
      </form>

      {searchTarget !== null && searchCharacter.isPending && <BoxLoading height={120} />}

      {searchTarget !== null && !searchCharacter.isPending && searchCharacter.isError && (
        <p className={styles['status-message']}>캐릭터 원본 정보를 불러오지 못했습니다.</p>
      )}

      {searchTarget !== null &&
        rawPayload === null &&
        !searchCharacter.isPending &&
        !searchCharacter.isError && (
          <p className={styles['status-message']}>원본 API 응답이 없습니다.</p>
        )}

      {searchTarget !== null &&
        rawPayload &&
        !searchCharacter.isPending &&
        !searchCharacter.isError && (
          <>
            <p className={styles['status-message']}>
              {`${searchTarget.characterName}의 최신 원본 응답을 콘솔에 출력했습니다.`}
            </p>
            <BuildAnalysisSnapshot rawPayload={rawPayload} />
          </>
        )}
    </main>
  );
}
