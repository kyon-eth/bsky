import { useState, useEffect, useRef } from 'react';
import { useLoadingStore } from '../store/loadingStore';
import { sentimentProcessor } from '../services/sentimentProcessor';
import { bskyFeed } from '../services/bskyFeed';
import { ModelLoadingOverlay } from './ModelLoadingOverlay';

interface LoadingStatus {
  status?: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
  task?: string;
  model?: string;
}

export function SentimentStats() {
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({
    status: 'initializing',
    progress: 0
  });
  const setModelLoading = useLoadingStore((state) => state.setModelLoading);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const initializeProcessor = async () => {
      try {
        console.log('Initializing sentiment processor...');
        setModelLoading(true);

        await sentimentProcessor.initialize((status) => {
          if (isMounted.current) {
            setLoadingStatus(prevStatus => {
              const newProgress = status.progress || prevStatus.progress || 0;
              const updatedStatus = {
                ...prevStatus,
                ...status,
                progress: Math.max(newProgress, prevStatus.progress || 0)
              };
              return updatedStatus;
            });

            if (status.status === 'complete') {
              setTimeout(() => {
                if (isMounted.current) {
                  setModelLoading(false);
                  setLoadingStatus(prev => ({ ...prev, status: 'ready' }));
                  
                  bskyFeed.start();
                }
              }, 1000);
            }
          }
        });
        
        if (isMounted.current) {
          console.log('Model initialized successfully');
          setError(null);
        }
      } catch (error) {
        console.error('Error initializing model:', error);
        if (isMounted.current) {
          setError('Failed to initialize sentiment analysis.');
          setModelLoading(false);
        }
      }
    };

    initializeProcessor();

    return () => {
      console.log('Cleaning up...');
      isMounted.current = false;
      bskyFeed.stop();
    };
  }, [setModelLoading]);

  if (loadingStatus.status !== 'ready') {
    return <ModelLoadingOverlay loadingStatus={loadingStatus} />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return null;
}
