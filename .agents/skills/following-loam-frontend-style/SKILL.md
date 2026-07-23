---
name: following-loam-frontend-style
description: Use when writing, modifying, reviewing, or refactoring frontend TypeScript, React, Next.js routes, TanStack Query hooks, client storage, frontend API usage, or SCSS code in the loam-client repository. Applies route-local placement, server/client component boundaries, server-state flow, naming, storage, and UI styling conventions. Do not use for Supabase migrations, RLS, Auth, or Edge Functions.
---

# LoaM 프론트엔드 스타일

LoaM 프론트엔드 코드를 작성하거나 수정할 때 다음 규칙을 적용한다.

## 파일 배치

- 단일 라우트 전용 컴포넌트는 `src/app/<route>/_component/`에 둔다.
- 라우트 전용 타입, 유틸, 상수는 각각 `_type/`, `_util/`, `_define/`에 둔다.
- 두 번째 라우트에서 같은 도메인 컴포넌트가 필요해지면 `src/components/<domain>/`으로 옮긴다.
- 도메인과 무관한 공용 UI 컴포넌트는 `src/components/common/`에 둔다.
- 컴포넌트 폴더명은 lowercase 또는 lower camel case로 작성한다.
- React 생명주기에 의존하는 재사용 로직은 `src/hooks/`에 둔다.
- TanStack Query 기반 서버 상태 훅은 `src/queries/`에 둔다.
- 여러 기능에서 재사용하는 범용 유틸은 `src/utils/`에 둔다.
- import는 직접 경로를 사용한다. `@/*`는 `src/*`를 가리킨다.

## TypeScript

- 객체, union, 함수 등 새로운 타입은 기본적으로 `type`으로 선언한다.
- 새로 만드는 타입 이름에는 `T` 접두사를 붙인다.
- API 요청 타입은 `TReq`, 응답 타입은 `TRes` 접두사를 사용한다.
- 타입 전용 import에는 `import type`을 사용한다.
- 상수 데이터에는 필요한 경우 `as const`를 사용한다.
- 모듈 상수는 `UPPER_SNAKE_CASE`로 작성한다.
- `any` 대신 `unknown`과 명시적인 타입 검사를 사용한다.

## React와 Next.js

- `page.tsx`는 항상 서버 컴포넌트로 작성하며 `'use client'`를 선언하지 않는다.
- `page.tsx`는 서버 입력 해석과 route-level 조립에 집중하고 얇게 유지한다.
- 상호작용이 필요한 페이지 UI는 `<RouteName>Client.tsx`로 분리한다.
- `'use client'`는 클라이언트 기능을 직접 사용하는 컴포넌트의 진입 파일에만 선언한다.
- 컴포넌트와 이름 있는 헬퍼 함수는 함수 선언식으로 작성한다.
- 컴포넌트 파일명은 PascalCase를 사용한다.
- boolean 값은 `is...`, 이벤트 props는 `on...`, 이벤트 처리 함수는 `handle...`로 이름을 짓는다.
- 조건이 충족되지 않으면 조기 반환하여 중첩을 줄인다.
- 새 UI 프리미티브를 만들기 전에 `src/components/common/`의 기존 컴포넌트를 확인한다.

## 서버 상태와 API 사용

- 캐시와 재검증이 필요한 서버 상태는 `src/queries/`의 query hook이 `src/api/`의 도메인 API를 호출하도록 구성한다.
- 캐시할 필요가 없는 단발성 명령은 UI에서 `src/api/`의 도메인 API를 직접 호출할 수 있다.
- UI 컴포넌트에서 Supabase table이나 Edge Function을 직접 호출하지 않는다.
- query key는 해당 `src/queries/` 모듈에서 소유한다.
- mutation 성공 후 반영되어야 하는 query cache를 직접 갱신하거나 무효화한다.
- 서버 상태를 캐시와 별개의 컴포넌트 상태에 장기 복제하지 않는다. 폼 편집 초안처럼 별도 상태가 필요한 경우만 분리한다.

## 클라이언트 저장소

- 일반적인 `localStorage`와 `sessionStorage` 접근에는 `src/utils/storage.ts`를 사용한다.
- `window`, `localStorage`, `sessionStorage`에 직접 접근할 때는 클라이언트 가드를 유지한다.
- 새로운 storage key는 하드코딩하지 않고 `StorageKey`에 추가한다.
- 영속 데이터가 추가되면 백업, 복원, 초기화 로직도 함께 갱신한다.
- 저장된 JSON 구조를 변경할 때는 기존 사용자 데이터와의 호환성을 확인한다.

## SCSS Modules

- 컴포넌트 스타일은 `*.module.scss`로 작성한다.
- SCSS Module은 `styles`라는 이름으로 import한다.
- 클래스명은 kebab-case로 작성한다.
- 클래스는 `styles['class-name']` 형식으로 접근한다.
- 하위 요소는 컴포넌트의 HTML 구조가 드러나도록 대표 root class 아래에 nesting한다.
- 상태와 modifier는 해당 요소 아래에 nesting한다.
- nesting 깊이는 고정하지 않고 HTML 구조와 가독성에 따라 결정한다.
- 독립적으로 재사용되는 클래스, `@keyframes`, `@mixin`, 전역 스타일만 top-level에 둔다.
- 새로운 공용 색상, 크기, 믹스인을 만들기 전에 `src/assets/_variables.scss`와 `src/assets/_mixins.scss`를 확인한다.
- Sass 변수와 믹스인은 전역 주입되므로 SCSS Module에 `@use`를 반복해서 추가하지 않는다.
- 기존 gray 기반 다크 UI와 mint, rose 강조색을 유지한다.
