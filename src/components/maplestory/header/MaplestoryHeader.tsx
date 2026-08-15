import Header, { type THeaderMenu } from '@/components/common/header/Header';

const PRIMARY_MENUS: THeaderMenu[] = [
  { name: '할일', link: '/maplestory/mapledo' },
  { name: '장비 관리', link: '/maplestory/equipment' },
  { name: '내 캐릭터', link: '/maplestory/my-characters' },
  { name: '유니온', link: '/maplestory/union' },
];

const GAME_SWITCH_MENU: THeaderMenu = { name: '로아 홈', link: '/lostark/loado' };
const SETTINGS_MENU: THeaderMenu = { name: '설정', link: '/settings' };

export default function MaplestoryHeader(props: { isBackupReminderVisible?: boolean }) {
  const { isBackupReminderVisible = true } = props;

  return (
    <Header
      theme="rose"
      homeLink="/maplestory/mapledo"
      primaryMenus={PRIMARY_MENUS}
      gameSwitchMenu={GAME_SWITCH_MENU}
      settingsMenu={SETTINGS_MENU}
      backupReminderLink={isBackupReminderVisible ? '/settings#backup' : undefined}
    />
  );
}
