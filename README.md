# LoaM

로스트아크 플레이에 필요한 정보를 관리하기 위해 개인적으로 개발하고 사용하는 웹 애플리케이션입니다.

PC 데스크톱 브라우저를 지원합니다. 모바일 전용 화면은 제공하지 않습니다.

## 주요 기능

- 로스트아크 할 일·메모 관리
- 원정대 캐릭터 관리 및 메인 캐릭터 상세 정보 조회·저장
- 레이드 클리어 골드 확인
- 재련 비용 계산
- 메이플스토리 캐릭터·유니온·장비 상태 관리

## Tech Stack

- Next.js, React, TypeScript
- Sass
- TanStack Query
- Supabase Auth, Database, Edge Functions

로스트아크 캐릭터 정보 조회는 Supabase Edge Functions를 통해 Lost Ark API를 호출합니다.

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 참고해 프로젝트 루트에 `.env.local`을 만들고 아래 값을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
AUTH_ALLOWED_EMAILS=
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 프로덕션 빌드 및 실행

```bash
npm run build:webpack
npm run start
```

## 데이터 저장과 백업

- Loado·Mapledo의 할 일과 메모는 브라우저의 `localStorage`에 저장됩니다.
- 로스트아크·메이플스토리 캐릭터 관련 데이터는 로그인한 사용자의 Supabase Database 데이터로 관리됩니다.
- 설정 화면에서 브라우저 저장 데이터를 JSON 파일로 백업·복원할 수 있습니다.
- 로그인한 상태에서는 같은 저장 데이터를 Supabase에 클라우드 백업하고 복원할 수 있습니다.

## PWA

지원 브라우저에서는 설정 화면에서 앱을 설치할 수 있습니다. 서비스 워커는 프로덕션 환경에서만 등록되며, 매니페스트와 앱 아이콘 등 기본 정적 리소스를 캐시합니다.

PWA 설치 기능은 데스크톱 브라우저 사용을 위한 기능이며 모바일 지원을 의미하지 않습니다.
