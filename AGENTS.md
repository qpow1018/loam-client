# AGENTS.md

## 프로젝트 개요

LoaM은 로스트아크 유틸리티용 한국어 Next.js 앱입니다. 주요 라우트는 다음과 같습니다.

- `/loado`: 체크리스트/테이블과 메모 기능.
- `/my-characters`: 저장된 로스트아크 캐릭터 목록.
- `/settings`: PWA 설치, 백업/복원, 저장소 초기화.
- `/reference-sites`: 참고 사이트 링크.

루트 페이지는 `/loado`로 리다이렉트됩니다.

## 기술 스택

- Next.js 16 App Router.
- React 19.
- TypeScript `strict: true`.
- SCSS Modules.
- `next.config.mjs`에서 Sass 변수와 믹스인을 전역 주입합니다.
- 패키지 매니저는 npm입니다. 의존성을 바꾸면 `package-lock.json`도 함께 관리하세요.
- Supabase Edge Function을 통해 서버 측에서 Lost Ark API를 호출합니다.

## 명령어

저장소 루트에서 실행하세요.

```bash
npm run dev
npm run lint
npm run format:check
npm run build
```

참고:

- 현재 `package.json`에는 별도 테스트 스크립트가 없습니다.
- 일반적인 코드 변경 후에는 `npm run lint`를 실행하세요.
- 라우팅, PWA, 환경 변수, 빌드 설정에 영향이 있으면 `npm run build`도 실행하세요.
- `npm run format`은 사용자가 요청했거나 수정한 파일 포맷팅이 필요한 경우에만 사용하세요.

## 저장소 구조

- `src/app/`: App Router 라우트와 라우트 전용 코드.
- `src/app/<route>/_component/`: 단일 라우트에서만 쓰는 컴포넌트.
- `src/app/<route>/_type/`, `_util/`, `_define/`: 라우트 전용 타입, 유틸, 상수.
- `src/components/common/`: Button, Modal, Tabs, Loading, Toast, Header 같은 범용 UI 프리미티브.
- `src/hooks/`: 재사용 가능한 훅.
- `src/utils/`: 브라우저 안전 유틸과 typed storage helper.
- `src/api/`: 클라이언트 API 래퍼. `src/api/apiBase.ts`는 axios로 Supabase Function을 호출합니다.
- `src/assets/`: 전역 스타일, Sass 변수, 믹스인, reset.
- `public/`: PWA assets, service worker, 브랜드 이미지, Lost Ark 이미지/아이콘.
- `supabase/functions/`: Supabase Edge Functions.

명시적인 요청이 없다면 다음 파일과 디렉터리는 수정하지 마세요.

- `node_modules/`
- `.next/`
- `next-env.d.ts`
- `tsconfig.tsbuildinfo`
- `supabase/.temp/`

## 컴포넌트 배치

- 단일 페이지 전용 컴포넌트는 `src/app/<route>/_component/`에 둡니다.
- 두 번째 라우트가 같은 도메인 컴포넌트를 필요로 하면 `src/components/<domain>/`으로 승격합니다.
- 도메인과 무관한 범용 UI는 `src/components/common/`에 둡니다.
- import는 직접 경로를 사용합니다. `@/*`는 `src/*`를 가리킵니다.

## TypeScript / React 규칙

- 기본은 `type`을 사용하고, declaration merging이 필요할 때만 `interface`를 사용합니다.
- 새로 만드는 exported domain type은 `T` 접두사를 사용합니다. 예: `TCharacter`, `TLoadoTableProps`.
- 컴포넌트 파일명은 PascalCase입니다. 예: `Button.tsx`.
- 컴포넌트 폴더명은 lowercase 또는 lower camel case입니다. 예: `button/`, `memoTable/`.
- route의 `page.tsx`는 가능한 서버 컴포넌트로 두고, 상호작용이 필요한 UI는 `LoadoClient`, `SettingsClient` 같은 별도 Client 컴포넌트로 분리하는 기존 패턴을 따릅니다.
- 훅, 브라우저 API, 이벤트 핸들러, 로컬 스토리지가 필요한 컴포넌트에만 `'use client'`를 붙입니다.
- `window`, `localStorage`, `sessionStorage` 접근은 클라이언트 가드를 유지하세요. 기존 `src/utils/storage.ts`의 `isClient()` 패턴을 따릅니다.
- 새 UI 프리미티브를 만들기 전에 `src/components/common/`의 기존 컴포넌트를 먼저 확인하세요.

