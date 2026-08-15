import { useState } from 'react';

import type { TLostarkManualMetrics, TResLostarkMainCharacter } from '@/api/lostark/type';

import ManualMetricsModal from './ManualMetricsModal';
import ProfileInfo from './ProfileInfo';
import ProfileToolbar from './ProfileToolbar';

import styles from './profileHeader.module.scss';

export default function ProfileHeader(props: {
  character: TResLostarkMainCharacter;
  isRefreshing: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onRefresh: () => void;
  onSave: () => void;
  onChangeManualMetrics: (manualMetrics: TLostarkManualMetrics) => void;
}) {
  const [isManualMetricsModalOpen, setIsManualMetricsModalOpen] = useState(false);

  const profiles = props.character.summary.profiles;
  const manualMetrics = props.character.manualMetrics;

  return (
    <section className={styles['profile-header']}>
      <div className={styles['profile-image']} aria-hidden="true">
        {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
      </div>

      <div className={styles['profile-info']}>
        <ProfileToolbar
          isRefreshing={props.isRefreshing}
          isSaving={props.isSaving}
          isSaveDisabled={props.isSaveDisabled}
          onRefresh={props.onRefresh}
          onSave={props.onSave}
          onOpenManualMetrics={() => setIsManualMetricsModalOpen(true)}
        />

        <ProfileInfo profiles={profiles} manualMetrics={manualMetrics} />
      </div>

      {isManualMetricsModalOpen && (
        <ManualMetricsModal
          manualMetrics={manualMetrics}
          onClose={() => setIsManualMetricsModalOpen(false)}
          onApply={props.onChangeManualMetrics}
        />
      )}
    </section>
  );
}
