import { create } from 'zustand';
import { Sentiment } from '../types/tweet';

interface TweetStore {
  currentSentiment: Sentiment | null;
  currentText: string | null;
  recentSentiments: Sentiment[];
  sentimentCounts: Record<Sentiment, number>;
  consecutiveCount: number;
  processSentiment: (sentiment: Sentiment, text: string, confidence: number) => void;
}

export const useTweetStore = create<TweetStore>((set, get) => ({
  currentSentiment: null,
  currentText: null,
  recentSentiments: [],
  sentimentCounts: {
    positive: 0,
    neutral: 0,
    negative: 0
  },
  consecutiveCount: 0,
  processSentiment: (sentiment: Sentiment, text: string, confidence: number) => {
    console.log('TweetStore: Processing new sentiment:', { 
      sentiment, 
      text, 
      confidence: `${(confidence * 100).toFixed(1)}%` 
    });
    const state = get();
    const lastSentiment = state.recentSentiments[0];
    const consecutiveCount = lastSentiment === sentiment 
      ? state.consecutiveCount + 1 
      : 1;

    set({
      currentSentiment: sentiment,
      currentText: text,
      recentSentiments: [sentiment, ...state.recentSentiments].slice(0, 3),
      sentimentCounts: {
        ...state.sentimentCounts,
        [sentiment]: state.sentimentCounts[sentiment] + 1
      },
      consecutiveCount,
    });
    console.log('TweetStore: Updated state:', {
      ...get(),
      lastConfidence: `${(confidence * 100).toFixed(1)}%`
    });
  }
}));