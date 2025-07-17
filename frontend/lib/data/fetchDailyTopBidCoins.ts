import { ITopCoins } from '@/types/upbit/topCoins';
import * as puppeteer from 'puppeteer';

/**
 * 일 매수 체결강도 TOP 5 조회
 * @returns {Promise<ITopCoins[]>} 일 매수 체결강도 TOP 목록
 */
export async function fetchDailyTopBidCoins(): Promise<ITopCoins[]> {
    const TRENDS_URL = 'https://upbit.com/trends';
    let browser: puppeteer.Browser | null = null;

    try {
        console.log('🚀 일 매수 체결강도 API 호출');

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(TRENDS_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 10000
        });

        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.waitForSelector('ul.LineArticle__List', { timeout: 8000 });

        const data = await page.evaluate(() => {
            const results: ITopCoins[] = [];

            // 모든 LineArticle__List 요소 찾기
            const listElements = document.querySelectorAll('ul.LineArticle__List');

            // 두 번째 리스트가 일 매수 체결강도
            const dailyBidList = listElements[1];

            if (!dailyBidList) {
                console.log('일 매수 체결강도 리스트를 찾을 수 없습니다');
                return results;
            }

            const fullText = dailyBidList.textContent || '';
            const pattern = /(\d+)([^(]+)\(([^)]+)\)(\d+\.?\d*)%/g;

            let match;
            while ((match = pattern.exec(fullText)) !== null) {
                const rank = parseInt(match[1], 10);
                const name = match[2].trim();
                const code = match[3].trim();
                const rate = parseFloat(match[4]);

                results.push({ rank, name, code, rate });

                if (results.length >= 5) break;
            }

            return results;
        });

        console.log(`✅ 일 매수 체결강도 조회 완료: ${data.length}개 항목`);
        return data;

    } catch (error) {
        console.error('❌ 일 매수 체결강도 조회 에러:', error);
        throw error; // 에러를 상위로 전파
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}