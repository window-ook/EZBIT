// 유저 확인용
export const ALERT_MESSAGE = {
    INITIALIZE_USER_DATA_FAIL: '계정 초기화에 실패했습니다',
    INITIALIZE_USER_DATA_SUCCESS: '계정이 초기화되었습니다',
    NO_BIDABLE_MARKETS: '매수 가능한 종목이 없습니다',
    SUBMIT_SIGNUP_SUCCESS: '회원가입에 성공했습니다',
    VERIFY_CODE_FAIL: '인증에 실패했습니다',
    SUBMIT_RESET_PASSWORD_FAIL_SAME_PASSWORD: '새로운 비밀번호는 기존 비밀번호와 달라야합니다',
    SUBMIT_RESET_PASSWORD_FAIL_LESS_THAN_EIGHT: '비밀번호는 8자 이상이어야 합니다',
    SUBMIT_RESET_PASSWORD_FAIL: '비밀번호 재설정 완료를 실패했습니다',
    REQUEST_RESET_PASSWORD_FAIL_TOO_MANY_REQUESTS: '재요청은 이전 요청 60초 후 다시 가능합니다',
    REQUEST_RESET_PASSWORD_FAIL: '비밀번호 재설정 요청에 실패했습니다',
    REQUEST_RESET_PASSWORD_SUCCESS: '비밀번호 재설정 링크가 이메일로 전송되었습니다',
    SUBMIT_PORTFOLIO_BID_FAIL: '일부 종목 매수에 실패했습니다',
    SUBMIT_PORTFOLIO_BID_SUCCESS: '포트폴리오 파일럿 매수를 성공했습니다'
} as const;

// 개발자 확인용 콘솔
export const CONSOLE_LOG = {
    HIGHCHARTS_INDICATOR_SUCCESS: '인디케이터를 불러오는 데에 성공했습니다',
    SOCKET_IO_CONNECTION_SUCCESS: 'Socket.IO 연결에 성공했습니다',
    SOCKET_IO_CONNECTION_STATUS: 'Socket.IO 연결 상태:',
    SOCKET_IO_DISCONNECTION_SUCCESS: 'Socket.IO 연결을 해제했습니다:',
    SOCKET_IO_DISCONENCTION_REASON: 'Socket.IO 연결 해제 이유:',
    SOCKET_IO_RECONNECTION_SUCCESS: 'Socket.IO 재연결에 성공했습니다',
    SOCKET_IO_RECONNECTION_SUCCESS_TRY_COUNTS: 'Socket.IO 재연결 시도 횟수(성공):',
    SOCKET_IO_RECONNECTION_IN_PROGRESS: 'Socket.IO 재연결 시도 중',
    SOCKET_IO_RECONNECTION_IN_PROGRESS_TRY_COUNTS: 'Socket.IO 재연결 시도 횟수(시도 중)',
} as const;

export const CONSOLE_WARN = {
    HIGHCHARTS_INDICATOR_FAIL: '인디케이터를 불러오는 데에 실패했습니다',
    NEED_TO_CHECK_SOCKET_SERVER: '⚠️ 웹소켓 서버(port:4000)가 실행 중인지 확인하세요',
    SUBSCRIPTION_FAIL: '⚠️ 소켓이 연결되지 않아 구독 요청에 실패했습니다',
    UNSUBSCRIPTION_FAIL: '⚠️ 소켓이 연결되지 않아 구독 해제 요청에 실패했습니다'
} as const;

