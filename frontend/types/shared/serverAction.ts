/** 
 * 서버 액션 공통 반환 인터페이스
 * @description 모든 서버 액션이 일관된 반환 타입을 보장함  
*/
export interface IServerActionResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}