'use client';

import { useState } from 'react';

import {
  RESET_TARGETS,
  resetStorageTarget,
  type TResetTarget,
} from '@/app/settings/_util/storageReset';

import Button from '@/components/common/button/Button';
import Confirm from '@/components/common/modal/Confirm';
import SettingsField from '@/app/settings/_component/SettingsField';
import SettingsSection from '@/app/settings/_component/SettingsSection';

const RESET_GROUPS: Array<{
  label: string;
  description: string;
  partial: TResetTarget[];
  all: TResetTarget;
}> = [
  {
    label: '로스트아크',
    description: 'Loado 할일과 메모 데이터를 삭제합니다.',
    partial: ['loado', 'loadoMemo'],
    all: 'lostark',
  },
  {
    label: '메이플스토리',
    description: 'Mapledo 할일과 메모 데이터를 삭제합니다.',
    partial: ['mapledo', 'mapledoMemo'],
    all: 'maplestory',
  },
];

export default function StorageResetSection() {

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
        {RESET_GROUPS.map((group) => (
          <SettingsField key={group.all} label={group.label} value={group.description}>
            {group.partial.map((target) => (
              <Button
                key={target}
                color="gray"
                fill="outline"
                size="small"
                onClick={() => setPendingResetTarget(target)}
              >
                {RESET_TARGETS[target].actionLabel}
              </Button>
            ))}
            <Button
              color="rose"
              fill="solid"
              size="small"
              onClick={() => setPendingResetTarget(group.all)}
            >
              전체 초기화
            </Button>
          </SettingsField>
        ))}
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
            color: 'gray',
            fill: 'outline',
            onClick: () => setPendingResetTarget(null),
          },
          {
            label: '초기화',
            color: 'rose',
            fill: 'solid',
            onClick: handleResetConfirm,
          },
        ]}
      />
    </>
  );
}
