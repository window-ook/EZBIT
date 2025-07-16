import { ICrawlTopCoins } from '@/types/trends/crawlCoins';
import { NextResponse } from 'next/server';
import * as puppeteer from 'puppeteer';

/**
 * @description 업비트 트렌드 페이지의 주간 상승률 TOP 코인 데이터를 크롤링하여 반환합니다.
 * @returns {Promise<NextResponse>} 주간 상승률 TOP 코인 리스트
 */
export async function GET() {
    const TRENDS_URL = 'https://upbit.com/trends' as const;

    let browser: puppeteer.Browser | null = null;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1920,1080',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 1080 });

        // 자동화 감지 방지
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        // User-Agent 설정
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log('⏳ 페이지 로딩 시작...');

        await page.goto(TRENDS_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 10000
        });

        // 렌더링을 위한 대기
        await new Promise(resolve => setTimeout(resolve, 3000));

        // LineArticle__List 클래스가 로드될 때까지 대기
        await page.waitForSelector('ul.LineArticle__List', { timeout: 10000 });

        console.log('✅ 데이터 추출 시작...');

        const data: ICrawlTopCoins[] = await page.evaluate(() => {
            const results: ICrawlTopCoins[] = [];

            // LineArticle__List 클래스의 ul 태그 찾기
            const listElement = document.querySelector('ul.LineArticle__List');
            if (!listElement) {
                console.log('LineArticle__List 요소를 찾을 수 없습니다.');
                return results;
            }

            // 텍스트 추출
            // '1하이퍼레인(HYPER/KRW)+288.16%2펏지펭귄(PENGU/KRW)+115.93%3옵저버(OB...'
            const fullText = listElement.textContent || '';
            const pattern = /(\d+)([^(]+)\(([^)]+)\)\+(\d+\.?\d*)%/g;

            let match;

            while ((match = pattern.exec(fullText)) !== null) {
                const rank = parseInt(match[1], 10);
                const name = match[2].trim();
                const code = match[3].trim();
                const rate = parseFloat(match[4]);

                results.push({
                    rank,
                    name,
                    code,
                    rate
                });

                // 상위 10개만 수집
                if (results.length >= 10) break;
            }

            console.log('파싱 결과:', results);
            return results;
        });

        console.log('최종 크롤링 결과:', data);

        if (data.length === 0) {
            console.log('데이터가 비어있습니다. 페이지 구조를 다시 확인해보세요.');

            // 디버깅을 위한 추가 정보
            const debugInfo = await page.evaluate(() => {
                const listElement = document.querySelector('ul.LineArticle__List');
                return {
                    listExists: !!listElement,
                    listText: listElement ? listElement.textContent?.substring(0, 500) : 'N/A',
                    allUlElements: Array.from(document.querySelectorAll('ul')).length
                };
            });

            console.log('디버그 정보:', debugInfo);
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('[weekly-rised] 크롤링 에러:', error);
        return NextResponse.json({
            message: '크롤링 실패',
            error: String(error)
        }, { status: 500 });
    } finally {
        if (browser) await browser.close();
    }
}