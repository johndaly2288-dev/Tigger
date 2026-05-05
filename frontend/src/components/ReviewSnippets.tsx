'use client';

import React from 'react';
import { ExternalLink, Quote } from 'lucide-react';

interface Review {
  source: string;
  sentiment: number;
  snippet: string;
  url?: string;
}

interface ReviewSnippetsProps {
  reviews: Review[];
}

export default function ReviewSnippets({ reviews }: ReviewSnippetsProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Source Transparency</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review, index) => (
          <div key={index} className="flex flex-col p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded shadow-sm">
                {review.source}
              </span>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${
                  review.sentiment > 70 ? 'bg-emerald-500' : review.sentiment > 40 ? 'bg-blue-500' : 'bg-red-500'
                }`} />
                <span className="text-[10px] font-bold text-gray-500 uppercase">{review.sentiment}% Sentiment</span>
              </div>
            </div>
            
            <div className="relative flex-1">
              <Quote size={16} className="absolute -top-1 -left-1 text-gray-200" />
              <p className="text-sm text-gray-600 italic pl-5 pr-2 mb-4 leading-relaxed">
                {review.snippet}
              </p>
            </div>
            
            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-end">
              <a 
                href={review.url || "#"} 
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center uppercase tracking-widest transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Original Thread
                <ExternalLink size={10} className="ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
