import Link from 'next/link';

import styles from './header.module.scss';

const LOA_MAIN_MENUS = [
  {
    name: '할일',
    link: '/loado',
  },
  {
    name: '내 캐릭터',
    link: '/my-characters',
  },
  {
    name: '기타 기능',
    link: '/etc-features',
  },
  {
    name: '설정',
    link: '/settings',
  },
  {
    name: '개발 메모',
    link: '/dev',
  },
];

export default function Header() {
  return (
    <header className={styles['header']}>
      <div className={styles['logo']}>LoaM</div>

      <nav className={styles['navigation']}>
        {LOA_MAIN_MENUS.map((item) => (
          <Link key={item.link} href={item.link} className={styles['navigation-link']}>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* <div className={styles['sub-menu']}>서브메뉴</div> */}
    </header>
  );
}
