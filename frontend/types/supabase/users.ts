/** 
 * Supabase 유저 정보
 * @property {string} user_id - 유저 ID
 * @property {number} total_invested - 총 투자 금액
 * @property {number} holding_krw - 보유 원화
 * @property {string | null} nickname - 사용자 닉네임
 * @property {string} created_at - 유저 생성 시간
 * @property {string} updated_at - 유저 수정 시간
*/
export interface ISupabaseUser {
    user_id: string,
    total_invested: number,
    holding_krw: number,
    nickname: string | null,
    created_at: string,
    updated_at: string
}