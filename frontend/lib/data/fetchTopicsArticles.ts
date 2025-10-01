import { fetchWithCheerio, makeAbsoluteUrl } from '@/lib/api/fetchWithCheerio';
import { ITopicArticles } from '@/types/trends/topicArticles';
import * as cheerio from 'cheerio';

/** 토픽 뉴스 조회
 * @returns {Promise<ITopicArticles[]>} 토픽 뉴스
 */
export async function fetchTopicsArticles(): Promise<ITopicArticles[]> {
    try {
        const html = await fetchWithCheerio('https://www.tokenpost.kr/');
        const $ = cheerio.load(html);
        const articles: ITopicArticles[] = [];

        $('div.main_news_category .category_item').each((index: number, element) => {
            try {
                const $element = $(element);
                const imageElement = $element.find('.category_item_image a img');
                let imageUrl: string | null = null;

                if (imageElement.length > 0) {
                    const src = imageElement.attr('src');
                    if (src) imageUrl = makeAbsoluteUrl(src, 'https://www.tokenpost.kr');
                }

                const textElement = $element.find('.category_item_text a');
                const title = textElement.text().trim();
                const href = textElement.attr('href');

                if (title && href) {
                    const fullUrl = makeAbsoluteUrl(href, 'https://www.tokenpost.kr');
                    articles.push({
                        title,
                        url: fullUrl,
                        imageUrl: imageUrl || '',
                        timestamp: new Date().toISOString(),
                    });
                }
            } catch (itemError) {
                console.error('아티클 아이템 처리 중 오류:', itemError);
            }
        });

        console.log(`✅ 토픽 뉴스: ${articles.length}개`);
        return articles.slice(0, 12);
    } catch (error) {
        console.error('❌ 토픽 뉴스 데이터 조회 실패:', error);
        return [];
    }
}