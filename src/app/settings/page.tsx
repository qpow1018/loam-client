import SettingsClient from '@/app/settings/SettingsClient';
import { requireAuth } from '@/lib/auth/requireAuth';

export default async function SettingsPage() {
  await requireAuth('/settings');

  return <SettingsClient />;
}
