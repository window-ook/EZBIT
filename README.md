# 📈 EZBIT

<img src='https://res.cloudinary.com/dbvzbdffi/image/upload/v1754110400/ezbit_qejgr5.avif' width='500' height='300' />

### 가장 쉽고 스마트한 암호화폐 모의투자 플랫폼

> **실시간 데이터로 배우는 안전한 투자 경험**  
> 업비트 실시간 데이터와 포트폴리오 파일럿으로 누구나 쉽게 암호화폐 투자를 학습할 수 있는 플랫폼

## 📋 목차

- [🗓️ 개발 기간](#-개발-기간)
- [🛠 기술 스택](#-기술-스택)
- [✨ 주요 기능](#-주요-기능)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🏗️ 시스템 아키텍처](#️-시스템-아키텍처)
- [🤺 기술적 도전과 해결](#-기술적-도전과-해결)
- [📊 상태 관리](#-상태-관리)
- [⚡ 성능 최적화](#-성능-최적화)
- [🔧 에러 핸들링](#-에러-핸들링)
- [🌐 실시간 통신](#-실시간-통신)
- [📈 개발 성과](#-개발-성과)

## 🗓️ 개발 기간

2025.07.01 ~ 2025.07.25

## 🛠 기술 스택

### Front-End

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"> 
    <img src="https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=React&logoColor=black">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/React Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
    <img src="https://img.shields.io/badge/Context API-61DAFB?style=flat-square&logo=React&logoColor=black">
    <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=flat-square&logo=react-hook-form&logoColor=white">
    <img src="https://img.shields.io/badge/zod-3E67B1?style=flat-square&logo=zod&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=TailwindCSS&logoColor=white">
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcn/ui&logoColor=white">
    <img src="https://img.shields.io/badge/Highcharts-A4EDBA?style=flat-square&logo=highcharts&logoColor=black">
    <img src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white">
    <img src="https://img.shields.io/badge/Motion-FFCD00?style=flat-square&logo=motion&logoColor=black">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=red">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/PlayWright-1D8D22?style=flat-square&logo=playwright&logoColor=white">
    <img src="https://img.shields.io/badge/Cheerio-E88C1F?style=flat-square&logo=cheerio&logoColor=black">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"> 
</div>

### Back-End

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Socket.io-000000?style=flat-square&logo=socket.io&logoColor=white"> 
    <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white"> 
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Railway-000000?style=flat-square&logo=railway&logoColor=white"> 
</div>

### 외부 데이터

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Upbit Open API-0062DF?style=flat-square&logo=upbit&logoColor=white"> 
    <img src="https://img.shields.io/badge/TOKENPOST-1991C5?style=flat-square&logo=upbit&logoColor=white"> 
    <img src="https://img.shields.io/badge/Youtube Data API-FF0000?style=flat-square&logo=youtube&logoColor=white"> 
</div>

### 아키텍처 다이어그램

<img width="600" height="360" src="https://github.com/user-attachments/assets/3dfa102f-35cd-4ae2-96e8-f366c2fe9bb0" />

## **✨ 주요 기능**

### 🔥 실시간 거래소

<img width="600" height="440" src="https://github.com/user-attachments/assets/888a63cf-b896-4632-bd8b-f2dd282b8f1e" />

- **업비트 WebSocket**으로 실시간 현재가, 호가, 체결 내역 데이터를 제공합니다.
- **Highcharts**의 캔들스틱 차트로 다양한 분봉 차트를 제공합니다.
- 사용자는 시장가로만 즉시 매수와 매도 주문할 수 있습니다.

### 🚀 포트폴리오 파일럿

<img width="500" height="470" src="https://github.com/user-attachments/assets/11315f8f-72b5-4823-994a-913490c7f8a8" />

세팅된 옵션 중 선택해서, 자신이 보유한 원화 이내에 원하는 금액만큼 포트폴리오를 만들어드립니다.<br>
각 옵션은 총 5개의 코인으로 20%씩 비중을 갖습니다.

- **라이징 스타**: 실시간 TOP 5
- **베스트 셀러**: 24시간 거래대금이 가장 높은 코인 TOP 5
- **자이언트**: 시가총액 TOP 5

### 📰 트렌드 정보 제공

<img width="500" height="470" src="https://github.com/user-attachments/assets/c01fc093-20e3-46a9-89be-d8369c662c42" />

달러, 엔, 위안, 유로 환율 정보와 TOKEN POST의 시황, 글로벌 토픽 기사를 제공합니다.<br>
그리고 유튜브에서 핫한 비트코인 관련 영상을 클릭하면 유튜브로 이동하여 시청할 수 있습니다.

### 💰 보유 자산 대시보드

<img width="600" height="380" alt="Image" src="https://github.com/user-attachments/assets/c65ed403-b77d-42bf-a3bb-6b42687da660" />

현재가 기준 실시간 평가손익, 수익률, 도넛 차트 기반 보기 쉬운 매수 비중 정보를 제공합니다.<br>
그리고 종목별 상세 정보를 테이블에서 확인할 수 있습니다.

## 📁 프로젝트 구조

### Feature-Based Architecture

```
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

backend/
└── server.js            # Express.js + Socket.IO 서버
```

frontend의 디렉토리는 모두 역할 기반으로 분류되어 있습니다.<br>
이 방식은 컴포넌트나 훅, 함수, 타입 등 어떤 파일이든지 어느 곳에 위치해야할지 직관적이기 때문에<br>
안정성과 확장성 면에서 매우 유리합니다. EZBIT과 같은 규모에서 매우 적절하다고 생각합니다.

## 🏗️ 시스템 아키텍처

### 🫙 데이터베이스 설계

```sql
-- 사용자 계정 (초기 자금 30,000,000 KRW)
users {
  user_id: UUID PRIMARY KEY
  holding_krw: NUMERIC DEFAULT 30000000
  total_invested: NUMERIC DEFAULT 0
  nickname: STRING
}

-- 보유 종목 (user_id + market 복합 유니크)
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
  order_type: BID | ASK모두 역할 기반 디렉토리입니다.
  volume: NUMERIC
  trade_price: NUMERIC
  total_amount: NUMERIC
}
```

### 🌊 비동기 데이터 플로우

**트렌드 페이지 컴포넌트**

```
컴포넌트 → useSuspenseQuery 커스텀 훅 → 서버 액션 → Supabase, External APIs
```

**업비트 REST API**

```
컴포넌트 → useQuery 커스텀 훅 → 서버 액션 → Upbit REST API
```

**Websocket 통신**

```
컴포넌트 → useSocket 커스텀 훅 → 서버 액션 → Express.js 백엔드 → 마켓 구독
```

**매수/매도 주문, 로그인, 회원가입, 비밀번호 재설정**

```
컴포넌트 → useMutation 커스텀 훅 → 서버 액션 → Supabase
```

## 🤺 기술적 도전과 해결

### 1. 실시간 데이터 동기화

**도전**: 업비트 WebSocket 데이터를 다중 클라이언트에 효율적으로 전달<br>

**해결**

- Express.js + Socket.IO 프록시 서버 구현
- 클라이언트 수에 따른 스마트 연결 관리
- 3계층 캐싱 (ticker, orderbook, trade)

```javascript
// 첫 번째 클라이언트 연결 시에만 업비트 WebSocket 활성화
if (connectedClients.size === 1) {
  wsManager.connect();
}
```

### 2. 서버/클라이언트 상태 관리

**도전**: 서버 상태, 실시간 상태, 클라이언트 상태의 동시 관리<br>

**해결**

- **TanStack Query**: 서버 상태 + 낙관적 업데이트
- **Context API**: 실시간 WebSocket 데이터

### 3. 낙관적 업데이트

**도전**: 매수/매도 주문 시 즉시 UI 반영 후 서버 동기화<br>

**해결** 정교한 롤백 메커니즘과 상태 무결성 보장

```typescript
onMutate: async (variables) => {
  // 1. 관련 쿼리 취소
  await queryClient.cancelQueries({ queryKey: userQuery.all() });

  // 2. 이전 데이터 백업
  const previousUser = queryClient.getQueryData(userQuery.all());

  // 3. 낙관적 업데이트
  queryClient.setQueryData(userQuery.all(), {
    ...previousUser,
    holding_krw: previousUser.holding_krw - variables.total,
  });

  return { previousUser };
};
```

### **4. 성능 최적화**

**도전**: 실시간 데이터 업데이트로 인한 불필요한 리렌더링<br>

**해결**

- React.memo + useMemo + useCallback 조합
- 불필요한 업데이트 방지 로직
- Object.assign 사용으로 spread 연산자 오버헤드 제거

```typescript
// 동일한 값 체크로 불필요한 업데이트 방지
if (prevTicker && prevTicker.trade_price === newTicker.trade_price) {
  return prev;
}
```

## 📊 상태 관리

### 서버 상태 관리 (TanStack Query v5)

- **캐싱 전략**: staleTime 10분, gcTime 30분
- **낙관적 업데이트**: 매수/매도 주문 즉시 UI 반영
- **에러 처리**: NetworkError만 재시도 (최대 3회)
- **Prefetching**: SSR 데이터 사전 로딩

### 실시간 상태 관리 (Context API + WebSocket)

```typescript
// TickerProvider: 실시간 시세 데이터 전역 관리
interface ITickerContext {
  tickers: Record<string, ITicker>;
  selectedMarket: string;
  currentTicker: ITicker;
  setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
}
```

### 인증 상태 관리 (Supabase Auth)

```typescript
// 경로별 접근 제어
const RULES = [
  { path: '/my-assets', requireAuth: true },
  { path: '/signin', blockIfAuth: true },
];
```

## ⚡ 성능 최적화

### React 렌더링 최적화

- **컴포넌트 메모이제이션**: React.memo 적용 (MarketList, MarketRow)
- **계산 최적화**: useMemo로 가격 색상, 포맷된 값 캐싱
- **이벤트 핸들러 최적화**: useCallback으로 클릭 핸들러 메모이제이션

### 번들 최적화

- **Turbopack**: Next.js 15 개발 빌드 도구
- **동적 임포트**: React Query Devtools 조건부 로딩
- **이미지 최적화**: Next.js Image 컴포넌트 + priority 설정

### 실시간 데이터 최적화

- **중복 업데이트 방지**: timestamp + 값 비교
- **메모리 효율적 구독**: Set 자료구조 활용
- **순환 버퍼**: Trade 데이터 최대 100개 유지

### 캐싱 전략

- **TanStack Query**: API 응답 캐싱 + Prefetch
- **WebSocket 데이터**: 백엔드 Map 구조 캐싱
- **브라우저 캐싱**: API Routes에 Cache-Control 헤더

## **🔧 에러 핸들링**

### **계층적 에러 처리**

```typescript
// 1. 컴포넌트 레벨: Error Boundary
<ErrorBoundaryWrapper featureName="주문하기">
    <OrderForm />
</ErrorBoundaryWrapper>

// 2. API 레벨: TanStack Query
retry: (failureCount, error) => {
    if (error?.name === 'NetworkError') return failureCount < 3;
    return false;
}

// 3. WebSocket 레벨: 자동 재연결
reconnection: true,
reconnectionAttempts: 5,
reconnectionDelay: 1000,
```

### 사용자 친화적 에러 UI

- **ErrorFallback**: 에러 상황별 맞춤 메시지
- **복구 옵션**: "다시 시도", "페이지 새로고침" 버튼
- **로딩 스켈레톤**: 데이터 로딩 중 사용자 경험 향상

### 폼 유효성 검사

```typescript
// Zod 스키마 기반 런타임 검증
export const bidSchema = z.object({
  price: z.number().min(0),
  quantity: z.number().min(0),
  total: z.number().min(5000, { message: '최소 5,000원 이상이어야 합니다.' }),
});
```

## 🌐 실시간 통신

### WebSocket 연결 최적화

- **프록시 서버**: 단일 업비트 연결로 다중 클라이언트 서비스
- **스마트 구독**: 클라이언트별 선택적 마켓 구독/해제
- **자동 재연결**: 최대 5회 재시도, 지수 백오프

### 데이터 무결성

- **중복 방지**: sequential_id + timestamp 기준 중복 체크
- **순서 보장**: timestamp 기반 데이터 순서 유지
- **타입별 분리**: ticker, orderbook, trade 이벤트 독립 처리

### 메모리 관리

```typescript
// 순환 버퍼로 메모리 효율성 확보
if (tradesBufferRef.current.length >= MAX_TRADES) {
  tradesBufferRef.current.length = 0; // splice 대신 직접 조작
}
```

## 📈 개발 성과

### 🎯 기술적 성과

1. **실시간 성능**: WebSocket 데이터 지연 시간 < 500ms
2. **UI 반응성**: 낙관적 업데이트로 즉시 피드백
3. **타입 안전성**: TypeScript strict mode + Zod 검증
4. **확장 가능성**: Feature-based 모듈화 구조

### 🚀 프로덕트 관점 개발

1. **사용자 중심 설계**: 직관적인 거래 인터페이스
2. **교육적 가치**: 실제 거래소 환경에서 안전한 투자 학습
3. **AI 기반 추천**: 3가지 투자 전략으로 다양한 접근법 제공
4. **모바일 우선**: 반응형 디자인으로 모든 디바이스 지원

### **💡 프로젝트를 통해 새롭게 알게 된 사실**

1. **실시간 데이터 처리**: WebSocket 프록시 서버의 중요성
2. **상태 관리 복잡성**: 서버/실시간/클라이언트 상태의 조화
3. **성능 최적화**: React 리렌더링 최적화의 미세한 디테일
4. **사용자 경험**: 낙관적 업데이트의 사용자 만족도 향상 효과
5. **에러 처리**: 계층적 에러 처리의 안정성 확보
