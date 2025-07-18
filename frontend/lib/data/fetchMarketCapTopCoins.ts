import { ITopCoins } from '@/types/upbit/topCoins';
import * as puppeteer from 'puppeteer';

/**
 * 시가총액 TOP 5 조회
 * @returns {Promise<ITopCoins[]>} 시가총액 TOP 5 목록
 */
export async function fetchMarketCapTopCoins(): Promise<ITopCoins[]> {
    const DATALAB_URL = 'https://datalab.upbit.com/indexes?code=IDX.UPBIT.UPBIT10';

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

        await page.goto(DATALAB_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 10000
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        await page.waitForSelector('table', { timeout: 8000 });

        const data = await page.evaluate(() => {
            const results: ITopCoins[] = [];
            const table = document.querySelector('table');

            if (!table) return results;

            const rows = table.querySelectorAll('tbody tr');

            rows.forEach((row, index) => {
                const cells = row.querySelectorAll('td');

                if (cells.length >= 4) {
                    const rank = index + 1;
                    const firstCellText = cells[0]?.textContent?.trim() || '';

                    // "비트코인BTC/KRW" 형태에서 한글명과 마켓코드 분리
                    const match = firstCellText.match(/^(.+?)([A-Z]+\/[A-Z]+)$/);
                    const name = match ? match[1] : '';
                    const code = match ? match[2] : '';

                    const rateText = cells[3]?.textContent?.trim() || '0%';
                    const rate = parseFloat(rateText.replace('%', '')) || 0;

                    console.log(`${rank}. ${firstCellText} -> name: ${name}, code: ${code}, rate: ${rate}`);

                    if (name && code) {
                        results.push({ rank, name, code, rate });
                    }
                }
            });
            return results;
        });

        console.log(`✅ 시가총액 TOP 5 조회 결과: ${data.length}개 데이터`);
        return data;
    } catch (error) {
        console.error('❌ 시가총액 TOP 5 조회 에러:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}