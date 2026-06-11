import Link from 'next/link';

import styles from './header.module.scss';

export type THeaderMenu = {
  name: string;
  link: string;
};

type THeaderProps = {
  theme: 'mint' | 'rose';
  primaryMenus: THeaderMenu[];
  secondaryMenus: THeaderMenu[];
};

export default function Header(props: THeaderProps) {
  const { theme, primaryMenus, secondaryMenus } = props;
  const hasDivider = primaryMenus.length > 0 && secondaryMenus.length > 0;

  function renderMenu(menu: THeaderMenu) {
    return (
      <Link key={menu.link} href={menu.link} className={styles['navigation-link']}>
        {menu.name}
      </Link>
    );
  }

  return (
    <header className={`${styles['header']} ${styles[`is-${theme}`]}`}>
      <div className={styles['logo']}>LoaM</div>

      <nav className={styles['navigation']}>
        {primaryMenus.map(renderMenu)}
        {hasDivider && <span aria-hidden="true" className={styles['navigation-divider']} />}
        {secondaryMenus.map(renderMenu)}
      </nav>
    </header>
  );
}
