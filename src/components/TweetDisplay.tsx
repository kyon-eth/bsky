import React from 'react';
import { Sentiment } from '../types/tweet';

const sentimentColors = {
  positive: {
    bg: 'from-green-500/20 to-emerald-400/30',
    text: 'text-green-100'
  },
  neutral: {
    bg: 'from-blue-500/20 to-sky-400/30',
    text: 'text-blue-100'
  },
  negative: {
    bg: 'from-red-500/20 to-rose-400/30',
    text: 'text-red-100'
  }
};

interface TweetDisplayProps {
  sentiment: Sentiment;
  text: string;
}

export function TweetDisplay({ sentiment, text }: TweetDisplayProps) {
  if (!sentiment || !sentimentColors[sentiment]) {
    return null;
  }

  const colors = sentimentColors[sentiment];
  
  return (
    <div
      className={`
        p-4 rounded-lg backdrop-blur-sm
        bg-gradient-to-br ${colors.bg}
        border border-white/5
        transform transition-all duration-500 ease-out
        animate-fade-in
        ${colors.text}
      `}
    >
      <p className="text-sm font-medium text-center">{text}</p>
    </div>
  );
}