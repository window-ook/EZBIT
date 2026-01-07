import { CONSOLE_ERROR } from '@/utils/constants/messages';
import { cheerioClient, makeAbsoluteUrl } from '@/lib/api/cheerioClient';
import { ISituationArticles } from '@/types/trends/situationArticles';
import * as cheerio from 'cheerio';
import { EXTERNAL_PATHS } from '../api/apiPaths';

/** 
 * 시황 뉴스 조회
 * @returns {Promise<ISituationArticles[]>} 시황
 */
export async function fetchSituationArticles(): Promise<ISituationArticles[]> {
    try {
        const html = await cheerioClient(EXTERNAL_PATHS.TOKEN_POST_SITUATION_ARTICLES, { next: { revalidate: 1800 } });
        const $ = cheerio.load(html);
        const situations: ISituationArticles[] = [];

        $('div.list_left_item .list_left_item_article').each((index, element) => {
            try {
                const $element = $(element);
                const imageElement = $element.find('.list_item_image a img');
                let imageUrl: string | null = null;

                if (imageElement.length > 0) {
                    const src = imageElement.attr('src');
                    if (src) imageUrl = makeAbsoluteUrl(src, EXTERNAL_PATHS.TOKEN_POST);
                }

                const textElement = $element.find('.list_item_title a');
                const title = textElement.text().trim();
                const href = textElement.attr('href');

                if (title && href) {
                    const fullUrl = makeAbsoluteUrl(href, EXTERNAL_PATHS.TOKEN_POST);
                    situations.push({
                        title,
                        url: fullUrl,
                        imageUrl: imageUrl || '',
                        timestamp: new Date().toISOString(),
                    });
                }
            } catch (itemError) {
                console.error(CONSOLE_ERROR.SCRAP_SITUATION_ARTICLES_FAIL, itemError);
            }
        });

        return situations;
    } catch (error) {
        console.error(CONSOLE_ERROR.TRY_SCRAP_SITUATION_ARTICLES_FAIL, error);
        return [];
    }
}   