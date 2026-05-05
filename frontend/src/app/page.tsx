'use client';

import React, { useState, useEffect } from 'react';
import ProductSearch from '@/components/ProductSearch';
import HypeRealityGauge from '@/components/HypeRealityGauge';
import RedFlagList from '@/components/RedFlagList';
import SentimentChart from '@/components/SentimentChart';
import ReviewSnippets from '@/components/ReviewSnippets';
import { ShieldCheck, Zap, AlertCircle, Loader2 } from 'lucide-react';

interface RedFlag {
  id: string;
  issue_summary: string;
  severity: 'low' | 'medium' | 'high';
  frequency_count: number;
}

interface Review {
  id: string;
  source_url: string;
  content_snippet: string;
  sentiment_score?: number;
}

interface ProductData {
  id: string;
  name: string;
  hype_score: number;
  reality_score: number;
  red_flags: RedFlag[];
  reviews: Review[];
  summary?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const response = await fetch(`http://localhost:3001/api/product?name=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product data');
      }
      const data = await response.json();
      setProductData(data);
      setShowResults(true);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to map reviews to SentimentChart format
  const getSentimentData = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return [];
    
    // Group by domain for visualization
    const domainMap: Record<string, { total: number, count: number }> = {};
    
    reviews.forEach(r => {
      try {
        const domain = new URL(r.source_url).hostname.replace('www.', '');
        const sentiment = r.sentiment_score || 50; // Fallback to neutral
        if (!domainMap[domain]) {
          domainMap[domain] = { total: 0, count: 0 };
        }
        domainMap[domain].total += sentiment;
        domainMap[domain].count += 1;
      } catch (e) {
        // Ignore invalid URLs
      }
    });

    return Object.entries(domainMap).map(([source, stats]) => ({
      source,
      sentiment: Math.round(stats.total / stats.count)
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-blue-600">RealTalk</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest transition-colors">How it works</a>
            <a href="#" className="text-sm font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest transition-colors">Sources</a>
            <a href="#" className="text-sm font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest transition-colors">Extension</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Hero / Search Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Stop buying the <span className="text-blue-600">Hype.</span>
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            RealTalk uses AI to cross-reference marketing claims against thousands of real user discussions on Reddit and specialized forums.
          </p>
          <ProductSearch onSearch={handleSearch} />
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 mt-8 py-12 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">Scraping Communities...</p>
                <p className="text-sm text-gray-500">Our AI is analyzing Reddit threads and forum discussions. This may take a minute.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-4 max-w-2xl mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-bold text-red-900 uppercase tracking-widest">Analysis Failed</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </section>

        {showResults && productData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Product Title Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-gray-900 pb-4 mb-8">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1 block">Analysis Report</span>
                <h1 className="text-3xl font-black text-gray-900">{productData.name}</h1>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live Analysis Complete</span>
                </div>
                <button 
                  onClick={() => handleSearch(query)}
                  className="bg-gray-900 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Top Row: Gauge and Red Flags */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <HypeRealityGauge 
                  hypeScore={productData.hype_score} 
                  realityScore={productData.reality_score} 
                />
              </div>
              <div className="lg:col-span-8">
                <RedFlagList flags={productData.red_flags.map(f => ({
                  issue_summary: f.issue_summary,
                  severity: f.severity,
                  frequency_count: f.frequency_count
                }))} />
              </div>
            </div>

            {/* Middle Row: Sentiment Chart and Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <SentimentChart data={getSentimentData(productData.reviews)} />
              </div>
              <div className="lg:col-span-5">
                <div className="bg-blue-600 p-6 rounded-xl text-white h-full relative overflow-hidden">
                  <Zap className="absolute -right-8 -top-8 h-48 w-48 text-blue-500 opacity-50 rotate-12" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 relative z-10">RealTalk Verdict</h3>
                  <p className="text-xl font-medium leading-relaxed mb-6 relative z-10">
                    {productData.summary || "No summary available for this product."}
                  </p>
                  <div className="flex items-center space-x-2 relative z-10">
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      {productData.reality_score > 70 ? 'Community Recommended' : productData.reality_score > 40 ? 'Proceed with Caution' : 'Not Recommended'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Review Snippets */}
            <div className="mt-6">
              <ReviewSnippets reviews={productData.reviews.map(r => {
                let source = "Unknown";
                try {
                  source = new URL(r.source_url).hostname.replace('www.', '');
                } catch(e) {}
                
                return {
                  source: source,
                  sentiment: r.sentiment_score || 50,
                  snippet: r.content_snippet,
                  url: r.source_url
                };
              })} />
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-24 border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 opacity-50">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-bold tracking-tighter">REALTALK ANALYTICS ENGINE V1.0</span>
          </div>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
            Data aggregated from independent communities. No affiliate links. No sponsored content.
          </p>
        </div>
      </footer>
    </div>
  );
}
