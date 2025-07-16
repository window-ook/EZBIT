import { ICrawlTopCoins } from '@/types/upbit/top';
import * as puppeteer from 'puppeteer';

class UpbitCrawler {
    private static instance: UpbitCrawler;
    private cachedData: ICrawlTopCoins[] = [];
    private lastFetchTime = 0;
    private isRunning = false;
    private intervalId?: ReturnType<typeof setInterval>;

    private constructor() {
        this.startPeriodicCrawling();
    }

    static getInstance(): UpbitCrawler {
        if (!UpbitCrawler.instance) {
            UpbitCrawler.instance = new UpbitCrawler();
        }
        return UpbitCrawler.instance;
    }

    /**
     * 주기적 크롤링 시작 (5분마다)
     */
    private startPeriodicCrawling() {
        console.log('🔄 백그라운드 크롤링 시작');

        // 즉시 한 번 실행
        this.crawlData();

        // 5분마다 실행
        this.intervalId = setInterval(() => {
            this.crawlData();
        }, 5 * 60 * 1000);
    }

    /**
     * 크롤링 중지
     */
    public stopCrawling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    /**
     * 캐시된 데이터 반환
     */
    public getCachedData(): ICrawlTopCoins[] {
        return this.cachedData;
    }

    /**
     * 데이터 신선도 확인
     */
    public isDataFresh(): boolean {
        const now = Date.now();
        const maxAge = 10 * 60 * 1000; // 10분
        return (now - this.lastFetchTime) < maxAge;
    }

    /**
     * 실제 크롤링 로직
     */
    private async crawlData() {
        if (this.isRunning) {
            console.log('⏳ 크롤링이 이미 진행 중입니다');
            return;
        }

        this.isRunning = true;
        console.log('🚀 백그라운드 크롤링 시작');

        try {
            const data = await this.performCrawling();

            if (data.length > 0) {
                this.cachedData = data;
                this.lastFetchTime = Date.now();
                console.log(`✅ 크롤링 완료: ${data.length}개 항목`);
            } else {
                console.log('⚠️ 크롤링 결과가 비어있습니다');
            }

        } catch (error) {
            console.error('❌ 백그라운드 크롤링 에러:', error);
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Puppeteer 크롤링 수행
     */
    private async performCrawling(): Promise<ICrawlTopCoins[]> {
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
                const results: ICrawlTopCoins[] = [];
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

            return data;

        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

export default UpbitCrawler;