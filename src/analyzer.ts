import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { Review } from './scraper.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AnalysisResult {
  reality_score: number; // 0-100
  hype_score: number; // 0-100 (estimated from marketing vibe)
  red_flags: {
    issue: string;
    severity: 'low' | 'medium' | 'high';
    frequency_hint: string;
  }[];
  summary: string;
}

export class AnalyzerService {
  async analyzeReviews(productName: string, reviews: Review[]): Promise<AnalysisResult> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const reviewText = reviews.map(r => r.content).join('\n---\n').slice(0, 30000); // Limit context

    const prompt = `
      Analyze the following user reviews from Reddit and forums for the product: "${productName}".
      
      Your goal is to provide an honest "RealTalk" assessment.
      1. Calculate a "Reality Score" (0-100) based on actual user satisfaction and longevity reported.
      2. Estimate a "Hype Score" (0-100) based on how much the reviews suggest the product is marketed vs its actual performance.
      3. Identify "Red Flags" - recurring complaints or serious failures.
      4. Summarize the general consensus.

      Reviews:
      ${reviewText}

      Output the result in strict JSON format with the following structure:
      {
        "reality_score": number,
        "hype_score": number,
        "red_flags": [
          { "issue": "string", "severity": "low|medium|high", "frequency_hint": "string" }
        ],
        "summary": "string"
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response (sometimes Gemini wraps it in ```json)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse LLM response as JSON');
    } catch (err) {
      console.error('LLM Analysis failed:', err);
      return {
        reality_score: 50,
        hype_score: 50,
        red_flags: [],
        summary: 'Failed to analyze reviews.'
      };
    }
  }
}
