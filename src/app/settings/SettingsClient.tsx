import AppSection from '@/app/settings/_component/AppSection';
import StorageSection from '@/app/settings/_component/StorageSection';

import styles from '@/app/settings/settingsClient.module.scss';

export default function SettingsClient() {
  return (
    <main className={styles['settings-page']}>
      <StorageSection />
      <AppSection />
    </main>
  );
}
