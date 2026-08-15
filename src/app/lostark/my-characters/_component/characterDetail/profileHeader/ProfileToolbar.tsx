import Button from '@/components/common/button/Button';

import styles from './profileToolbar.module.scss';

export default function ProfileToolbar(props: {
  isRefreshing: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onRefresh: () => void;
  onSave: () => void;
  onOpenManualMetrics: () => void;
}) {
  const isDirectInputDisabled = props.isRefreshing || props.isSaving;

  return (
    <div className={styles['profile-toolbar']}>
      <div className={styles['actions-box']}>
        <Button
          color="gray"
          fill="solid"
          isDisabled={isDirectInputDisabled}
          onClick={props.onOpenManualMetrics}
        >
          직접입력
        </Button>
        <Button
          color="gray"
          fill="solid"
          isLoading={props.isRefreshing}
          isDisabled={props.isSaving}
          onClick={props.onRefresh}
        >
          갱신
        </Button>
        <Button
          color="mint"
          fill="solid"
          isLoading={props.isSaving}
          isDisabled={props.isRefreshing || props.isSaveDisabled}
          onClick={props.onSave}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
