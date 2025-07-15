'use server';

import { fetchWithHeaders, makeAbsoluteUrl } from '@/lib/cheerio';
import { ISituation } from '@/types/trends/situation';
import * as cheerio from 'cheerio';

export async function getSituationArticles(): Promise<ISituation[]> {
    try {
        console.log('📰 시황 크롤링 시작');

        const html = await fetchWithHeaders('https://www.tokenpost.kr/news/market');
        const $ = cheerio.load(html);

        const situations: ISituation[] = [];

        $('div.list_left_item .list_left_item_article').each((index, element) => {
            try {
                const $element = $(element);

                // 이미지 URL 추출
                const imageElement = $element.find('.list_item_image a img');
                let imageUrl: string | null = null;

                if (imageElement.length > 0) {
                    const src = imageElement.attr('src');
                    if (src) {
                        imageUrl = makeAbsoluteUrl(src, 'https://www.tokenpost.kr');
                    }
                }

                // 제목과 URL 추출
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
                console.error('마켓 상황 아이템 처리 중 오류:', itemError);
            }
        });

        console.log(`✅ 마켓 상황 크롤링 완료: ${situations.length}개`);

        return situations;
    } catch (error) {
        console.error('❌ 마켓 상황 크롤링 실패:', error);
        throw new Error('마켓 상황 데이터를 불러올 수 없습니다.');
    }
}