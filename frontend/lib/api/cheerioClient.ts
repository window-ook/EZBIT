/** 헤더 설정 후 조회 함수
 * @param {string} url 조회할 URL
 * @returns {Promise<string>} 조회 결과
 */
export async function fetchWithCheerio(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            cache: 'force-cache',
            next: { revalidate: 1800 },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.text();
    } catch (error) {
        console.error(`조회 실패: ${url}`, error);
        throw new Error(`조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
}

/** 절대 경로 생성 함수
 * @param {string} url 상대 경로
 * @param {string} baseUrl 기본 경로
 * @returns {string} 절대 경로
 */
export function makeAbsoluteUrl(url: string, baseUrl: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}