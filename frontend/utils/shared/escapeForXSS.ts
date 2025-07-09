/** 특수문자 치환 헬퍼 함수
 * @description XSS 공격 방지를 위한 인풋 필드 필터링 역할
 * @param {string} text 텍스트
 * @returns {string} 치환된 텍스트
 */
export const escapeForXSS = (text: string) => {
    return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
        .replaceAll("\\(", "& #40;").replaceAll("\\)", "& #41;")
        .replaceAll("'", "& #39;")
        .replaceAll("eval\\((.*)\\)", "")
        .replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"")
        .replaceAll("script", "");
};