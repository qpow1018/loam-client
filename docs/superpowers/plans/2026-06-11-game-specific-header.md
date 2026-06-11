# Game-Specific Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 로스트아크와 메이플스토리에 도메인별 헤더를 제공하고 공용 설정 페이지가 URL의 게임 컨텍스트에 맞는 헤더를 유지하도록 한다.

**Architecture:** 공용 `Header`는 테마와 두 메뉴 그룹을 렌더링하는 표현 컴포넌트로 축소한다. `LostarkHeader`와 `MaplestoryHeader`가 도메인별 메뉴와 색상을 조합하고, 설정 서버 페이지는 `game` 쿼리를 정규화해 적절한 전용 헤더를 선택한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, SCSS Modules, ESLint

---

## File Map

- Modify `src/components/common/header/Header.tsx`: 공용 헤더 props, 메뉴 그룹, 디바이더 렌더링
- Modify `src/components/common/header/header.module.scss`: mint/rose 테마와 디바이더 스타일
- Create `src/components/lostark/header/LostarkHeader.tsx`: 로스트아크 메뉴 구성
- Create `src/components/maplestory/header/MaplestoryHeader.tsx`: 메이플스토리 메뉴 구성
- Create `src/app/settings/_type/settings.ts`: 설정에서 사용하는 게임 타입
- Modify `src/app/settings/page.tsx`: 쿼리 정규화와 인증 복귀 URL 구성
- Modify `src/app/settings/SettingsClient.tsx`: 게임에 맞는 전용 헤더 선택
- Modify four existing Lost Ark client pages: 공용 헤더 대신 `LostarkHeader` 사용

기존 `Header.tsx`와 `header.module.scss`에 있는 미커밋 변경은 사용자 작업이다. 삭제된 임시 `sub-menu` 코드가 되살아나지 않도록 현재 작업 트리 상태를 기준으로 수정한다.

### Task 1: Make Header A Reusable Presentation Component

**Files:**
- Modify: `src/components/common/header/Header.tsx`
- Modify: `src/components/common/header/header.module.scss`

- [ ] **Step 1: Replace hard-coded Lost Ark navigation with typed props**

Define the public types and component shape in `Header.tsx`:

```tsx
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
```

- [ ] **Step 2: Add theme modifiers and divider styling**

Replace `header.module.scss` with:

```scss
.header {
  position: sticky;
  top: 0;
  z-index: $z-index-header;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 16px;
  height: $header-height;

  &.is-mint {
    background-color: $mint-700;

    .navigation-link:hover {
      background-color: $mint-800;
    }
  }

  &.is-rose {
    background-color: $rose-700;

    .navigation-link:hover {
      background-color: $rose-800;
    }
  }

  .logo {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: $text-primary;
  }

  .navigation {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;

    .navigation-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      height: 36px;
      font-size: 12px;
      font-weight: 500;
      color: $text-primary;
      border-radius: $border-radius;
      text-decoration: none;
    }
  }

  .navigation-divider {
    width: 1px;
    height: 24px;
    background-color: rgba($white, 0.35);
  }
}
```

- [ ] **Step 3: Run the smallest static verification**

Run: `npx eslint src/components/common/header/Header.tsx`

Expected: exit code 0 with no ESLint errors.

### Task 2: Add Domain Header Components

**Files:**
- Create: `src/components/lostark/header/LostarkHeader.tsx`
- Create: `src/components/maplestory/header/MaplestoryHeader.tsx`

- [ ] **Step 1: Create LostarkHeader**

```tsx
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
```

- [ ] **Step 2: Create MaplestoryHeader**

```tsx
import Header, { type THeaderMenu } from '@/components/common/header/Header';

const PRIMARY_MENUS: THeaderMenu[] = [{ name: '메이플 홈', link: '/maplestory/mapledo' }];

const SECONDARY_MENUS: THeaderMenu[] = [
  { name: '로아 홈', link: '/lostark/loado' },
  { name: '설정', link: '/settings?game=maplestory' },
];

export default function MaplestoryHeader() {
  return <Header theme="rose" primaryMenus={PRIMARY_MENUS} secondaryMenus={SECONDARY_MENUS} />;
}
```

- [ ] **Step 3: Verify both components**

Run: `npx eslint src/components/lostark/header/LostarkHeader.tsx src/components/maplestory/header/MaplestoryHeader.tsx`

Expected: exit code 0 with no ESLint errors.

### Task 3: Replace Existing Lost Ark Header Usage

