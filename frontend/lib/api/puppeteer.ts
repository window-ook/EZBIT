'use server';

import puppeteer, { Browser, Page } from 'puppeteer';

class PuppeteerService {
    private browser: Browser | null = null;

    async getBrowser(): Promise<Browser> {
        if (!this.browser || !this.browser.isConnected()) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-extensions',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                    '--no-first-run',
                    '--no-default-browser-check',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                ],
                timeout: 30000,
            });

            console.log('🤖 Puppeteer 브라우저 인스턴스 생성');
        }
        return this.browser;
    }

    // 최적화된 페이지 생성
    async createOptimizedPage(): Promise<Page> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        // 뷰포트 설정
        await page.setViewport({ width: 1366, height: 768 });

        // User Agent 설정
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // 불필요한 리소스 차단으로 속도 향상
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const blockedResourceTypes = ['image', 'media', 'font', 'stylesheet'];
            const skipUrls = [
                'googleapis',
                'gstatic',
                'analytics',
                'facebook',
                'twitter',
                'google-analytics',
                'googletagmanager',
                'youtube',
                'instagram',
                'ads',
                'doubleclick'
            ];

            const url = request.url();
            const resourceType = request.resourceType();

            if (
                blockedResourceTypes.includes(resourceType) ||
                skipUrls.some(skipUrl => url.includes(skipUrl))
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });

        return page;
    }

    // 브라우저 정리
    async cleanup(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            console.log('🗑️ Puppeteer 브라우저 정리 완료');
        }
    }
}

const puppeteerService = new PuppeteerService();
export default puppeteerService;