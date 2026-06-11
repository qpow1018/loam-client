# Game-Specific Header Design

## Goal

로스트아크와 메이플스토리 영역에 서로 다른 헤더를 제공하면서 공통 마크업과 스타일은 재사용한다. 공용 설정 페이지에서는 사용자가 진입한 게임의 헤더를 새로고침과 URL 공유 후에도 유지한다.

## Component Structure

`Header`는 게임을 판단하지 않는 공용 UI 컴포넌트로 유지한다. 로고, 메뉴 링크, 디바이더와 배경색 variant를 입력받아 렌더링한다.

게임별 메뉴 구성은 별도 컴포넌트가 담당한다.

- `LostarkHeader`: 로스트아크 메뉴와 mint 배경을 구성해 `Header`를 사용한다.
- `MaplestoryHeader`: 메이플스토리 메뉴와 rose 배경을 구성해 `Header`를 사용한다.

각 게임 라우트는 게임 값을 직접 다루지 않고 자신의 전용 헤더만 렌더링한다. 게임별 컴포넌트는 공용 헤더와 같은 `src/components/common/header/` 아래에 둔다.

## Navigation

로스트아크 헤더 메뉴 순서는 다음과 같다.

1. 할일: `/lostark/loado`
2. 메인캐릭터: `/lostark/my-characters`
3. 전체캐릭터: `/lostark/all-characters`
4. 참고 사이트: `/lostark/reference-sites`
5. 디바이더
6. 메이플 홈: `/maplestory/mapledo`
7. 설정: `/settings?game=lostark`

메이플스토리 헤더는 향후 추가되는 전용 라우트 메뉴를 먼저 표시한다. 현재 구현 범위에서는 메이플 홈을 전용 메뉴로 사용한다.

1. 메이플 홈: `/maplestory/mapledo`
2. 디바이더
3. 로아 홈: `/lostark/loado`
4. 설정: `/settings?game=maplestory`

아직 존재하지 않는 `/maplestory/mapledo` 라우트 구현은 이번 헤더 작업의 범위에 포함하지 않는다.

## Visual Distinction

공통 로고 문구 `LoaM`은 유지한다. 로스트아크 헤더는 기존 mint 계열 배경을 사용하고 메이플스토리 헤더는 기존 rose 계열 변수를 사용한다. hover 색상도 각 배경 계열에 맞춘다.

게임 전환 메뉴 앞에는 세로 디바이더를 표시해 현재 게임의 기능 메뉴와 다른 게임으로 이동하는 메뉴를 구분한다. 설정은 게임 전환 메뉴 뒤에 배치하지만 현재 게임 컨텍스트가 포함된 URL로 이동한다.

## Settings Context

설정 콘텐츠와 라우트는 기존 `/settings` 하나를 유지한다. 게임 컨텍스트는 `game` 쿼리 파라미터로 전달한다.

- `/settings?game=lostark`: `LostarkHeader` 표시
- `/settings?game=maplestory`: `MaplestoryHeader` 표시
- `game` 누락 또는 지원하지 않는 값: `LostarkHeader` 표시

쿼리 파라미터를 사용하므로 별도의 localStorage 상태 없이 새로고침과 공유 URL에서 같은 헤더가 유지된다. 설정 페이지는 서버 컴포넌트인 `page.tsx`에서 `searchParams`를 해석하고, 선택한 게임 정보를 `SettingsClient`에 전달한다.

## Scope And Verification

변경 대상은 공용 헤더, 게임별 헤더 컴포넌트, 기존 로스트아크 헤더 사용처와 설정 페이지다. 메이플스토리 기능 페이지 생성이나 설정 콘텐츠 분리는 포함하지 않는다.

검증 기준은 다음과 같다.

- 모든 기존 로스트아크 페이지에 mint `LostarkHeader`가 표시된다.
- 로스트아크 헤더 메뉴 순서와 링크가 설계와 일치한다.
- 메이플스토리 헤더는 rose 배경과 게임 전환 디바이더를 제공한다.
- 두 설정 URL이 각각 올바른 게임 헤더를 표시한다.
- `/settings`와 잘못된 `game` 값은 로스트아크 헤더로 대체된다.
- `npm run lint`가 통과한다.
- 헤더와 설정 페이지를 브라우저에서 데스크톱 크기로 확인한다.