## 스타일 규칙

- 컴포넌트 스타일은 `*.module.scss`를 사용합니다.
- 스타일 import 이름은 `styles`를 사용합니다.
- 클래스 접근은 `styles['loado-table']`처럼 bracket notation을 사용합니다.
- SCSS 클래스명은 kebab-case를 사용합니다.
- SCSS Module은 파일의 대표 root class를 기준으로 작성하고, 해당 컴포넌트에 속한 하위 요소, 상태, modifier, media query는 최소한 root class 아래에 nesting하세요.
- 독립적으로 재사용되는 class, `@keyframes`, `@mixin`, 전역 스타일처럼 root class에 속하지 않는 항목만 top-level로 둘 수 있습니다.
- nesting depth는 얕게 유지하세요. root class 아래에서 2-3단계 이상 깊어질 것 같다면 class 구조를 다시 정리하세요.
- 새 공용 색상, 크기, 믹스인을 만들기 전에 `src/assets/_variables.scss`와 `src/assets/_mixins.scss`를 확인하세요.
- Sass 변수와 믹스인은 `next.config.mjs`에서 자동 주입되므로 각 모듈에 반복해서 `@use`를 추가하지 마세요.
- LoaM의 다크 UI 톤을 유지하세요. 기본은 gray 계열이고, primary는 mint, secondary는 rose입니다.
- ESLint에서 `@next/next/no-img-element` 규칙은 꺼져 있습니다. 적절한 경우 `<img>` 사용이 허용되며, 기존 public asset 참조와 레이아웃 안정성을 함께 확인하세요.

## 데이터와 저장소

- 클라이언트 영속 데이터는 주로 `src/utils/storage.ts`를 통해 local storage에 저장합니다.
- 새 storage key는 하드코딩하지 말고 `StorageKey`에 추가하세요.
- 백업/복원 로직은 `src/app/settings/_util/storageBackup.ts`, 초기화 로직은 `src/app/settings/_util/storageReset.ts`에 있습니다. 영속 데이터가 추가되면 둘 다 함께 갱신하세요.
- 상세 데이터 shape는 AGENTS.md에 복제하지 말고 해당 route의 `_type/`, `_util/`, `_define/` 파일에서 확인하세요.
- 저장된 JSON shape를 바꿀 때는 기존 사용자 local storage에 오래된 데이터가 남아 있을 수 있음을 고려하세요.

## API와 Supabase

- 프론트엔드 API 호출은 `src/api/apiBase.ts`와 `src/api/` 아래 route-specific wrapper를 통해 처리하세요.
- Supabase Function 호출에는 다음 환경 변수가 필요합니다.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `lostark-sibling-characters` Edge Function은 Supabase 런타임의 `LOSTARK_API_KEY`를 읽습니다.
- 비공개 Lost Ark API key를 클라이언트 코드에 노출하지 마세요.
- 브라우저에서 호출하는 Edge Function을 추가할 때는 CORS 처리를 유지하세요.

## PWA 참고사항

- PWA metadata는 `src/app/layout.tsx`와 `src/app/manifest.ts`에 정의되어 있습니다.
- 서비스 워커 `/sw.js`는 `src/components/ServiceWorkerRegister.tsx`에서 등록합니다.
- 브랜드와 앱 아이콘은 `public/brand/`, `public/icons/`에 있습니다.
- PWA 동작을 바꾸면 가능하면 `npm run build`와 production serving(`npm run start`)까지 확인하세요.

## Next.js 설정 참고사항

- `next.config.mjs`의 `reactStrictMode: false`는 의도적인 설정입니다. 명시적인 사용자 승인 없이 켜지 마세요.
- `next.config.mjs`는 Sass 변수와 믹스인을 전역 주입합니다. 특별한 이유 없이 각 SCSS Module에서 중복 `@use`를 추가하지 마세요.

## 검증 체크리스트

작업을 마치기 전에 변경 범위에 맞는 가장 작은 검증을 선택하세요.

- TypeScript, React, SCSS 관련 소스 변경: `npm run lint`.
- 포맷팅 영향이 있거나 많은 파일을 수정한 경우: `npm run format:check`.
- Next 설정, 라우팅, metadata, PWA, Supabase 환경 연동, production-sensitive 변경: `npm run build`.
- 시각적 라우트를 바꾼 경우 가능하면 로컬에서 해당 페이지를 열고 desktop/mobile 폭을 확인하세요.

검증 명령을 실행하지 못했다면 이유를 명확히 보고하세요.
