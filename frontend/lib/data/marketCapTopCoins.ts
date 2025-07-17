import { ITopCoins } from '@/types/upbit/topCoins';
import * as puppeteer from 'puppeteer';

/**
 * 시가총액 TOP 10 조회
 * @returns {Promise<ITopCoins[]>} 시가총액 TOP 10 목록
 */
export async function fetchMarketCapTopCoins(): Promise<ITopCoins[]> {
    const DATALAB_URL = 'https://datalab.upbit.com/indexes?code=IDX.UPBIT.UPBIT10';
    let browser: puppeteer.Browser | null = null;

    try {
        console.log('🚀 시가총액 TOP 10 API 호출');

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

        // 첫 번째 페이지 데이터 수집
        const firstPageData = await page.evaluate(() => {
            const results: ITopCoins[] = [];
            const table = document.querySelector('table');

            if (!table) {
                console.log('테이블을 찾을 수 없습니다');
                return results;
            }

            const rows = table.querySelectorAll('tbody tr');

            rows.forEach((row, index) => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 4) {
                    const rank = index + 1;
                    const name = cells[1]?.textContent?.trim() || '';
                    const code = cells[2]?.textContent?.trim() || '';
                    const rateText = cells[3]?.textContent?.trim() || '0%';
                    const rate = parseFloat(rateText.replace('%', '')) || 0;

                    if (name && code) {
                        results.push({ rank, name, code, rate });
                    }
                }
            });

            return results;
        });

        // 두 번째 페이지로 이동
        await page.waitForSelector('nav', { timeout: 5000 });

        const secondPageButton = await page.$('nav button:nth-child(2)');
        if (secondPageButton) {
            await secondPageButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await page.waitForSelector('table', { timeout: 8000 });

            // 두 번째 페이지 데이터 수집
            const secondPageData = await page.evaluate(() => {
                const results: ITopCoins[] = [];
                const table = document.querySelector('table');

                if (!table) {
                    console.log('두 번째 페이지 테이블을 찾을 수 없습니다');
                    return results;
                }

                const rows = table.querySelectorAll('tbody tr');

                rows.forEach((row, index) => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 4) {
                        const rank = index + 6; // 6부터 시작 (두 번째 페이지)
                        const name = cells[1]?.textContent?.trim() || '';
                        const code = cells[2]?.textContent?.trim() || '';
                        const rateText = cells[3]?.textContent?.trim() || '0%';
                        const rate = parseFloat(rateText.replace('%', '')) || 0;

                        if (name && code) {
                            results.push({ rank, name, code, rate });
                        }
                    }
                });

                return results;
            });

            // 두 페이지 데이터 합치기
            const allData = [...firstPageData, ...secondPageData];
            console.log(`✅ 시가총액 TOP 10 크롤링 완료: ${allData.length}개 항목`);
            return allData;
        } else {
            console.log('두 번째 페이지 버튼을 찾을 수 없어 첫 번째 페이지 데이터만 반환');
            return firstPageData;
        }

    } catch (error) {
        console.error('❌ 시가총액 TOP 10 크롤링 에러:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}