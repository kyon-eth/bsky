import { Sentiment } from '../types/tweet';
import { getTweetQueue } from './tweetQueue';

interface QueuedTweet {
  id: string;
  text: string;
  timestamp: number;
}

interface ProcessedTweet {
  id: string;
  text: string;
  sentiment: Sentiment;
  timestamp: number;
}

class TweetProcessor {
  private worker: Worker;
  private inputQueue: QueuedTweet[] = [];
  private processingInterval: number = 1000;
  private renderInterval: number = 1500;
  private isProcessing: boolean = false;
  private lastRenderTime: number = 0;
  private isModelInitialized: boolean = false;

  constructor() {
    this.worker = new Worker(
      new URL('../workers/sentimentWorker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.initializeWorker();
  }

  private async initializeWorker() {
    this.worker.postMessage({ type: 'initialize' });
  }

  private handleWorkerMessage(event: MessageEvent) {
    const { type, data } = event.data;

    switch (type) {
      case 'initialized':
        console.log('Sentiment analysis model initialized');
        this.isModelInitialized = true;
        this.startProcessing();
        break;

      case 'result':
        if (!this.isModelInitialized) return;
        
        const tweet = this.inputQueue.find(t => t.id === data.id);
        if (tweet) {
          console.log('Worker returned sentiment:', data.sentiment, 'for tweet:', tweet.text);
          
          const now = Date.now();
          if (now - this.lastRenderTime >= this.renderInterval) {
            const tweetQueue = getTweetQueue();
            tweetQueue.onSentimentAnalyzed(data.sentiment, tweet.text);
            this.lastRenderTime = now;
          }
          
          this.inputQueue = this.inputQueue.filter(t => t.id !== data.id);
        }
        break;

      case 'error':
        if (data?.error) {
          console.error('Sentiment analysis error:', data.error);
        }
        break;
    }
  }

  public queueTweet(tweet: QueuedTweet) {
    if (!this.isModelInitialized) {
      console.log('Model not initialized yet, skipping tweet:', tweet);
      return;
    }
    
    console.log('Queueing tweet for analysis:', tweet);
    this.inputQueue.push(tweet);
  }

  private async startProcessing() {
    if (this.isProcessing || !this.isModelInitialized) return;
    this.isProcessing = true;

    const processNext = () => {
      if (!this.isProcessing || !this.isModelInitialized) return;

      if (this.inputQueue.length > 0) {
        const tweet = this.inputQueue[0]; // Process first item
        console.log('Processing tweet:', tweet);
        this.worker.postMessage({
          type: 'analyze',
          data: { id: tweet.id, text: tweet.text }
        });
      }

      setTimeout(processNext, this.processingInterval);
    };

    processNext();
  }

  public stop() {
    this.isProcessing = false;
    this.worker.terminate();
  }
}

// Singleton instance
export const tweetProcessor = new TweetProcessor();