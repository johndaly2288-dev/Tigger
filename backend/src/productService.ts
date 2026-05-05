import { ScraperService } from './scraper.js';
import { AnalyzerService } from './analyzer.js';
import { query } from './db.js';

const scraper = new ScraperService();
const analyzer = new AnalyzerService();

export class ProductService {
  async getProductData(productName: string) {
    // 1. Check Cache
    const existingProduct = await query('SELECT * FROM products WHERE name = $1', [productName]);
    
    if (existingProduct.rows.length > 0) {
      const product = existingProduct.rows[0];
      const lastUpdated = new Date(product.last_updated);
      const now = new Date();
      const diffHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      
      // If data is less than 24 hours old, return it
      if (diffHours < 24) {
        const redFlags = await query('SELECT * FROM red_flags WHERE product_id = $1', [product.id]);
        return {
          ...product,
          red_flags: redFlags.rows
        };
      }
    }

    // 2. Scrape
    console.log(`Scraping reviews for ${productName}...`);
    const reviews = await scraper.scrapeReddit(productName);
    
    if (reviews.length === 0) {
      throw new Error('No reviews found for this product');
    }

    // 3. Analyze
    console.log(`Analyzing reviews for ${productName}...`);
    const analysis = await analyzer.analyzeReviews(productName, reviews);

    // 4. Store in DB
    let productId: string;
    if (existingProduct.rows.length > 0) {
      productId = existingProduct.rows[0].id;
      await query(
        'UPDATE products SET overall_real_score = $1, hype_score = $2, reality_score = $3, last_updated = NOW() WHERE id = $4',
        [analysis.reality_score, analysis.hype_score, analysis.reality_score, productId]
      );
      // Clear old red flags
      await query('DELETE FROM red_flags WHERE product_id = $1', [productId]);
      await query('DELETE FROM cached_reviews WHERE product_id = $1', [productId]);
    } else {
      const insertResult = await query(
        'INSERT INTO products (name, overall_real_score, hype_score, reality_score) VALUES ($1, $2, $3, $4) RETURNING id',
        [productName, analysis.reality_score, analysis.hype_score, analysis.reality_score]
      );
      productId = insertResult.rows[0].id;
    }

    // Store red flags
    for (const flag of analysis.red_flags) {
      await query(
        'INSERT INTO red_flags (product_id, issue_summary, severity) VALUES ($1, $2, $3)',
        [productId, flag.issue, flag.severity]
      );
    }

    // Store a few review snippets
    for (const review of reviews.slice(0, 10)) {
      await query(
        'INSERT INTO cached_reviews (product_id, source_url, content_snippet) VALUES ($1, $2, $3)',
        [productId, review.source_url, review.content.slice(0, 500)]
      );
    }

    const redFlags = await query('SELECT * FROM red_flags WHERE product_id = $1', [productId]);
    
    return {
      id: productId,
      name: productName,
      overall_real_score: analysis.reality_score,
      hype_score: analysis.hype_score,
      reality_score: analysis.reality_score,
      red_flags: redFlags.rows
    };
  }
}
