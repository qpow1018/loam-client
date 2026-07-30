---
name: following-loam-backend-boundaries
description: Use when writing, modifying, reviewing, or refactoring LoaM data access in src/api, server and auth infrastructure in src/lib, Supabase Auth or RLS, SQL migrations, Edge Functions, external API server calls, secrets, or database contracts. Applies project-specific ownership, authorization, data mapping, migration, and verification boundaries. Do not use for React UI, TanStack Query cache design, client storage, or SCSS.
---

# LoaM 백엔드 경계

LoaM의 데이터 접근, 인증, Supabase, Edge Function, 외부 API 경계를 다룰 때 다음 규칙을 적용한다. Supabase 제품 자체의 최신 사용법은 현재 공식 문서를 확인하고, 이 스킬에는 LoaM 저장소 고유 경계만 유지한다.

## 파일 배치와 소유권

- 클라이언트가 사용하는 도메인 API 래퍼는 `src/api/<domain>/index.ts`에 둔다.
- API 요청·응답·DB row 경계 타입은 `src/api/<domain>/type.ts`에 둔다.
- Supabase 브라우저·서버 client와 세션 인프라는 `src/lib/supabase/`에 둔다.
- allowlist, redirect 같은 인증 규칙은 `src/lib/auth/`에 둔다.
- Supabase Edge Function은 `supabase/functions/<function-name>/index.ts`에 둔다.
- DB schema, grant, RLS, index 변경은 `supabase/migrations/`의 새 migration으로 관리한다.

## API와 데이터 계약

- DB row 타입은 이름 끝에 `Row`를 붙이고 DB 필드는 `snake_case`로 표현한다.
- DB row의 `snake_case`를 `src/api/`에서 애플리케이션용 `camelCase`로 변환한다.
- 조회할 column을 명시하고 UI에 DB row와 Supabase 응답 구조를 그대로 노출하지 않는다.
- 사용자 소유 작업은 인증된 사용자를 직접 조회하고, 요청 본문의 `user_id`를 소유권 근거로 신뢰하지 않는다.
- 사용자 소유 query에는 애플리케이션 조건과 RLS를 함께 유지한다. 애플리케이션 필터만을 보안 경계로 삼지 않는다.
- Supabase 오류를 무시한 빈 결과로 바꾸지 말고 호출자가 실패를 처리할 수 있게 전파한다.

## Auth와 비밀

- 브라우저에는 Supabase URL과 publishable key만 노출하고 service role key, `LOSTARK_API_KEY`, 서버 비밀을 노출하지 않는다.
- 외부 API key는 Edge Function의 `Deno.env`에서 읽고 응답·로그·예외에 포함하지 않는다.
- 서버 인가는 검증된 user/claims와 `AUTH_ALLOWED_EMAILS`를 함께 확인하고, allowlist가 비었거나 누락되면 차단한다.
- 인가 판단에 사용자가 수정할 수 있는 `user_metadata`를 사용하지 않는다.
- `verify_jwt = false`인 Edge Function은 bearer token을 함수 내부에서 검증하고 allowlist 통과 후에만 외부 API나 데이터에 접근한다.
- 인증 실패, 비허용 계정, 서버 설정 누락을 각각 `401`, `403`, `500` 경계로 구분한다.

## DB migration과 RLS

- 새 migration 파일은 현재 Supabase CLI의 `migration new`로 생성하고 파일명을 임의로 만들지 않는다.
- 노출 schema의 새 table에는 RLS를 활성화하고 필요한 role에만 명시적으로 grant한다.
- 사용자 소유 table의 policy는 `to authenticated`와 `(select auth.uid()) = user_id` 소유권 조건을 함께 둔다.
- insert에는 `with check`, update에는 `using`과 `with check`, delete에는 `using`을 둔다. update가 필요한 table은 select policy도 확인한다.
- `user_id`, foreign key, 정렬·조회 조건처럼 RLS와 주요 query에 쓰이는 column의 index를 함께 검토한다.
- view는 `security_invoker` 사용을 우선하고, `security definer` function은 권한 문제를 우회하기 위해 추가하지 않는다.
- schema 변경 전에 local·remote migration 상태와 실제 대상 환경을 확인하고, 작성 후 SQL·RLS·index를 함께 리뷰한다.

## Edge Function과 외부 API

- `OPTIONS` preflight와 허용할 HTTP method를 명시하고 모든 응답 경로에 CORS header를 유지한다.
- 요청 body를 검증하고 외부 API 응답은 `unknown`으로 받아 필요한 값을 명시적으로 파싱한다.
- Edge Function 응답은 상태 코드와 앱이 사용할 데이터 계약을 안정적으로 유지하고 외부 API 원본 형식을 UI에 전파하지 않는다.
- Edge Function을 추가하거나 변경할 때 `supabase/config.toml`, 호출 wrapper, runtime secret을 함께 확인한다.

## 환경과 검증

- dev·production은 환경 변수와 migration 이력으로 구분하고 현재 연결 대상을 추측하지 않는다.
- Supabase CLI 명령과 설정은 실행 전에 현재 버전의 `--help`와 공식 문서를 확인한다.
- `src/api`, `src/lib`, Edge Function TypeScript 변경 후에는 `npm run lint`를 실행한다.
- 환경 변수, Auth route, Edge Function 연동, production 동작에 영향이 있으면 `npm run build:webpack`을 실행한다.
- migration은 적용 전 대상 상태와 dry run을 확인하고, 적용 후 정책·제약·인덱스를 실제 query로 검증한다.
- Edge Function은 최소한 preflight, 미인증, 비허용 계정, 허용 계정, 잘못된 body, 외부 API 실패 경계를 확인한다.
- 현재 프로젝트에는 통합 테스트 스크립트가 없으므로 실행하지 못한 정책·런타임 검증은 명시적으로 보고한다.
