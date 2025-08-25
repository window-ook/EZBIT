# EZBIT

<img src='https://res.cloudinary.com/dbvzbdffi/image/upload/v1754110400/ezbit_qejgr5.avif' width='500' height='300' />

### 가장 쉽고 스마트한 암호화폐 모의투자 플랫폼

**Light & Freely & Easy**라는 컨셉을 가진 EZBIT입니다.<br>
누구나 가볍게 이용하는 모의투자를 경험하세요! 가입하면 30,000,000원의 시드머니를 가지고 시작할 수 있습니다.<br>
투자 타이밍 잡기 연습, 파일럿이 만들어주는 포트폴리오 경험 등 다양한 투자를 시도해보면서 당신의 '투자 지능'을 올려보세요😊

## 📋 목차

- [🗓️ 개발 기간](#-개발-기간)
- [👤 체험 계정](#-체험-계정)
- [🎧 앱 다운로드 및 실행](#-앱-다운로드-및-실행)
- [🛠 기술 스택](#-기술-스택)
- [✨ 주요 기능](#-주요-기능)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🏗️ 시스템 설계](#️-시스템-설계)
- [🤺 스킬 포커스](#-스킬-포커스)
- [🤖 컨텍스트 엔지니어링](#-컨텍스트-엔지니어링)
- [⚡ 성능 최적화](#-성능-최적화)
- [📈 회고](#-회고)

## 🗓️ 개발 기간

### 2025.07.01 ~ 2025.07.25

지속적으로 코드 및 UI 개선 예정

## 👤 체험 계정

### Email, PW

- test123@example.com
- 123567as#

### 접속 링크

https://www.ezbit.vercel.app

## 🎧 앱 다운로드 및 실행

```
# git clone
git clone https://github.com/window-ook/EZBIT.git

# 프론트엔드
cd frontend
pnpm install
pnpm dev

# 백엔드
cd backend
npm install
npm run dev
```

## 🛠 기술 스택

### Front-End

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"> 
    <img src="https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=React&logoColor=black">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=tsx&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/React Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
    <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=flat-square&logo=react-hook-form&logoColor=white">
    <img src="https://img.shields.io/badge/zod-3E67B1?style=flat-square&logo=zod&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=TailwindCSS&logoColor=white">
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcn/ui&logoColor=white">
    <img src="https://img.shields.io/badge/Highcharts-A4EDBA?style=flat-square&logo=highcharts&logoColor=black">
    <img src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/PlayWright-1D8D22?style=flat-square&logo=playwright&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=red">
</div>

### BFF

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white"> 
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white">
    <img src="https://img.shields.io/badge/Resend-000000?style=flat-square&logo=resend&logoColor=white"> 
</div>

### 외부 데이터

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Upbit API-0062DF?style=flat-square&logo=upbit&logoColor=white"> 
    <img src="https://img.shields.io/badge/Youtube Data API-FF0000?style=flat-square&logo=youtube&logoColor=white"> 
    <img src="https://img.shields.io/badge/Exchange Rate API-FF0000?style=flat-square&logo=&logoColor=black"> 
    <img src="https://img.shields.io/badge/Cheerio(Token Post)-E88C1F?style=flat-square&logo=cheerio&logoColor=black">
</div>

### CI/CD

<div style='display:flex; align-items:center'>
  <img src="https://img.shields.io/badge/Git Actions-2088FF?style=flat-square&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"> 
  <img src="https://img.shields.io/badge/Railway-000000?style=flat-square&logo=railway&logoColor=white"> 
</div>

## ✨ 주요 기능

### 🔥 실시간 거래소

<img width="600" height="440" src="https://github.com/user-attachments/assets/888a63cf-b896-4632-bd8b-f2dd282b8f1e" />

**업비트 WebSocket**으로 실시간 현재가, 호가, 체결 내역 데이터를 제공합니다.<br>
**Highcharts**의 캔들스틱 차트로 다양한 분봉 차트를 제공합니다.<br>
사용자는 시장가로만 즉시 매수와 매도 주문할 수 있습니다.

### 🚀 포트폴리오 파일럿

<img width="500" height="470" src="https://github.com/user-attachments/assets/11315f8f-72b5-4823-994a-913490c7f8a8" />

세팅된 옵션 중 선택해서, 자신이 보유한 원화 이내에 원하는 금액만큼 포트폴리오를 만들어드립니다.<br>
각 옵션은 총 5개의 코인으로 20%씩 비중을 갖습니다.

- **라이징 스타**: 실시간 TOP 5
- **베스트 셀러**: 24시간 거래대금이 가장 높은 코인 TOP 5
- **자이언트**: 시가총액 TOP 5

### 📰 트렌드 뉴스 제공

<img width="500" height="470" src="https://github.com/user-attachments/assets/c01fc093-20e3-46a9-89be-d8369c662c42" />

달러, 엔, 위안, 유로 환율 정보와 TOKEN POST의 시황, 글로벌 토픽 기사를 제공합니다.<br>
그리고 유튜브에서 핫한 비트코인 관련 영상을 클릭하면 유튜브로 이동하여 시청할 수 있습니다.

### 💰 보유 자산 대시보드

<img width="600" height="380" src="https://github.com/user-attachments/assets/c65ed403-b77d-42bf-a3bb-6b42687da660" />

현재가 기준 실시간 평가손익, 수익률, 도넛 차트 기반 보기 쉬운 매수 비중 정보를 제공합니다.<br>
그리고 종목별 상세 정보를 테이블에서 확인할 수 있습니다.

## 📁 프로젝트 구조

### 아키텍처 다이어그램

<img width="600" height="370" src="https://github.com/user-attachments/assets/4c4b532a-1350-4041-9173-d15e77b7504a" />

### 왜 이렇게 설계했는지?

**실시간 데이터 업데이트를 위한 BFF 구축**<br>
암호화폐 모의투자 서비스 제공을 위해서는 실시간 정보 업데이트가 핵심입니다.<br>
예전 프로젝트에서 Polling 방식을 사용하여 3초 주기로 REST API를 호출하는 방법을 썼습니다.<br>
하지만 그것은 0.1초의 타이밍으로 수익이 판가름되는 투자 서비스에는 적절하지 않습니다.<br>
따라서 Express.js로 웹소켓 데이터를 수신받기 위한 BFF(Backend For Frontend)를 구축했습니다.<br><br>

**가벼운 클라이언트 상태 관리**<br>
EZBIT은 React Query로 데이터 페칭과 동시에 캐싱하여 서버 상태로 동기화하는 것이 메인입니다.<br>
또한, 클라이언트에서 UI를 위해 따로 관리해야 할 전역 상태가 거의 없습니다.<br>
따라서 Context API만으로 AuthProvider, TickerProvider를 구현하고<br>
우산 패턴을 적용하여 적절한 범위를 제한하여 클라이언트 상태를 관리하고 있습니다.<br><br>

### 컴포넌트 구조: Feature Based

```
backend/
├── server.js            # Express.js + Socket.IO 서버
└── ...

🖥️ frontend
├── actions/              # Server Actions (Next.js 15)
│
├── components/
│   ├── exchange          # 거래소
│   ├── my-assets         # 보유 자산
│   ├── shadcn-ui         # shadcn/ui 컴포넌트
│   └── ...
│
├── hooks                 # 커스텀 훅
│   ├── socket            # WebSocket 통신
│   ├── supabase          # Supabase CRUD 서버 액션 사용, 인증 관련
│   ├── trends            # 트렌드 페이지 데이터
│   └── upbit             # Upbit REST API 조회 서버 액션 사용
│
└── ...
```

백엔드와 프론트엔드는 독립적인 멀티레포로 격리했습니다. 상호 의존성이 없고, 백엔드는 가벼운 BFF이기 때문이죠.<br>
프론트엔드의 디렉토리는 모두 역할 기반으로 분류되어 있습니다.<br>
이 방식은 컴포넌트나 훅, 함수, 타입 등 어떤 파일이든지 위치가 직관적이기 때문에<br>
안정성과 확장성 면에서 매우 유리하고, EZBIT 규모의 서비스에 적합한 구조라고 생각했습니다.<br>

## 🏗️ 시스템 설계

### Supabase 스키마(PostgreSQL)

```sql
-- 사용자 정보
users {
  user_id: UUID PRIMARY KEY
  holding_krw: NUMERIC DEFAULT 30000000
  total_invested: NUMERIC DEFAULT 0
  nickname: STRING
}

-- 보유 종목
holdings {
  user_id: UUID FOREIGN KEY
  market: STRING
  total_bid_volume: NUMERIC
  total_bid_amount: NUMERIC
  avg_bid_price: NUMERIC
}

-- 거래 내역
history {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY
  market: STRING
  order_type: BID | ASK
  volume: NUMERIC
  trade_price: NUMERIC
  total_amount: NUMERIC
}
```

총 3개의 테이블로 구성했습니다.<br>
모든 테이블은 RLS(Row Level Security) 정책을 적용하여, 모든 CRUD에 대한 외부의 비인가 요청을 방어합니다.<br>

### 비동기 데이터 플로우

**데이터 페칭**

```
컴포넌트 → useSuspenseQuery 커스텀 훅 → 서버 액션 → Supabase
컴포넌트 → useSuspenseQuery 커스텀 훅 → 라우트 핸들러 →  External APIs
```

**업비트 REST API 직접 통신**

```
컴포넌트 → useQuery 커스텀 훅 → 서버 액션 → Upbit REST API
```

**BFF를 통한 Websocket 통신**

```
컴포넌트 → useSocket 커스텀 훅 → Express.js 백엔드 ← Upbit Websocket
```

**매수/매도 주문, 로그인, 회원가입, 비밀번호 재설정**

```
컴포넌트 → useMutation 커스텀 훅 → 서버 액션 → Supabase
```

## 🤺 스킬 포커스

### 1. Streaming SSR

**선언적 데이터 페칭과 사용자 경험 향상을 위한 렌더링**<br>

React의 `Suspense`와 `ErrorBoundary`를 조합하여 선언적 데이터 패칭을 구현함으로써,
각 컴포넌트의 로딩 상태와 에러 상태를 명시적으로 분리하여 관리하고 사용자에게 일관된 UX를 제공할 수 있도록 설계했습니다.<br>

`Suspense`는 Next.js App Router의 **Streaming SSR**과 결합되어 각 데이터 페칭 경계마다 점진적 렌더링을 가능하게 합니다.
Fast TTFB를 달성하여 사용자가 페이지의 첫 번째 콘텐츠를 빠르게 확인할 수 있도록 합니다.<br>

그리고 컴포넌트들이 점진적으로 활성화되어, 전체 페이지 로딩을 기다리지 않고도 
사용자가 준비된 콘텐츠부터 즉시 상호작용할 수 있는 성능 최적화된 사용자 경험을 제공하고,
동시에 각 기능별 독립적인 에러 격리를 통해 부분적 장애가 전체 서비스에 미치는 영향을 최소화했습니다.<br>

### 2. Prefetching Component

<img src="https://github.com/user-attachments/assets/64bfd9cf-c4fd-493a-aa89-c04b9f3160bc" width="663" height="414" />

**Hydration Error를 극복하기 위한 Progressive Hydration**<br>

클라이언트에서는 서버로부터 자바스크립트 번들을 다운로드 하면, Hydration을 시작합니다.
하지만 useSuspenseQuery는 실행되면 백그라운드에서 즉시 데이터 페칭을 하므로,
데이터 로드가 완료되면 컴포넌트는 일시 중단 상태에서 깨어나 실제 데이터가 포함된 UI로 
리렌더링됩니다. 따라서 Hydration 중에 이 과정이 발생하여 서버는 fallback UI를 보냈는데,
클라이언트는 실제 UI를 렌더링 해버려 Hydration Error가 발생합니다.
<br>

이 문제를 해결하기 위해 프리페칭 컴포넌트를 생성해서 useSuspenseQuery를 사용하는 
컴포넌트를 래핑하였습니다. 프리페칭 컴포넌트의 역할은 서버에서 데이터를 프리페치 하고, 
prefetchQuery를 사용하여 데이터를 캐싱합니다. 그리고 dehydrate가 QueryClient의 
캐시 상태를 직렬화하여 HydrationBoundary의 자식 컴포넌트에 전달하는 구조입니다.
<br>

참고: https://velog.io/@windowook/React-Query-Next.js-useSuspenseQuery-Hydration-Error
<br>

### 3. ErrorBoundary를 이용한 선언적 에러 처리

`@frontend/app/exchange/page.tsx`

```tsx
<section className="flex flex-col md:flex-row justify-center gap-2">
  {/* 오더북 테이블 */}
  <ErrorBoundaryWrapper
    featureName="오더북 테이블"
    message="오더북 테이블 로딩 중 문제가 발생했습니다."
  >
    <Suspense fallback={<LoadingSpinner size="2xl" />}>
      <OrderbookTable />
    </Suspense>
  </ErrorBoundaryWrapper>

  {/* 주문하기 폼 */}
  <ErrorBoundaryWrapper
    featureName="주문하기 폼"
    message="주문하기 폼 로딩 중 문제가 발생했습니다."
  >
    <Suspense fallback={<LoadingSpinner size="2xl" />}>
      <UserDataPrefetcher>
        <OrderForm />
      </UserDataPrefetcher>
    </Suspense>
  </ErrorBoundaryWrapper>
</section>
```

`ErrorBoundaryWrapper`는 에러가 터진 기능과, 맞춤 메세지를 나타내는 커스텀 Wrapper Component입니다.<br>
선언형 프로그래밍을 사용하여 프로젝트 전체에 일관된 에러 UI를 제공하기 위해 구현했습니다.<br>
그리고 Suspense를 사용하여 로딩 상태 처리도 선언형 프로그래밍 방식으로 구현했습니다.

### 4. zod를 활용한 유효성 검사

`@frontend/schema/**`

```tsx
/** 닉네임 변경 폼 유효성 검증 */
export const changeNickNameSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임은 1자 이상이어야 합니다.')
    .max(20, '닉네임은 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9가-힣]+$/, '특수문자는 사용할 수 없습니다.')
    .refine(
      async (data) => {
        const supabase = createBrowserSupabaseClient();
        const { data: existingNickname } = await supabase
          .from('users')
          .select('nickname')
          .eq('nickname', data)
          .single();
        return existingNickname === null;
      },
      {
        message: '이미 존재하는 닉네임입니다.',
        path: ['nickname'],
      }
    )
    .refine((data) => data.trim() !== '', {
      message: '닉네임은 비어있을 수 없습니다.',
      path: ['nickname'],
    }),
});

/** 매수 주문 유효성 검증 */
export const bidSchema = z.object({
  price: z
    .number({ invalid_type_error: '매수 가격은 숫자여야 합니다.' })
    .min(0, { message: '매수 가격은 0 이상이어야 합니다.' }),
  quantity: z
    .number({ invalid_type_error: '주문수량은 숫자여야 합니다.' })
    .min(0, { message: '주문수량은 0 이상이어야 합니다.' }),
  total: z
    .number({ invalid_type_error: '주문총액은 숫자여야 합니다.' })
    .min(5000, { message: '최소 5,000원 이상이어야 합니다.' }),
});

/** 매도 주문 유효성 검증 */
export const askSchema = z.object({
  price: z
    .number({ invalid_type_error: '매도 가격은 숫자여야 합니다.' })
    .min(0, { message: '매도 가격은 0 이상이어야 합니다.' }),
  quantity: z
    .number({ invalid_type_error: '주문수량은 숫자여야 합니다.' })
    .min(0, { message: '주문수량은 0 이상이어야 합니다.' }),
  total: z.number({ invalid_type_error: '주문총액은 숫자여야 합니다.' }),
});

...
```

zod의 메서드 체이닝으로 직관적이고 효율적인 유효성 검증 로직을 구현했습니다.<br>
React Hook Form의 useForm과 함께 조합하여 폼의 상태 관리와 유효성 검증, 에러 핸들링까지 담당합니다.<br>

### 5. 최적화된 웹소켓 데이터 페칭과 클라이언트 상태 동기화

EZBIT의 BFF로서, Express.js 기반의 Socket.IO 프록시 서버를 구현했습니다.

- **3계층 캐싱**: ticker, orderbook, trade 데이터 Map 구조 캐싱
- **스마트 구독**: 클라이언트별 선택적 마켓 구독/해제
- **자동 재연결**: 최대 5회 재시도, 고정 5초 지연
- **중복 방지**: sequential_id 기준 중복 체크
- **순서 보장**: timestamp 기반 데이터 순서 유지
- **타입별 분리**: ticker, orderbook, trade 이벤트 독립 처리
- **메모리 최적화**: 순환 버퍼로 trade 데이터 50개 제한
- **스로틀링**: 100ms 단위 업데이트 제한으로 성능 향상
- **Connection Pool**: 클라이언트 수에 따른 지능형 연결 관리
- **Graceful Shutdown**: SIGTERM/SIGINT 신호 처리로 안전한 종료

그리고 받아온 데이터를 TickerProvider 내부에서 메모이제이션을 통해 최적화된 상태로 관리합니다.

- **TickerProvider**: 코인 한국명, 선택한 코인, 모든 코인의 실시간 현재가 등 상태 공유
  - useMemo로 contextValue 최적화하여 불필요한 리렌더링 방지
  - useCallback 참조 동일성 체크로 setState 최적화
  - 마켓 선택 시 초기 오더북/체결내역 데이터 병렬 페칭

### 6. 데이터 캐싱과 서버 상태 관리

React Query로 클라이언트에서 외부 API와 Supabase DB에서 페칭하는 데이터는 캐싱하여 관리했습니다.

- 캐싱 전략: 글로벌 QueryClient로 기본 옵션 설정
- 프리페칭: prefetchQuery, dehydrate, HydrationBoundary를 통해 SSR 데이터 프리페칭
- 상태 동기화 및 낙관적 업데이트: useMutation으로 이루어지는 매수/매도 주문 즉시 UI 반영

### 7. Async Surf 패턴 일부 적용

**커스텀 페쳐**<br>
Fetch API 기반의 글로벌 클라이언트 apiClient와 TOKEN POST 추출 전용 클라이언트 fetchWithCheerio를 데이터 페칭에 사용합니다.<br>

**경로 팩토리**<br>
하드코딩을 배제하고 참조를 강제하는 의도로 외부/내부 API 경로를 중앙화하여 응집성을 높여, 가독성과 유지보수성 및 보안을 높인 팩토리입니다.<br>

**쿼리 팩토리**<br>
React Query를 사용하면서 queryKey 또한 하드코딩으로 관리하지 않고 Feature별로 중앙화하였습니다.<br>
FSD에서 추천하는 queryKey 관리 방식입니다. queryKey를 오타로 추가하거나, 파라미터를 올바르지 않게 사용하는 실수를 방지합니다.

**비동기 로직 추상화 커스텀 훅**<br>
컴포넌트에서 비동기 로직을 격리하여 추상화하는 목적으로 만들어진 커스텀 훅입니다.<br>
EZBIT에서는 클라이언트가 비동기 요청을 보내는 엔드포인트가 다양합니다.

- 웹소켓 서버, Supabase, 업비트 API, 유튜브 API, ...

**라우트 핸들러 유틸**<br>
라우트 핸들러 함수 내부에 에러 핸들링, 성공 후 처리, 쿼리 파라미터 추출, 환경변수 접근 등의 로직을<br>
직접 선언하지 않고 재사용 유틸 함수로 분리하여 중앙화했습니다.

## 🤖 컨텍스트 엔지니어링

LLM 에이전트를 개발 어시스트에 활용했습니다.<br>
Claude Code와 Gemini CLI를 사용했으며, 주 용도는 아래와 같습니다.

### Claude Code

- 컨텍스트 기반 컴포넌트 구현 및 리팩토링
- Markdown으로 만들어진 서브 에이전트, 커스텀 커맨드를 활용
- 테스트 시나리오 작성

### Gemini CLI

- 코드 패턴 적합성, 보안 수준 점검, 컴포넌트 응집도 & 결합도 평가
- Google AI Studio 리포지토리 연결(PR 생성시 코드 리뷰 및 개선 포인트 제공)

## ⚡ 성능 최적화

### React 렌더링 최적화

- **컴포넌트 메모이제이션**: React.memo
- **계산 최적화**: useMemo
- **이벤트 핸들러 최적화**: useCallback

### 폰트 로딩 최적화

- **next/font/local 사용**: Pretendard Variable + NEXON Gothic 3종 (Light/Regular/Bold)
- **Display Swap**: 폰트 로딩 중 시스템 폰트로 대체하여 FOUT 방지(시스템 폰트가 Fallback)
- **Preload**: 중요 폰트 우선 로딩으로 CLS 최소화

### 번들 최적화

- **dynamic import**: 당장 보이지 않는 컴포넌트는 `ssr: false`와 함께 레이지 로드

### 이미지 최적화

- **캐싱과 저용량 확장자**CDN 업로드, `.avif` 파일 사용

### 실시간 데이터 최적화

- **중복 업데이트 방지**: timestamp + 값 비교
- **메모리 효율적 구독**: Set 자료구조 활용

```tsx
const currentMarkets = new Set(markets.map((m) => m.market));
```

- **순환 버퍼**: Trade 데이터 최대 50개 유지 (MAX_TRADES_COUNT = 50)

### 캐싱 전략

- **TanStack Query**: API 응답 캐싱, 프리 페칭
- **WebSocket 데이터**: 백엔드 Map으로 프리캐싱

## 📑 회고

### 1. 새로운 시도 & 새롭게 알게 된 것

> **새로운 시도**

선언형 프로그래밍<br>
Streaming SSR<br>
웹소켓 BFF 구축과 클라이언트 통신 최적화<br>

> **새롭게 알게 된 것**

- useSuspenseQuery를 SSR에서 사용하려면 데이터 프리페칭 필요
  - HydrationBoundary와 dehydrate를 통한 서버-클라이언트 상태 동기화의 중요성을 체감했습니다.
- WebSocket 연결 관리의 복잡성
  - 클라이언트 수에 따른 연결 풀 관리, 중복 방지, 순서 보장, 메모리 최적화 등 실시간 통신에서 고려해야 할 요소들이 생각보다 많았습니다.
- Context API의 최적화 포인트
  - useMemo와 useCallback을 활용한 Provider 최적화가 대규모 실시간 데이터 업데이트에서 얼마나 중요한지 알게 되었습니다.
- BFF 패턴의 실용성
  - 단순히 API 프록시를 넘어서 데이터 가공, 캐싱, 연결 관리까지 담당하는 BFF의 역할이 실시간 서비스에서 필수적임을 깨달았습니다.

### 2. 앞으로 더 도전해 볼만한 것들

- Web Workers를 도입하여 복잡한 계산을 백그라운드에서 처리하여 메인 스레드 부하 감소<br>
