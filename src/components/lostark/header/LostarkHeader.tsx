import Header, { type THeaderMenu } from '@/components/common/header/Header';

const PRIMARY_MENUS: THeaderMenu[] = [
  { name: '할일', link: '/lostark/loado' },
  { name: '메인캐릭터', link: '/lostark/my-characters' },
  { name: '전체캐릭터', link: '/lostark/all-characters' },
  { name: '클리어 골드', link: '/lostark/clear-gold' },
  { name: '재련 최적화', link: '/lostark/refining' },
  { name: '참고 사이트', link: '/lostark/reference-sites' },
];

const GAME_SWITCH_MENU: THeaderMenu = { name: '메이플 홈', link: '/maplestory/mapledo' };
const SETTINGS_MENU: THeaderMenu = { name: '설정', link: '/settings?game=lostark' };

export default function LostarkHeader(props: { isBackupReminderVisible?: boolean }) {
  const { isBackupReminderVisible = true } = props;

  return (
    <Header
      theme="mint"
      homeLink="/lostark/loado"
      primaryMenus={PRIMARY_MENUS}
      gameSwitchMenu={GAME_SWITCH_MENU}
      settingsMenu={SETTINGS_MENU}
      backupReminderLink={isBackupReminderVisible ? '/settings?game=lostark#backup' : undefined}
    />
  );
}
