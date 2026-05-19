# Project: Loam-client (로스트아크, 메이플스토리 게임 유틸 프로젝트)

## Critical Rules (절대 규칙)

- 현재는 없음

## Architecture (프로젝트 구조)

api/
app/
assets/
components/
define/
utils/
types/

## Tech Stack (기술 스택)

- Next.js 16
- React 19
- TypeScript
- SCSS Modules

<!-- ## Domain Context (도메인 컨텍스트) -->

## Coding Convention (코딩 컨벤션)

### scss 파일

- `*.module.scss` 형태로 작성
- 컴포넌트 이름과 동일한 이름을 사용 -> camelCase 사용, 파일의 첫문자는 소문자
- css nesting 적용
- 실제 사용처에선 styles라는 이름으로 import
- 실제 사용처에선 styles[''] 형태로 사용
- `src/assets/_variables.scss`, `src/assets/_mixins.scss` 를 확인하고 필요한 전역 변수나 믹스인이 있다면 사용

<!-- ## Key Patterns (핵심 패턴) -->

## Next.js 설정 참고사항

- `next.config.mjs` 의 `reactStrictMode: false` 는 의도적인 설정입니다 — 일부 레거시 컴포넌트가 이펙트의 1회 실행에 의존하므로, 사용자 확인 없이 켜지 말 것.
- `src/app/layout.tsx` 의 metadata 가 `"Create Next App"` 플레이스홀더로 되어 있습니다 — 배포 요청이 있을 때 업데이트하고, 그 외에는 우연히 변경하지 말 것.
