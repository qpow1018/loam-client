'use client';

import { useEffect, useState } from 'react';

import lostarkQuery from '@/queries/lostarkQuery';

import BoxLoading from '@/components/common/loading/BoxLoading';

import styles from './buildAnalysisPage.module.scss';

type TSearchTarget = {
  characterName: string;
};

export default function BuildAnalysisClient() {
  const [searchCharacterName, setSearchCharacterName] = useState('반포동딜키리');
  const [searchTarget, setSearchTarget] = useState<TSearchTarget | null>(null);
  const {
    data: rawPayload,
    isLoading: isRawPayloadLoading,
    isError: isRawPayloadError,
  } = lostarkQuery.useGetMainCharacterRawPayload(searchTarget?.characterName ?? null);

  useEffect(() => {
    if (!searchTarget || !rawPayload || isRawPayloadLoading || isRawPayloadError) return;

    console.log('[세팅 분석] raw_payload', rawPayload);
  }, [isRawPayloadError, isRawPayloadLoading, rawPayload, searchTarget]);

  function handleSearch() {
    const normalizedCharacterName = searchCharacterName.trim();

    setSearchTarget({
      characterName: normalizedCharacterName,
    });
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

      {searchTarget !== null && isRawPayloadLoading && <BoxLoading height={120} />}

      {searchTarget !== null && !isRawPayloadLoading && isRawPayloadError && (
        <p className={styles['status-message']}>캐릭터 원본 정보를 불러오지 못했습니다.</p>
      )}

      {searchTarget !== null &&
        rawPayload === null &&
        !isRawPayloadLoading &&
        !isRawPayloadError && (
          <p className={styles['status-message']}>
            등록된 캐릭터를 찾을 수 없거나 저장된 원본 API 응답이 없습니다.
          </p>
        )}

      {searchTarget !== null && rawPayload && !isRawPayloadLoading && !isRawPayloadError && (
        <p className={styles['status-message']}>
          {`${searchTarget.characterName}의 원본 응답을 콘솔에 출력했습니다.`}
        </p>
      )}
    </main>
  );
}
