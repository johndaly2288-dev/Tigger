'use client';

import React, { useState } from 'react';
import ProductSearch from '@/components/ProductSearch';
import HypeRealityGauge from '@/components/HypeRealityGauge';
import RedFlagList from '@/components/RedFlagList';
import SentimentChart from '@/components/SentimentChart';
import ReviewSnippets from '@/components/ReviewSnippets';
import { ShieldCheck, Zap, BarChart3, AlertTriangle } from 'lucide-react';

// Mock Data
const MOCK_PRODUCT = {
  name: "SonicPro X1000 Wireless Headphones",
  category: "Audio",
  hypeScore: 92,
  realityScore: 68,
  redFlags: [
    { issue_summary: "Hinge durability issues after 4-6 months", severity: "high", frequency_count: 42 },
    { issue_summary: "Software app requires excessive permissions", severity: "medium", frequency_count: 28 },
    { issue_summary: "Multi-point Bluetooth connection drops", severity: "medium", frequency_count: 15 },
    { issue_summary: "Earpads flake earlier than expected", severity: "low", frequency_count: 12 },
    { issue_summary: "Latency issues in high-interference areas", severity: "low", frequency_count: 8 },
    { issue_summary: "Battery life 20% lower than advertised", severity: "medium", frequency_count: 22 },
  ],
  sentimentData: [
    { source: "r/headphones", sentiment: 62 },
    { source: "Head-Fi", sentiment: 58 },
    { source: "r/gadgets", sentiment: 75 },
    { source: "Amazon Reviews", sentiment: 94 },
    { source: "Tech-Forums", sentiment: 71 },
  ],
  reviews: [
    {
      source: "r/headphones",
      sentiment: 45,
      snippet: "Sounds great initially, but the build quality is a joke for $400. My left hinge snapped just like everyone else on this sub.",
      url: "https://reddit.com/r/headphones"
    },
    {
      source: "Head-Fi",
      sentiment: 55,
      snippet: "DSP is heavily colored. Great for casual listening, but 'SonicPro' is a marketing misnomer. Audiophiles should look elsewhere.",
      url: "https://head-fi.org"
    }
  ]
};

export default function Home() {
  const [showResults, setShowResults] = useState(true); // Defaulting to true for demo purposes

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
          <ProductSearch />
        </section>

        {showResults && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Product Title Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-gray-900 pb-4 mb-8">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1 block">Analysis Report</span>
                <h1 className="text-3xl font-black text-gray-900">{MOCK_PRODUCT.name}</h1>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated</span>
                  <span className="text-xs font-bold">2 hours ago</span>
                </div>
                <button className="bg-gray-900 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Top Row: Gauge and Red Flags */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <HypeRealityGauge 
                  hypeScore={MOCK_PRODUCT.hypeScore} 
                  realityScore={MOCK_PRODUCT.realityScore} 
                />
              </div>
              <div className="lg:col-span-8">
                <RedFlagList flags={MOCK_PRODUCT.redFlags as any} />
              </div>
            </div>

            {/* Middle Row: Sentiment Chart and Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <SentimentChart data={MOCK_PRODUCT.sentimentData} />
              </div>
              <div className="lg:col-span-5">
                <div className="bg-blue-600 p-6 rounded-xl text-white h-full relative overflow-hidden">
                  <Zap className="absolute -right-8 -top-8 h-48 w-48 text-blue-500 opacity-50 rotate-12" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 relative z-10">RealTalk Verdict</h3>
                  <p className="text-xl font-medium leading-relaxed mb-6 relative z-10">
                    "High performance marred by documented build quality failures. Amazon ratings are heavily skewed by initial impressions, while long-term users on Reddit report consistent mechanical issues."
                  </p>
                  <div className="flex items-center space-x-2 relative z-10">
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      Proceed with Caution
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Review Snippets */}
            <div className="mt-6">
              <ReviewSnippets reviews={MOCK_PRODUCT.reviews} />
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
