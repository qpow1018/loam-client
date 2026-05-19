import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Navigation />
      <SubMenu />
    </header>
  );
}

function Logo() {
  return (
    <div className={styles.logo}>
      LoaM
    </div>
  );
}

function Navigation() {
  return (
    <nav className={styles.navigation}>
      <NavigationLink
        link='/loado'
        text='할일'
      />
      <NavigationLink
        link='/my-characters'
        text='내 캐릭터'
      />
    </nav>
  );
}

function NavigationLink(
  props: {
    link: string;
    text: string;
  }
) {
  return (
    <Link href={props.link} className={styles.navigationLink}>
      { props.text }
    </Link>
  );
}

function SubMenu() {
  return (
    <div className={styles.subMenu}>
      서브메뉴
    </div>
  );
}