export const CONSOLE_ERROR = {
    INITIALIZE_NEW_USER_DATA_FAIL: '유저 정보 생성에 실패했습니다',
    EXCHANGE_PAGE_LOAD_FAIL: '거래소 페이지에 문제가 발생했습니다',
    CHECK_RESET_PASSWORD_SESSION_FAIL: '비밀번호 재설정 중 세션 확보에 실패했습니다',
    SUBMIT_RESET_PASSWORD_FAIL: '비밀번호 재설정 완료를 실패했습니다',
    REQUEST_RESET_PASSWORD_FAIL: '비밀번호 재설정 요청에 실패했습니다',
    SUBMIT_NICKNAME_FAIL: '닉네임 변경에 실패했습니다',
    SIGNIN_FAIL: '로그인에 실패했습니다',
    SIGNUP_FAIL: '회원가입 완료를 실패했습니다',
    REQUEST_SIGNUP_FAIL: '회원가입 요청에 실패했습니다',
    SOCKET_IO_CONNECTION_FAIL: 'Socket.IO 연결에 실패했습니다',
    SOCKET_IO_RECONNECTION_FAIL: 'Socket.IO 재연결에 실패했습니다',
    SUBMIT_PORTFOLIO_BID_FAIL: '포트폴리오 파일럿 매수에 실패했습니다',
    UPBIT_MARKETS: '업비트 전체 마켓 코드 다운로드에 실패했습니다',
    UPBIT_TICKER: '업비트 현재가 데이터 다운로드에 실패했습니다',
    UPBIT_CANDLE_MINUTES: '업비트 분봉 데이터 다운로드에 실패했습니다',
    UPBIT_CANDLE_DAYS: '업비트 일봉 데이터 다운로드에 실패했습니다',
    UPBIT_CANDLE_WEEKS: '업비트 주봉 데이터 다운로드에 실패했습니다',
    UPBIT_CANDLE_MONTHS: '업비트 월봉 데이터 다운로드에 실패했습니다',
    SCRAP_SITUATION_ARTICLES_FAIL: '시황 html 셀렉터 찾기에 실패했습니다',
    TRY_SCRAP_SITUATION_ARTICLES_FAIL: '시황 스크래핑이 실패했습니다',
    SCRAP_TOPIC_ARTICLES_FAIL: '토픽 html 셀렉터 찾기에 실패했습니다',
    TRY_SCRAP_TOPIC_ARTICLES_FAIL: '토픽 스크래핑이 실패했습니다',
    TICKER_PROVIDER_INITIAL_ORDERBOOK_FAIL: '초기 오더북 다운로드에 실패했습니다',
    TICKER_PROVIDER_INITIAL_TRADE_HISTORY_FAIL: '초기 체결 내역 다운로드에 실패했습니다',
    TICKER_PROVIDER_INITIAL_DATA_FAIL: '초기 오더북, 체결 내역 모두 다운로드에 실패했습니다',
    HOOK_CANDLE_FAIL: 'useCandles 캔들 데이터 다운로드에 실패했습니다',
    HOOK_TICKER_FAIL: 'useInitialTickers 현재가 데이터 다운로드에 실패했습니다',
    HOOK_MARKETS_FAIL: 'useMarkets 전체 마켓 코드 다운로드에 실패했습니다',
    ROUTE_CANDLES: '캔들 데이터 다운로드에 실패했습니다',
    ROUTE_EXCHANGE_RATE: '환율 데이터 다운로드에 실패했습니다',
    ROUTE_MARKETS: '마켓 코드 다운로드에 실패했습니다',
    ROUTE_ORDERBOOK: '오더북 데이터 다운로드에 실패했습니다',
    ROUTE_TICKER: '티커 데이터 다운로드에 실패했습니다',
    ROUTE_TRADE_HISTORY: '체결 내역 데이터 다운로드에 실패했습니다',
    API_CLIENT_BASE_URL_UNDEFINED: 'NEXT_PUBLIC_BASE_URL 환경변수가 확인되지 않습니다',
    EXCHANGE_RATE_NO_SEARCHDATE: '환율 데이터 다운로드를 위한 선택 날짜가 없습니다',
    EXCHANGE_RATE_NO_AUTH_KEY: '환율 데이터 다운로드를 위한 AUTH KEY가 없습니다',
    EXCHANGE_RATE_FAIL: '환율 데이터 다운로드에 실패했습니다',
    EXCHANGE_RATE_TYPE: '환율 데이터 타입이 배열이 아닙니다'
} as const;