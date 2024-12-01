export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Tweet {
  id: string;
  text: string;
  sentiment: Sentiment;
  timestamp: number;
}