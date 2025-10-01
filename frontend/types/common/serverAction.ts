/** Server Action 공통 반환 타입 */
export interface IServerActionResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}
