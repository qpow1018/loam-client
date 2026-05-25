# Project: Loam-client (로스트아크, 메이플스토리 게임 유틸 프로젝트)

## Critical Rules (절대 규칙)

- 현재는 없음

## Architecture (프로젝트 구조)

api/
app/
assets/
components/
common/ # 도메인 무관 범용 UI 프리미티브 (Button, Modal, Header 등)
<도메인>/ # 둘 이상의 페이지에서 공유되는 도메인 컴포넌트 (필요 시 생성, 예: loado/, maple/)
define/
hooks/ # 범용 커스텀 훅 (useBodyScrollLock 등)
utils/
types/

### 컴포넌트 배치 규칙

- 단일 페이지 전용 컴포넌트는 `app/<route>/_component/`에 둔다.
- 두 번째 페이지가 그 컴포넌트를 필요로 하는 순간 → `src/components/<도메인>/`으로 승격.
- 도메인과 무관하게 어디서든 쓰이는 범용 UI 프리미티브는 `src/components/common/`.

## Tech Stack (기술 스택)

- Next.js 16
- React 19
- TypeScript
- SCSS Modules

<!-- ## Domain Context (도메인 컨텍스트) -->

## Coding Convention (코딩 컨벤션)

### 컴포넌트 파일

- 폴더명은 lowercase, 컴포넌트 파일명은 PascalCase (예: `common/button/Button.tsx`)
- 한 폴더 안에 여러 컴포넌트가 있을 때 폴더명은 대표/패밀리 개념을 사용 (예: `button/`에 `Button.tsx` + `IconButton.tsx`)
- import는 직접 경로 사용

### TypeScript 타입

- 기본은 `type` 사용. `interface`는 declaration merging이 필요할 때만.
- 새 타입은 `T` 접두사 (예: `TCharacter`, `TLoadoTableProps`).
- 제네릭 파라미터는 단일 문자(`<T>`)를 사용해도 됨 — 한 타입 내부 스코프라 prefix-T와 혼동 없음.

### scss 파일

- `*.module.scss` 형태로 작성
- 파일명: 컴포넌트 이름과 동일한 camelCase, 첫문자는 소문자 (예: `loadoTable.module.scss`)
- 클래스명: kebab-case 사용 (예: `.loado-table`, `.header-row`)
- css nesting 적용
- 실제 사용처에선 styles라는 이름으로 import
- 실제 사용처에선 styles[''] 형태로 사용
- `src/assets/_variables.scss`, `src/assets/_mixins.scss` 를 확인하고 필요한 전역 변수나 믹스인이 있다면 사용

<!-- ## Key Patterns (핵심 패턴) -->

## Next.js 설정 참고사항

- `next.config.mjs` 의 `reactStrictMode: false` 는 의도적인 설정입니다 — 일부 레거시 컴포넌트가 이펙트의 1회 실행에 의존하므로, 사용자 확인 없이 켜지 말 것.
- `src/app/layout.tsx` 의 metadata 가 `"Create Next App"` 플레이스홀더로 되어 있습니다 — 배포 요청이 있을 때 업데이트하고, 그 외에는 우연히 변경하지 말 것.
