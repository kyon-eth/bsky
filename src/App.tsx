import React from 'react';
import { Scene } from './components/Scene';
import { TweetOverlay } from './components/TweetOverlay';
import { SentimentStats } from './components/SentimentStats';
import { SentimentEmojis } from './components/SentimentEmojis';
import { useLoadingStore } from './store/loadingStore';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const isModelLoading = useLoadingStore((state) => state.isModelLoading);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="grain" />
      </div>
      
      <div className="relative w-full h-screen">
        <div className={`absolute inset-0 transition-opacity duration-500 ${isModelLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Scene />
        </div>

        <SentimentEmojis />
        <SentimentStats />
        {!isModelLoading && <TweetOverlay />}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-400/60 text-sm bg-transparent backdrop-blur-sm">
        a visual experiment by{' '}
        <a
          href="https://kyon.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:text-white/90 transition-colors"
        >
          kyon <ExternalLink className="ml-1 w-3 h-3" />
        </a>
      </footer>
    </div>
  );
}