import Header, { type THeaderMenu } from '@/components/common/header/Header';

const PRIMARY_MENUS: THeaderMenu[] = [
  { name: '할일', link: '/lostark/loado' },
  { name: '메인캐릭터', link: '/lostark/my-characters' },
  { name: '전체캐릭터', link: '/lostark/all-characters' },
  { name: '참고 사이트', link: '/lostark/reference-sites' },
];

const SECONDARY_MENUS: THeaderMenu[] = [
  { name: '메이플 홈', link: '/maplestory/mapledo' },
  { name: '설정', link: '/settings?game=lostark' },
];

export default function LostarkHeader() {
  return <Header theme="mint" primaryMenus={PRIMARY_MENUS} secondaryMenus={SECONDARY_MENUS} />;
}
