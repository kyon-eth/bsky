import { tweetProcessor } from './tweetProcessor';

type EventCallback = (data: any) => void;

class BskyFeed {
  private ws: WebSocket | null = null;
  private isInitialized: boolean = false;
  private reconnectTimeout?: number;
  private eventHandlers: Map<string, EventCallback[]> = new Map();
  private shouldReconnect: boolean = false;
  private lastQueuedTime: number = 0;
  private readonly QUEUE_INTERVAL = 300; 
  private readonly FIREHOSE_URL = 'wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post';

  constructor() {
  }

  private isValidPost(text: string, record: any): boolean {
    // Check for empty text
    if (!text || text.trim().length === 0) return false;

    // Check for line breaks
    if (text.includes('\n')) return false;

    // Check for hashtags
    if (text.includes('#')) return false;

    // Check for mentions
    if (text.includes('@')) return false;

    // Check for handles
    if (text.includes('.social')) return false;

    // Check for links
    if (text.includes('http') || text.includes('www.')) return false;

    // Check for images/media
    if (record.embed?.images || record.embed?.media) return false;

    // Check for reasonable length
    if (text.length < 30 || text.length > 100) return false;

    // Basic NSFW filtering
    const nsfwTerms = ['nsfw', 'porn', 'xxx', 'adult', 'sex', 'onlyfans'];
    if (nsfwTerms.some(term => text.toLowerCase().includes(term))) return false;

    // Filter out common US political terms and names
    const politicalTerms = [
      'biden', 'trump', 'democrat', 'republican', 'gop', 
      'congress', 'senate', 'politics', 'election',
      'conservative', 'liberal', 'maga', 'vote', 'voting',
      'pelosi', 'mcconnell', 'aoc', 'desantis'
    ];
    if (politicalTerms.some(term => text.toLowerCase().includes(term))) return false;

    // Filter out posts with majority non-English characters
    const nonEnglishCharRegex = /[^\x00-\x7F]/g; // Matches any non-ASCII characters
    const nonEnglishChars = text.match(nonEnglishCharRegex) || [];
    if (nonEnglishChars.length > text.length / 2) return false;

    return true;
  }

  private canQueuePost(): boolean {
    const now = Date.now();
    if (now - this.lastQueuedTime >= this.QUEUE_INTERVAL) {
      this.lastQueuedTime = now;
      return true;
    }
    return false;
  }

  private setupWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    console.log('Connecting to Bluesky firehose...');
    this.ws = new WebSocket(this.FIREHOSE_URL);

    this.ws.onopen = () => {
      console.log("Bluesky feed connected");
      this.emit('open');
    };

    this.ws.onclose = () => {
      console.log("Bluesky feed disconnected");
      this.emit('close');
      
      if (this.shouldReconnect) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("Bluesky websocket error:", error);
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Only process if we can queue a post
        if (!this.canQueuePost()) return;

        // Only process English posts or posts without language specified
        if (
          message.kind === 'commit' &&
          message.commit.collection === 'app.bsky.feed.post' &&
          message.commit.operation === 'create' &&
          message.commit.record.text &&
          (message.commit.record.langs?.includes('en') || !message.commit.record.langs)
        ) {
          const text = message.commit.record.text;
          const record = message.commit.record;

          // Apply additional filtering
          if (this.isValidPost(text, record)) {
            console.log('New post:', text);
            // Queue the post for sentiment analysis
            tweetProcessor.queueTweet({
              id: message.commit.uri,
              text: text,
              timestamp: Date.now()
            });
          }
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = window.setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.setupWebSocket();
    }, 3000);
  }

  private emit(eventName: string, data?: any) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  public on(eventName: string, callback: EventCallback) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)?.push(callback);
  }

  public start() {
    if (this.isInitialized) return;
    
    console.log("Starting Bluesky feed");
    this.shouldReconnect = true;
    this.setupWebSocket();
    this.isInitialized = true;
  }

  public stop() {
    if (!this.isInitialized) return;
    
    console.log("Stopping Bluesky feed");
    this.shouldReconnect = false;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.isInitialized = false;
  }
}

// Singleton instance
export const bskyFeed = new BskyFeed(); 