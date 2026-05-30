import BackupSection from '@/app/settings/_component/BackupSection';
import AutoBackupSection from '@/app/settings/_component/AutoBackupSection';
import StorageResetSection from '@/app/settings/_component/StorageResetSection';
import AppSection from '@/app/settings/_component/AppSection';

import styles from '@/app/settings/settingsClient.module.scss';

export default function SettingsClient() {
  return (
    <main className={styles['settings-page']}>
      <BackupSection />
      <AutoBackupSection />
      <StorageResetSection />
      <AppSection />
    </main>
  );
}
