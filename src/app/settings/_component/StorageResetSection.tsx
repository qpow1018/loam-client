'use client';

import { useState } from 'react';

import type { TSettingsGame } from '@/app/settings/_type/settings';
import {
  RESET_TARGETS,
  resetStorageTarget,
  type TResetTarget,
} from '@/app/settings/_util/storageReset';

import Button from '@/components/common/button/Button';
import Confirm from '@/components/common/modal/Confirm';
import SettingsField from '@/app/settings/_component/SettingsField';
import SettingsSection from '@/app/settings/_component/SettingsSection';

const RESET_TARGETS_BY_GAME: Record<
  TSettingsGame,
  { partial: TResetTarget[]; all: TResetTarget; allDescription: string }
> = {
  lostark: {
    partial: ['loado', 'memo'],
    all: 'lostark',
    allDescription: 'Loado 할일과 메모 데이터를 삭제합니다.',
  },
  maplestory: {
    partial: [],
    all: 'maplestory',
    allDescription: 'Mapledo 할일 데이터를 삭제합니다.',
  },
};

export default function StorageResetSection(props: { game: TSettingsGame }) {
  const { game } = props;
  const resetTargets = RESET_TARGETS_BY_GAME[game];

  const [resetStatus, setResetStatus] = useState<string>();
  const [pendingResetTarget, setPendingResetTarget] = useState<TResetTarget | null>(null);

  function handleResetConfirm() {
    if (pendingResetTarget === null) return;

    const target = resetStorageTarget(pendingResetTarget);
    setPendingResetTarget(null);
    setResetStatus(
      `${target.statusLabel} 데이터를 초기화했습니다. 다른 화면은 새로고침 후 반영됩니다.`,
    );
  }

  return (
    <>
      <SettingsSection
        title="저장소 초기화"
        description="선택한 저장 데이터를 삭제합니다. 전체 초기화도 백업 파일 자체는 삭제하지 않습니다."
        status={resetStatus}
      >
        {resetTargets.partial.length > 0 && (
          <SettingsField label="부분 초기화" value="선택한 데이터만 삭제합니다.">
            {resetTargets.partial.map((target) => (
              <Button
                key={target}
                theme="bd-gray"
                size="small"
                onClick={() => setPendingResetTarget(target)}
              >
                {RESET_TARGETS[target].actionLabel}
              </Button>
            ))}
          </SettingsField>
        )}

        <SettingsField label="전체 초기화" value={resetTargets.allDescription}>
          <Button
            theme="bg-sec"
            size="small"
            onClick={() => setPendingResetTarget(resetTargets.all)}
          >
            {RESET_TARGETS[resetTargets.all].actionLabel}
          </Button>
        </SettingsField>
      </SettingsSection>

      <Confirm
        isOpen={pendingResetTarget !== null}
        onClose={() => setPendingResetTarget(null)}
        title="저장소 초기화"
        message={
          pendingResetTarget === null
            ? ''
            : `${RESET_TARGETS[pendingResetTarget].confirmMessage} 이 작업은 되돌릴 수 없습니다.`
        }
        buttons={[
          {
            label: '취소',
            theme: 'bd-gray',
            onClick: () => setPendingResetTarget(null),
          },
          {
            label: '초기화',
            theme: 'bg-sec',
            onClick: handleResetConfirm,
          },
        ]}
      />
    </>
  );
}
