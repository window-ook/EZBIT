'use server';

import { ITopic } from '@/types/trends/topics';
import { fetchWithHeaders, makeAbsoluteUrl } from '@/lib/cheerio';
import * as cheerio from 'cheerio';

export async function getTopicArticles(): Promise<ITopic[]> {
    try {
        console.log('📰 토픽 뉴스 크롤링 시작');

        const html = await fetchWithHeaders('https://www.tokenpost.kr/');
        const $ = cheerio.load(html);

        const articles: ITopic[] = [];

        $('div.main_news_category .category_item').each((index: number, element) => {
            try {
                const $element = $(element);

                // 이미지 URL 추출
                const imageElement = $element.find('.category_item_image a img');
                let imageUrl: string | null = null;

                if (imageElement.length > 0) {
                    const src = imageElement.attr('src');
                    if (src) {
                        imageUrl = makeAbsoluteUrl(src, 'https://www.tokenpost.kr');
                    }
                }

                // 제목과 URL 추출
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

        const result = articles.slice(0, 12);

        console.log(`✅ 토큰포스트 아티클 크롤링 완료: ${result.length}개`);

        return result;
    } catch (error) {
        console.error('❌ 토큰포스트 아티클 크롤링 실패:', error);
        throw new Error('토큰포스트 아티클을 불러올 수 없습니다.');
    }
}