**Files:**
- Modify: `src/app/lostark/loado/LoadoClient.tsx`
- Modify: `src/app/lostark/my-characters/MyCharactersClient.tsx`
- Modify: `src/app/lostark/all-characters/AllCharactersClient.tsx`
- Modify: `src/app/lostark/reference-sites/ReferenceSitesClient.tsx`

- [ ] **Step 1: Change imports in all four files**

Replace:

```tsx
import Header from '@/components/common/header/Header';
```

With:

```tsx
import LostarkHeader from '@/components/lostark/header/LostarkHeader';
```

- [ ] **Step 2: Change rendered components**

Replace each `<Header />` with:

```tsx
<LostarkHeader />
```

- [ ] **Step 3: Verify the migrated pages**

Run: `npx eslint src/app/lostark/loado/LoadoClient.tsx src/app/lostark/my-characters/MyCharactersClient.tsx src/app/lostark/all-characters/AllCharactersClient.tsx src/app/lostark/reference-sites/ReferenceSitesClient.tsx`

Expected: exit code 0 with no ESLint errors.

### Task 4: Preserve Game Context On Settings

**Files:**
- Create: `src/app/settings/_type/settings.ts`
- Modify: `src/app/settings/page.tsx`
- Modify: `src/app/settings/SettingsClient.tsx`

- [ ] **Step 1: Define the settings game type**

```ts
export type TSettingsGame = 'lostark' | 'maplestory';
```

- [ ] **Step 2: Parse game and preserve it through authentication**

Update `page.tsx` to resolve `searchParams`, default invalid values to Lost Ark, and pass the complete settings URL to `requireAuth`:

```tsx
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
```

- [ ] **Step 3: Select the domain header in SettingsClient**

Replace `SettingsClient.tsx` with:

```tsx
import BackupSection from '@/app/settings/_component/BackupSection';
import StorageResetSection from '@/app/settings/_component/StorageResetSection';
import PwaInstallSection from '@/app/settings/_component/PwaInstallSection';
import AuthSection from '@/app/settings/_component/AuthSection';
import type { TSettingsGame } from '@/app/settings/_type/settings';
import LostarkHeader from '@/components/lostark/header/LostarkHeader';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';

import styles from '@/app/settings/settingsClient.module.scss';

export default function SettingsClient(props: { game: TSettingsGame }) {
  const { game } = props;

  return (
    <div className={styles['settings-page']}>
      {game === 'maplestory' ? <MaplestoryHeader /> : <LostarkHeader />}

      <main className={styles['settings-page-container']}>
        <BackupSection />
        <StorageResetSection />
        <PwaInstallSection />
        <AuthSection />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Verify settings files**

Run: `npx eslint src/app/settings/page.tsx src/app/settings/SettingsClient.tsx src/app/settings/_type/settings.ts`

Expected: exit code 0 with no ESLint errors.

### Task 5: Full Verification

**Files:**
- Verify all modified source files

- [ ] **Step 1: Run repository lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 2: Run formatting check**

Run: `npm run format:check`

Expected: exit code 0. If only modified files fail, run Prettier on those exact files and repeat the check; do not format unrelated files.

- [ ] **Step 3: Run the production-sensitive build**

Run: `npm run build:webpack`

Expected: successful Next.js production build. This verifies server `searchParams`, settings props, and both header component trees.

- [ ] **Step 4: Verify in the browser**

Start the app with `npm run dev`, then inspect these URLs at desktop width:

- `/lostark/loado`: mint header, four primary menus, divider, 메이플 홈, 설정
- `/settings?game=lostark`: mint Lost Ark header
- `/settings?game=maplestory`: rose MapleStory header
- `/settings`: mint Lost Ark fallback
- `/settings?game=invalid`: mint Lost Ark fallback

Click both settings links and both game-home links. `/maplestory/mapledo` may show the existing not-found page because route creation is intentionally outside this task; the link target itself must be correct.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check` and `git diff --stat`

Expected: no whitespace errors, no unrelated files, and the pre-existing removal of the temporary `sub-menu` code remains preserved.

- [ ] **Step 6: Commit the implementation after review**

```bash
git add src/components/common/header/Header.tsx src/components/common/header/header.module.scss src/components/lostark/header/LostarkHeader.tsx src/components/maplestory/header/MaplestoryHeader.tsx src/app/lostark/loado/LoadoClient.tsx src/app/lostark/my-characters/MyCharactersClient.tsx src/app/lostark/all-characters/AllCharactersClient.tsx src/app/lostark/reference-sites/ReferenceSitesClient.tsx src/app/settings/page.tsx src/app/settings/SettingsClient.tsx src/app/settings/_type/settings.ts
git commit -m "feat: add game-specific headers"
```
