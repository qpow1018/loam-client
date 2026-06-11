import Header, { type THeaderMenu } from '@/components/common/header/Header';

const PRIMARY_MENUS: THeaderMenu[] = [
  { name: '할일', link: '/maplestory/mapledo' },
  { name: '내 캐릭터', link: '/maplestory/my-characters' },
];

const SECONDARY_MENUS: THeaderMenu[] = [
  { name: '로아 홈', link: '/lostark/loado' },
  { name: '설정', link: '/settings?game=maplestory' },
];

export default function MaplestoryHeader() {
  return <Header theme="rose" primaryMenus={PRIMARY_MENUS} secondaryMenus={SECONDARY_MENUS} />;
}
