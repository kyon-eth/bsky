import { Tweet, Sentiment } from '../types/tweet';

const sentiments: Sentiment[] = ['positive', 'neutral', 'negative'];
const sampleTexts = [
  'Just had the best coffee ever! ☕️ #blessed',
  'Another day at work... same old routine',
  'This weather is absolutely terrible 😡',
  'Can\'t believe how amazing this new album is! 🎵',
  'Meh, nothing special about today',
  'Worst customer service experience ever! Never going back!',
];

export function generateTweet(): Tweet {
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  
  return {
    id: Math.random().toString(36).substring(7),
    text,
    sentiment,
    timestamp: Date.now(),
  };
}