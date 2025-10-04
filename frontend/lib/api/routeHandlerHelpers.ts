import { NextRequest, NextResponse } from 'next/server';

/**
 * API 에러 응답
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
 * API 성공 응답
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
 * 쿼리 파라미터 추출
 * @param request - Next.js Request 객체
 * @param paramName - 파라미터 이름
 * @param required - 필수 여부 (기본값: false)
 * @returns 파라미터 값 또는 null
 */
export function getQueryParam(request: NextRequest, paramName: string, required: boolean = false): string | null {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get(paramName);

  if (required && !value) throw new Error(`'${paramName}' 파라미터가 필요합니다.`);

  return value;
}