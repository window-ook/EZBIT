import { ITopCoins } from '@/types/upbit/topCoins';
import * as puppeteer from 'puppeteer';

/**
 * 주간 상승률 TOP 10 코인 조회
 * @returns {Promise<ITopCoins[]>} 주간 상승률 TOP 코인 목록
 */
export async function fetchWeeklyTopRisedCoins(): Promise<ITopCoins[]> {
    const TRENDS_URL = 'https://upbit.com/trends';
    let browser: puppeteer.Browser | null = null;

    try {
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
            const listElement = document.querySelector('ul.LineArticle__List');

            if (!listElement) return results;

            const fullText = listElement.textContent || '';
            const pattern = /(\d+)([^(]+)\(([^)]+)\)\+(\d+\.?\d*)%/g;

            let match;

            while ((match = pattern.exec(fullText)) !== null) {
                const rank = parseInt(match[1], 10);
                const name = match[2].trim();
                const code = match[3].trim();
                const rate = parseFloat(match[4]);

                results.push({ rank, name, code, rate });

                if (results.length >= 10) break;
            }

            return results;
        });

        console.log(`✅ 주간 상승률 TOP ${data.length}`);
        return data;

    } catch (error) {
        console.error('❌ 주간 상승률 조회 에러:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}