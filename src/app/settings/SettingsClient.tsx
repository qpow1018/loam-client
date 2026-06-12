import type { TSettingsGame } from '@/app/settings/_type/settings';
import LostarkHeader from '@/components/lostark/header/LostarkHeader';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';

import BackupSection from '@/app/settings/_component/BackupSection';
import StorageResetSection from '@/app/settings/_component/StorageResetSection';
import PwaInstallSection from '@/app/settings/_component/PwaInstallSection';
import AuthSection from '@/app/settings/_component/AuthSection';

import styles from '@/app/settings/settingsClient.module.scss';

export default function SettingsClient(props: { game: TSettingsGame }) {
  const { game } = props;

  return (
    <div className={styles['settings-page']}>
      {game === 'maplestory' ? <MaplestoryHeader /> : <LostarkHeader />}

      <main className={styles['settings-page-container']}>
        <BackupSection />
        <StorageResetSection game={game} />
        <PwaInstallSection />
        <AuthSection />
      </main>
    </div>
  );
}
