'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CloudBackupReminder from '@/components/common/header/CloudBackupReminder';

import styles from './header.module.scss';

export type THeaderMenu = {
  name: string;
  link: string;
};

type THeaderProps = {
  theme: 'mint' | 'rose';
  homeLink: string;
  primaryMenus: THeaderMenu[];
  gameSwitchMenu: THeaderMenu;
  settingsMenu: THeaderMenu;
  backupReminderLink?: string;
};

export default function Header(props: THeaderProps) {
  const { theme, homeLink, primaryMenus, gameSwitchMenu, settingsMenu, backupReminderLink } = props;
  const pathname = usePathname();

  function renderMenu(menu: THeaderMenu) {
    const menuPathname = menu.link.split('?')[0];
    const isActive = pathname === menuPathname || pathname.startsWith(`${menuPathname}/`);

    return (
      <Link
        key={menu.link}
        href={menu.link}
        className={`${styles['navigation-link']} ${isActive ? styles['is-active'] : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {menu.name}
      </Link>
    );
  }

  return (
    <header className={`${styles['header']} ${styles[`is-${theme}`]}`}>
      <Link href={homeLink} className={styles['logo']} aria-label="LoaM 홈">
        LoaM
      </Link>

      <nav className={styles['primary-navigation']} aria-label="주요 메뉴">
        {primaryMenus.map(renderMenu)}

        <div className={styles['backup-reminder-slot']}>
          {backupReminderLink !== undefined && (
            <CloudBackupReminder settingsLink={backupReminderLink} />
          )}
        </div>
      </nav>

      <nav className={styles['utility-navigation']} aria-label="보조 메뉴">
        {renderMenu(gameSwitchMenu)}
        <span aria-hidden="true" className={styles['navigation-divider']} />
        {renderMenu(settingsMenu)}
      </nav>
    </header>
  );
}
