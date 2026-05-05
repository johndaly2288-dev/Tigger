import { chromium } from 'playwright';
export class ScraperService {
    async scrapeReddit(productName) {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        const searchUrl = `https://www.google.com/search?q=site:reddit.com+${encodeURIComponent(productName)}+review+OR+issue`;
        await page.goto(searchUrl);
        // Wait for search results
        await page.waitForSelector('div#search');
        // Get reddit links
        const redditLinks = await page.$$eval('a', (anchors) => anchors
            .map(a => a.href)
            .filter(href => href.includes('reddit.com/r/') && href.includes('/comments/'))
            .slice(0, 5) // Top 5 threads
        );
        const reviews = [];
        for (const link of redditLinks) {
            try {
                await page.goto(link);
                // Wait for comments to load
                await page.waitForSelector('shreddit-comment', { timeout: 10000 }).catch(() => { });
                const comments = await page.$$eval('shreddit-comment', (elements) => {
                    return elements.map(el => {
                        const contentEl = el.querySelector('div[slot="comment"]');
                        return contentEl ? contentEl.textContent?.trim() : null;
                    }).filter(c => c && c.length > 50); // Only substantial comments
                });
                comments.forEach(c => {
                    if (c) {
                        reviews.push({
                            source_url: link,
                            content: c
                        });
                    }
                });
            }
            catch (err) {
                console.error(`Error scraping ${link}:`, err);
            }
        }
        await browser.close();
        return reviews;
    }
}
