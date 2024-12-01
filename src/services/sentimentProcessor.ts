import { Sentiment } from '../types/tweet';
import { getTweetQueue } from './tweetQueue';

interface LoadingStatus {
  status?: string;
  name?: string;
  file?: string;
  progress: number;
  loaded: number;
  total: number;
}

interface SentimentResult {
  label: Sentiment;
  score: number;
}

class SentimentProcessor {
  private classifier: any = null;
  private isInitializing: boolean = false;
  private processingQueue: boolean = false;
  private onLoadingProgress?: (status: LoadingStatus) => void;
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      new URL('../workers/sentimentWorker.ts', import.meta.url),
      { type: 'module' }
    );
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
  }

  private handleWorkerMessage(event: MessageEvent) {
    const { type, data } = event.data;

    switch (type) {
      case 'progress':
        if (this.onLoadingProgress) {
          this.onLoadingProgress(data);
        }
        break;

      case 'initialized':
        console.log('SentimentProcessor: Model initialized');
        if (this.onLoadingProgress) {
          this.onLoadingProgress({
            status: 'complete',
            name: 'Model Ready',
            file: 'Initialization complete',
            progress: 100,
            loaded: 100,
            total: 100
          });
        }
        this.startProcessingQueue();
        break;

      case 'error':
        console.error('SentimentProcessor: Worker error:', data);
        if (this.onLoadingProgress) {
          this.onLoadingProgress({
            status: 'error',
            name: 'Error',
            file: data.message || 'Unknown error',
            progress: 0,
            loaded: 0,
            total: 100
          });
        }
        break;
    }
  }
  
  async initialize(progressCallback: (status: LoadingStatus) => void) {
    if (this.isInitializing) return;
    
    try {
      this.isInitializing = true;
      this.onLoadingProgress = progressCallback;
      
      progressCallback({
        status: 'initializing',
        name: 'Sentiment Analysis Model',
        file: 'Initializing...',
        progress: 0,
        loaded: 0,
        total: 100
      });

      this.worker.postMessage({ type: 'initialize' });
      
    } catch (error) {
      console.error('SentimentProcessor: Failed to initialize:', error);
      throw error;
    }
  }

  private async startProcessingQueue() {
    if (this.processingQueue) return;
    this.processingQueue = true;

    const tweetQueue = getTweetQueue();
    console.log('Starting processing queue');
    
    while (this.processingQueue) {
      try {
        const queueItem = await tweetQueue.dequeue();
        if (!queueItem) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        console.log('Processing tweet:', queueItem);
        this.worker.postMessage({
          type: 'analyze',
          data: { id: queueItem.text, text: queueItem.text }
        });

      } catch (error) {
        console.error('Error processing queue:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('Queue processing stopped');
  }

  public stop() {
    this.processingQueue = false;
    this.worker.terminate();
  }
}

export const sentimentProcessor = new SentimentProcessor(); 