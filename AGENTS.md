# AGENTS.md

## 프로젝트 참고사항

- 패키지 매니저는 npm입니다. 의존성을 변경하면 `package-lock.json`도 함께 관리하세요.
- Sass 변수와 믹스인은 `next.config.mjs`에서 전역 주입됩니다.
- Lost Ark API는 Supabase Edge Function을 통해 서버에서 호출합니다.

## 명령어

저장소 루트에서 실행하세요.

```bash
npm run dev
npm run lint
npm run format:check
npm run build
npm run build:webpack
```

참고:

- 현재 `package.json`에는 별도 테스트 스크립트가 없습니다.
- 일반적인 코드 변경 후에는 `npm run lint`를 실행하세요.
- 기존 `npm run build`는 Next 16 기본 Turbopack production build입니다.
- 현재 로컬 환경에서는 Turbopack build가 `Creating an optimized production build ...` 단계에서 멈출 수 있습니다.
- 라우팅, PWA, 환경 변수, 빌드 설정에 영향이 있으면 일반 검증에는 `npm run build:webpack`을 우선 실행하세요.
- Turbopack 자체를 확인해야 하는 작업일 때만 `npm run build`를 사용하고, 멈추면 해당 사실을 보고하세요.
- `npm run format`은 사용자가 요청했거나 수정한 파일 포맷팅이 필요한 경우에만 사용하세요.

## 수정 제외 경로

명시적인 요청이 없다면 다음 파일과 디렉터리를 수정하지 마세요.

- `node_modules/`
- `.next/`
- `next-env.d.ts`
- `tsconfig.tsbuildinfo`
- `supabase/.temp/`

## 작업 스킬

- 프론트엔드 TypeScript, React, Next.js route, TanStack Query, 클라이언트 저장소, UI, SCSS 작성·수정·리뷰·리팩터링에는 프로젝트 스킬 `$following-loam-frontend-style`을 적용하세요.
- `src/api`, `src/lib`, Supabase Auth/RLS, SQL migration, Edge Function, 외부 API 서버 호출, 비밀, DB 계약 작성·수정·리뷰·리팩터링에는 프로젝트 스킬 `$following-loam-backend-boundaries`를 적용하세요.

## API와 Supabase

- Supabase Function 호출에는 다음 환경 변수가 필요합니다.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Lost Ark Edge Function은 Supabase 런타임의 `LOSTARK_API_KEY`를 읽습니다.
- 비공개 Lost Ark API key를 클라이언트 코드에 노출하지 마세요.
- 브라우저에서 호출하는 Edge Function을 추가할 때는 CORS 처리를 유지하세요.

## PWA 참고사항

- PWA metadata는 `src/app/layout.tsx`와 `src/app/manifest.ts`에 정의되어 있습니다.
- 서비스 워커 `/sw.js`는 `src/components/ServiceWorkerRegister.tsx`에서 등록합니다.
- 브랜드와 앱 아이콘은 `public/brand/`, `public/icons/`에 있습니다.
- PWA 동작을 바꾸면 가능하면 `npm run build:webpack`와 production serving(`npm run start`)까지 확인하세요.

## Next.js 설정 참고사항

- `next.config.mjs`의 `reactStrictMode: false`는 의도적인 설정입니다. 명시적인 사용자 승인 없이 켜지 마세요.
- ESLint에서 `@next/next/no-img-element` 규칙은 꺼져 있습니다.

## 검증 체크리스트

작업을 마치기 전에 변경 범위에 맞는 가장 작은 검증을 선택하세요.

- TypeScript, React, SCSS 관련 소스 변경: `npm run lint`.
- 포맷팅 영향이 있거나 많은 파일을 수정한 경우: `npm run format:check`.
- Next 설정, 라우팅, metadata, PWA, Supabase 환경 연동, production-sensitive 변경: `npm run build:webpack`.
- 시각적 라우트를 바꾼 경우 가능하면 로컬에서 해당 페이지를 열어 데스크톱 화면을 확인하세요.

검증 명령을 실행하지 못했다면 이유를 명확히 보고하세요.
