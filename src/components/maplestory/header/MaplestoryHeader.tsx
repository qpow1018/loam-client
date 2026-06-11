import Header, { type THeaderMenu } from '@/components/common/header/Header';

const PRIMARY_MENUS: THeaderMenu[] = [{ name: '메이플 홈', link: '/maplestory/mapledo' }];

const SECONDARY_MENUS: THeaderMenu[] = [
  { name: '로아 홈', link: '/lostark/loado' },
  { name: '설정', link: '/settings?game=maplestory' },
];

export default function MaplestoryHeader() {
  return <Header theme="rose" primaryMenus={PRIMARY_MENUS} secondaryMenus={SECONDARY_MENUS} />;
}
