import { Sentiment } from '../types/tweet';
import { useTweetStore } from '../store/tweetStore';

interface QueueItem {
  text: string;
  timestamp: number;
}

class TweetQueue {
  private queue: QueueItem[] = [];
  private processing = false;

  enqueue(item: QueueItem) {
    console.log('TweetQueue: Enqueueing item:', item);
    this.queue.push(item);
  }

  async dequeue(): Promise<QueueItem | null> {
    if (this.queue.length === 0) {
      return null;
    }
    const item = this.queue.shift() || null;
    // console.log('TweetQueue: Dequeued item:', item);
    return item;
  }

  onSentimentAnalyzed(sentiment: Sentiment, text: string, confidence: number) {
    console.log('TweetQueue: Sentiment analyzed:', {
      sentiment,
      confidence: `${(confidence * 100).toFixed(1)}%`
    });
    const store = useTweetStore.getState();
    store.processSentiment(sentiment, text, confidence);
  }

  clear() {
    this.queue = [];
    this.processing = false;
  }

  getQueueLength() {
    return this.queue.length;
  }
}

// Singleton instance
let queueInstance: TweetQueue | null = null;

export function getTweetQueue(): TweetQueue {
  if (!queueInstance) {
    queueInstance = new TweetQueue();
  }
  return queueInstance;
}