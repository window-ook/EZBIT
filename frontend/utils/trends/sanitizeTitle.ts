/** 기사, 영상 제목에서 특수문자 제거
 * @param title - 제목
 * @returns 특수문자 제거된 제목
 */
export const sanitizeTitle = (title: string): string => {
    if (typeof title !== 'string') return '';
    return title
        .replace(/<\/?b>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .trim();
};