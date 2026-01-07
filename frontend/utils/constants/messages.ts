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

// ==================================================================
// 서버 액션 에러 메세지 
// ==================================================================
export const AUTH_ERROR = {
    LOGIN_REQUIRED: '로그인이 필요합니다.',
} as const;

export const VALIDATION_ERROR = {
    NICKNAME_REQUIRED: '닉네임은 필수입니다.',
    NICKNAME_TOO_LONG: '닉네임은 20자 이하로 입력해주세요.',
    EXCHANGE_RATE_DATA_REQUIRED: '환율 데이터가 없습니다.',
    SEARCH_DATE_REQUIRED: '조회 날짜가 필요합니다.',
    USD_RATE_INVALID: 'USD 환율이 유효하지 않습니다.',
    JPY_RATE_INVALID: 'JPY 환율이 유효하지 않습니다.',
    CNH_RATE_INVALID: 'CNH 환율이 유효하지 않습니다.',
    EUR_RATE_INVALID: 'EUR 환율이 유효하지 않습니다.',
    ORDER_MARKET_REQUIRED: '주문 종목이 필요합니다.',
    ORDER_AMOUNT_INVALID: '주문 수량이 유효하지 않습니다.',
    ORDER_PRICE_INVALID: '주문 가격이 유효하지 않습니다.',
    ORDER_TOTAL_INVALID: '주문 총액이 유효하지 않습니다.',
    ORDER_ORIGINAL_BID_PRICE_INVALID: '원래 매수 금액이 유효하지 않습니다.',
    ORDER_LIST_EMPTY: '주문 목록이 비어있습니다.',
    ORDER_INVALID: (market: string) => `유효하지 않은 주문이 포함되어 있습니다: ${market}`,
} as const;

export const DB_ERROR = {
    USER_ASSET_RESET_FAIL: '유저 자산 초기화 실패',
    USER_HOLDINGS_RESET_FAIL: '보유 종목 초기화 실패',
    USER_HISTORY_RESET_FAIL: '거래 내역 초기화 실패',
    USER_INFO_FETCH_FAIL: '유저 정보 조회에 실패했습니다.',
    USER_INFO_UPDATE_FAIL: '유저 정보 업데이트에 실패했습니다.',
    HISTORY_SAVE_FAIL: '거래 내역 저장에 실패했습니다.',
    HOLDINGS_FETCH_FAIL: '보유 종목 조회에 실패했습니다.',
    HOLDINGS_UPDATE_FAIL: '보유 종목 업데이트에 실패했습니다.',
    HOLDINGS_INSERT_FAIL: '보유 종목 추가에 실패했습니다.',
    HOLDINGS_DELETE_FAIL: '보유 종목 삭제에 실패했습니다.',
    HISTORY_SAVE_FAIL_WITH_MARKET: (market: string) => `${market}: 거래 내역 저장 실패`,
    HOLDINGS_FETCH_FAIL_WITH_MARKET: (market: string) => `${market}: 보유 종목 조회 실패`,
    HOLDINGS_UPDATE_FAIL_WITH_MARKET: (market: string) => `${market}: 보유 종목 업데이트 실패`,
    HOLDINGS_INSERT_FAIL_WITH_MARKET: (market: string) => `${market}: 보유 종목 추가 실패`,
} as const;

export const LOGIC_ERROR = {
    USER_NOT_FOUND: '유저 정보가 존재하지 않습니다.',
    HOLDINGS_NOT_FOUND: '보유 종목이 존재하지 않습니다.',
    ASK_AMOUNT_EXCEED: '매도 수량이 보유 수량을 초과합니다.',
    KRW_INSUFFICIENT: '보유 KRW가 부족합니다.',
} as const;