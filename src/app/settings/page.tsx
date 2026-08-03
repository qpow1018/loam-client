import SettingsClient from '@/app/settings/SettingsClient';
import SettingsHeader from '@/app/settings/_component/SettingsHeader';

export default function SettingsPage() {
  return (
    <>
      <SettingsHeader />
      <SettingsClient />
    </>
  );
}
