import { NextRequest, NextResponse } from 'next/server';

/**
 * 라우트 핸들러용 공통 유틸리티 함수들
 */

/**
 * API 에러 응답을 생성합니다.
 * @param message - 에러 메시지
 * @param status - HTTP 상태 코드 (기본값: 500)
 * @returns NextResponse 에러 응답
 */
export function createErrorResponse(message: string, status: number = 500): NextResponse {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * API 성공 응답을 생성합니다.
 * @param data - 응답 데이터
 * @param status - HTTP 상태 코드 (기본값: 200)
 * @returns NextResponse 성공 응답
 */
export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    { data },
    { status }
  );
}

/**
 * 쿼리 파라미터를 안전하게 추출합니다.
 * @param request - Next.js Request 객체
 * @param paramName - 파라미터 이름
 * @param required - 필수 여부 (기본값: false)
 * @returns 파라미터 값 또는 null
 */
export function getQueryParam(request: NextRequest, paramName: string, required: boolean = false): string | null {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get(paramName);
  
  if (required && !value) {
    throw new Error(`'${paramName}' 파라미터가 필요합니다.`);
  }
  
  return value;
}

/**
 * 환경 변수를 안전하게 가져옵니다.
 * @param envName - 환경 변수 이름
 * @param required - 필수 여부 (기본값: true)
 * @returns 환경 변수 값
 */
export function getEnvVar(envName: string, required: boolean = true): string {
  const value = process.env[envName];
  
  if (required && !value) {
    throw new Error(`환경 변수 '${envName}'이 설정되지 않았습니다.`);
  }
  
  return value || '';
}

/**
 * 라우트 핸들러 래퍼 - 공통 에러 처리를 제공합니다.
 * @param handler - 실제 핸들러 함수
 * @returns 래핑된 핸들러 함수
 */
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('라우트 핸들러 에러:', error);
      const message = error instanceof Error ? error.message : '서버 에러가 발생했습니다.';
      return createErrorResponse(message);
    }
  };
}