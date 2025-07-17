import { fetchWithCheerio, makeAbsoluteUrl } from '@/lib/api/cheerio';
import { ISituation } from '@/types/trends/situation';
import * as cheerio from 'cheerio';

/** 시황 조회
 * @returns {Promise<ISituation[]>} 시황
 */
export async function getSituationData(): Promise<ISituation[]> {
    try {
        const html = await fetchWithCheerio('https://www.tokenpost.kr/news/market');
        const $ = cheerio.load(html);
        const situations: ISituation[] = [];

        $('div.list_left_item .list_left_item_article').each((index, element) => {
            try {
                const $element = $(element);
                const imageElement = $element.find('.list_item_image a img');
                let imageUrl: string | null = null;

                if (imageElement.length > 0) {
                    const src = imageElement.attr('src');
                    if (src) imageUrl = makeAbsoluteUrl(src, 'https://www.tokenpost.kr');
                }

                const textElement = $element.find('.list_item_title a');
                const title = textElement.text().trim();
                const href = textElement.attr('href');

                if (title && href) {
                    const fullUrl = makeAbsoluteUrl(href, 'https://www.tokenpost.kr');
                    situations.push({
                        title,
                        url: fullUrl,
                        imageUrl: imageUrl || '',
                        timestamp: new Date().toISOString(),
                    });
                }
            } catch (itemError) {
                console.error('시황 아이템 처리 중 오류:', itemError);
            }
        });

        return situations;
    } catch (error) {
        console.error('❌ 시황 데이터 조회 실패:', error);
        return [];
    }
}   