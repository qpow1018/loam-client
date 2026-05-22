'use client';

import { useEffect, useState } from 'react';

import Header from '@/components/common/header/Header';
import { storage, StorageKey } from '@/utils/storage';

import LoadoTable from './_component/loadoTable/LoadoTable';
import type { TLoadoTableData } from './_type/loado';
import { syncRestGaugeCycles } from './_util/syncRestGauge';

import styles from './loadoClient.module.scss';

// 시드 데이터는 결정적(deterministic) ID로 작성한다.
// 모듈 로드 시 uuid를 호출하면 SSR/CSR 사이에 ID가 어긋나 hydration 에러가 난다.
// 사용자가 행/열을 새로 추가할 때 비로소 uuid를 호출한다.
const MOCK_DATA: TLoadoTableData = {
  columns: [
    { id: 'seed-char-1', name: '캐릭터1' },
    { id: 'seed-char-2', name: '캐릭터2' },
  ],
  rows: [
    {
      kind: 'data',
      id: 'seed-row-guild',
      name: '길드 출석',
      resetPeriod: 'daily',
      cellRole: 'checkbox',
    },
    {
      kind: 'data',
      id: 'seed-row-chaos',
      name: '카오스 던전',
      resetPeriod: 'daily',
      cellRole: 'restGauge',
    },
    {
      kind: 'data',
      id: 'seed-row-guardian',
      name: '가디언 토벌',
      resetPeriod: 'daily',
      cellRole: 'restGauge',
    },
    {
      kind: 'data',
      id: 'seed-row-chaosgate',
      name: '카오스 게이트',
      resetPeriod: 'daily',
      cellRole: 'weekdayContent',
    },
    { kind: 'divider', id: 'seed-divider-1' },
    {
      kind: 'data',
      id: 'seed-row-weekly-memo',
      name: '주간 메모',
      resetPeriod: 'weekly',
      cellRole: 'text',
    },
    {
      kind: 'data',
      id: 'seed-row-account-task',
      name: '원정대 할 일',
      resetPeriod: 'permanent',
      cellRole: 'checkbox',
    },
  ],
  cells: {
    'seed-row-guild': {
      'seed-char-1': {
        role: 'checkbox',
        resetPeriod: 'daily',
        checkboxState: 'checked',
        text: '',
        checkboxLabel: '오늘',
        restGauge: null,
        restGaugeSkipThreshold: null,
        weekdays: [],
        cycleKey: 'mock',
        lastAccumulatedCycleKey: 'mock',
      },
      'seed-char-2': {
        role: 'checkbox',
        resetPeriod: 'daily',
        checkboxState: 'unchecked',
        text: '',
        checkboxLabel: '',
        restGauge: null,
        restGaugeSkipThreshold: null,
        weekdays: [],
        cycleKey: 'mock',
        lastAccumulatedCycleKey: 'mock',
      },
    },
    'seed-row-chaosgate': {
      'seed-char-1': {
        role: 'weekdayContent',
        resetPeriod: 'daily',
        checkboxState: 'unchecked',
        text: '',
        checkboxLabel: '',
        restGauge: null,
        restGaugeSkipThreshold: null,
        weekdays: [2, 4, 6],
        cycleKey: 'mock',
        lastAccumulatedCycleKey: 'mock',
      },
      'seed-char-2': {
        role: 'weekdayContent',
        resetPeriod: 'daily',
        checkboxState: 'checked',
        text: '',
        checkboxLabel: '',
        restGauge: null,
        restGaugeSkipThreshold: null,
        weekdays: [2, 4, 6],
        cycleKey: 'mock',
        lastAccumulatedCycleKey: 'mock',
      },
    },
    'seed-row-weekly-memo': {
      'seed-char-1': {
        role: 'text',
        resetPeriod: 'weekly',
        checkboxState: 'none',
        text: '주간 메모 내용',
        checkboxLabel: '',
        restGauge: null,
        restGaugeSkipThreshold: null,
        weekdays: [],
        cycleKey: 'mock',
        lastAccumulatedCycleKey: 'mock',
      },
    },
    'seed-row-chaos': {
      'seed-char-1': {
        role: 'restGauge',
        resetPeriod: 'daily',
        checkboxState: 'none',
        text: '',
        checkboxLabel: '',
        restGauge: 80,
        restGaugeSkipThreshold: null,
        weekdays: [],
        cycleKey: 'mock',
        lastAccumulatedCycleKey: 'mock',
      },
      'seed-char-2': {
        role: 'restGauge',
        resetPeriod: 'daily',
        checkboxState: 'none',
        text: '',
        checkboxLabel: '',
        restGauge: 160,
        restGaugeSkipThreshold: null,
        weekdays: [],
        cycleKey: 'mock',
        lastAccumulatedCycleKey: 'mock',
      },
    },
  },
};

export default function LoadoClient() {
  const [hydrated, setHydrated] = useState(false);

  const [loadoTableData, setLoadoTableData] = useState<TLoadoTableData>(MOCK_DATA);

  // 클라이언트 마운트 시 저장된 상태가 있으면 교체. 동시에 휴식게이지 누적도 1회 반영.
  // localStorage 읽기는 클라이언트 마운트 이후에만 가능하므로 이 패턴이 불가피하다.
  useEffect(() => {
    const base = storage.get<TLoadoTableData>(StorageKey.LOADO_TABLE, MOCK_DATA);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadoTableData(syncRestGaugeCycles(base));
    setHydrated(true);
  }, []);

  // hydration 이후 변경분만 저장
  useEffect(() => {
    if (!hydrated) return;
    storage.set(StorageKey.LOADO_TABLE, loadoTableData);
  }, [loadoTableData, hydrated]);

  return (
    <>
      <Header />

      <div className={styles['loado-client']}>
        <LoadoTable data={loadoTableData} onChange={setLoadoTableData} />
      </div>
    </>
  );
}
