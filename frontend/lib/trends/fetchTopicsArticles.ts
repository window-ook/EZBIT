import { CONSOLE_ERROR } from '@/utils/constants/messages';
import { cheerioClient, makeAbsoluteUrl } from '@/lib/api/cheerioClient';
import { ITopicArticles } from '@/types/trends/topicArticles';
import * as cheerio from 'cheerio';
import { EXTERNAL_PATHS } from '../api/apiPaths';

/** 
 * 토픽 뉴스 페칭 함수
 * @returns {Promise<ITopicArticles[]>}
 */
export async function fetchTopicsArticles(): Promise<ITopicArticles[]> {
    try {
        const html = await cheerioClient(EXTERNAL_PATHS.TOKEN_POST, { next: { revalidate: 1800 } });
        const $ = cheerio.load(html);
        const articles: ITopicArticles[] = [];

        $('div.main_news_category .category_item').each((index: number, element) => {
            try {
                const $element = $(element);
                const imageElement = $element.find('.category_item_image a img');
                let imageUrl: string | null = null;

                if (imageElement.length > 0) {
                    const src = imageElement.attr('src');
                    if (src) imageUrl = makeAbsoluteUrl(src, EXTERNAL_PATHS.TOKEN_POST);
                }

                const textElement = $element.find('.category_item_text a');
                const title = textElement.text().trim();
                const href = textElement.attr('href');

                if (title && href) {
                    const fullUrl = makeAbsoluteUrl(href, EXTERNAL_PATHS.TOKEN_POST);
                    articles.push({
                        title,
                        url: fullUrl,
                        imageUrl: imageUrl || '',
                        timestamp: new Date().toISOString(),
                    });
                }
            } catch (itemError) {
                console.error(CONSOLE_ERROR.SCRAP_TOPIC_ARTICLES_FAIL, itemError);
            }
        });

        return articles.slice(0, 12);
    } catch (error) {
        console.error(CONSOLE_ERROR.TRY_SCRAP_TOPIC_ARTICLES_FAIL, error);
        return [];
    }
}