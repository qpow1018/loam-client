import BackupSection from '@/app/settings/_component/BackupSection';
import StorageResetSection from '@/app/settings/_component/StorageResetSection';
import PwaInstallSection from '@/app/settings/_component/PwaInstallSection';
import AuthSection from '@/app/settings/_component/AuthSection';

import styles from '@/app/settings/settingsClient.module.scss';

export default function SettingsClient() {
  return (
    <main className={styles['settings-page-container']}>
      <BackupSection />
      <StorageResetSection />
      <PwaInstallSection />
      <AuthSection />
    </main>
  );
}
