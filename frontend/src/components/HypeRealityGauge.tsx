'use client';

import React from 'react';

interface HypeRealityGaugeProps {
  hypeScore: number;
  realityScore: number;
}

export default function HypeRealityGauge({ hypeScore, realityScore }: HypeRealityGaugeProps) {
  const delta = hypeScore - realityScore;
  const isMarketingFluff = delta > 20;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Hype vs. Reality</h3>
      
      <div className="flex flex-col space-y-8">
        {/* Hype Bar */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">General Hype (Amazon/Ads)</span>
            <span className="text-sm font-black text-blue-600">{hypeScore}%</span>
          </div>
          <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              style={{ width: `${hypeScore}%` }}
            />
          </div>
        </div>

        {/* Reality Bar */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Community Reality (Forums)</span>
            <span className="text-sm font-black text-emerald-600">{realityScore}%</span>
          </div>
          <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              style={{ width: `${realityScore}%` }}
            />
          </div>
        </div>

        {isMarketingFluff && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <p className="text-xs text-amber-800 font-medium">
              ⚠️ Marketing Fluff Warning: High discrepancy between marketing hype and actual user feedback.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="text-center">
          <div className="text-4xl font-black text-gray-900">{realityScore}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-Score</div>
        </div>
      </div>
    </div>
  );
}
