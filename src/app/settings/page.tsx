import SettingsClient from '@/app/settings/SettingsClient';
import type { TSettingsGame } from '@/app/settings/_type/settings';
import { requireAuth } from '@/lib/auth/requireAuth';

type TSettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsPage(props: TSettingsPageProps) {
  const searchParams = await props.searchParams;
  const gameParam = searchParams?.game;
  const game = getSettingsGame(Array.isArray(gameParam) ? gameParam[0] : gameParam);

  await requireAuth(`/settings?game=${game}`);

  return <SettingsClient game={game} />;
}

function getSettingsGame(game: string | undefined): TSettingsGame {
  return game === 'maplestory' ? 'maplestory' : 'lostark';
}
