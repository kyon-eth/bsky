import React from 'react';
import { useTweetStore } from '../store/tweetStore';
import { useLoadingStore } from '../store/loadingStore';
import { TweetDisplay } from './TweetDisplay';

export function TweetOverlay() {
  const currentSentiment = useTweetStore((state) => state.currentSentiment);
  const currentText = useTweetStore((state) => state.currentText);
  const isModelLoading = useLoadingStore((state) => state.isModelLoading);

  if (isModelLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4">
      <div className="w-full max-w-sm">
        {currentSentiment && currentText ? (
          <div key={Date.now()}>
            <TweetDisplay 
              sentiment={currentSentiment} 
              text={currentText}
            />
          </div>
        ) : (
          <div className="p-4 rounded-lg backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-sky-400/30 border border-white/5">
            <p className="text-sm font-medium text-center text-blue-100">
              Connecting to Bluesky feed...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}