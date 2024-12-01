import React from 'react';
import { useTweetStore } from '../store/tweetStore';
import { useLoadingStore } from '../store/loadingStore';
import { Sentiment } from '../types/tweet';

const SentimentIcon = ({ type }: { type: Sentiment }) => {
  const icons: Record<Sentiment, JSX.Element> = {
    negative: (
      <svg className="sad" width="20" height="20" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <circle fill="#ef4444" cx="22" cy="22" r="22"/>
          <g transform="translate(13.000000, 20.000000)">
            <g className="face">
              <path d="M7,4 C7,5.1045695 7.8954305,6 9,6 C10.1045695,6 11,5.1045695 11,4" 
                    className="mouth" 
                    stroke="#2C0E0F" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    transform="translate(9.000000, 5.000000) rotate(-180.000000) translate(-9.000000, -5.000000)"/>
              <ellipse className="right-eye" fill="#2C0E0F" cx="16.0941176" cy="1.75609756" rx="1.90588235" ry="1.75609756"/>
              <ellipse className="left-eye" fill="#2C0E0F" cx="1.90588235" cy="1.75609756" rx="1.90588235" ry="1.75609756"/>
            </g>
          </g>
        </g>
      </svg>
    ),
    neutral: (
      <svg className="neutral" width="20" height="20" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle fill="#0ea5e9" cx="22" cy="22" r="22"/>
          <g className="face">
            <g transform="translate(13.000000, 20.000000)" fill="#2C0E0F">
              <g className="mouth">
                <g transform="translate(9, 5)">
                  <rect x="-2" y="0" width="4" height="2" rx="2"/>
                </g>
              </g>
              <ellipse className="right-eye" cx="16.0941176" cy="1.75" rx="1.90588235" ry="1.75"/>
              <ellipse className="left-eye" cx="1.90588235" cy="1.75" rx="1.90588235" ry="1.75"/>
            </g>
          </g>
        </g>
      </svg>
    ),
    positive: (
      <svg className="fine" width="20" height="20" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g>
            <circle fill="#10b981" cx="22" cy="22" r="22"/>
            <g className="matrix" transform="translate(22.000000, 32.000000)">
              <g className="face-container">
                <g className="face" transform="translate(-9, -12)">
                  <g className="face-upAndDown">
                    <g className="eyes">
                      <ellipse className="right-eye" fill="#2C0E0F" cx="16.0941176" cy="1.75609756" rx="1.90588235" ry="1.75609756"/>
                      <ellipse className="left-eye" fill="#2C0E0F" cx="1.90588235" cy="1.75609756" rx="1.90588235" ry="1.75609756"/>
                    </g>
                    <path d="M6.18823529,4.90499997 C6.18823529,5.95249999 7.48721095,7 9.08957864,7 C10.6919463,7 11.990922,5.95249999 11.990922,4.90499997" 
                          stroke="#2C0E0F" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"/>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    )
  };

  return icons[type];
};

export function SentimentEmojis() {
  const sentimentCounts = useTweetStore((state) => state.sentimentCounts);
  const isModelLoading = useLoadingStore((state) => state.isModelLoading);

  if (isModelLoading) return null;
  
  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 flex gap-6 rounded-full bg-black/20 backdrop-blur-sm px-6 py-2 z-50">
      {(['positive', 'neutral', 'negative'] as const).map((sentiment) => (
        <div key={sentiment} className="flex flex-col items-center">
          <div className="w-10 h-10">
            <SentimentIcon type={sentiment} />
          </div>
          <span className="text-white/80 text-xs mt-1 font-medium tabular-nums">
            {sentimentCounts[sentiment]}
          </span>
        </div>
      ))}
    </div>
  );
}