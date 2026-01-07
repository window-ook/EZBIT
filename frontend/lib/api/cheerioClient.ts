/** 
 * 커스텀 Cheerio Fetch 클라이언트
 * @param {string} url 조회할 URL
 * @param {object} options Next.js fetch 옵션
 * @returns {Promise<string>} 조회 결과
 */
export async function cheerioClient(url: string, options?: { next?: { revalidate?: number } }): Promise<string> {
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
        next: options?.next || { revalidate: 1800 },
    });

    if (!response.ok) throw new Error(`Cheerio ${response.status}`);

    return await response.text();
}

/**
 * 절대 경로 생성 함수
 * @return baseUrl/url
 */
export function makeAbsoluteUrl(url: string, baseUrl: string): string {
    if (!url) return '';

    const duplicatePattern = /(https?:\/\/[^/]+)(https?:\/\/)/;
    if (duplicatePattern.test(url)) url = url.replace(duplicatePattern, '$2');

    if (url.startsWith('http')) return url;
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}