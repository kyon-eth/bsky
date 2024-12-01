import { pipeline, env } from '@xenova/transformers';

let classifier: any = null;

// Check for WebGPU support
async function checkWebGPUSupport() {
  try {
    if ('gpu' in navigator) {
      // @ts-ignore - TypeScript doesn't know about navigator.gpu yet
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) {
        const device = await adapter.requestDevice();
        if (device) {
          console.log('Worker: WebGPU is supported and working');
          return true;
        }
      }
    }
    console.log('Worker: WebGPU not available, falling back to CPU');
    return false;
  } catch (error) {
    console.log('Worker: Error checking WebGPU support:', error);
    return false;
  }
}

// Initialize the model
async function initializeModel() {
  try {
    // Configure environment
    env.allowLocalModels = false;
    env.useBrowserCache = true;
    env.useCustomCache = false;

    // Check WebGPU support
    const hasWebGPU = await checkWebGPUSupport();

    // Initialize the pipeline with logging
    console.log('Worker: Starting pipeline initialization');
    classifier = await pipeline(
      'sentiment-analysis',
      'Xenova/twitter-roberta-base-sentiment-latest',
      {
        quantized: true,
        revision: 'main',
        backend: hasWebGPU ? 'webgpu' : 'cpu',
        progress_callback: (progress: any) => {
          console.log('Worker: Progress update:', progress);
          self.postMessage({ 
            type: 'progress',
            data: {
              ...progress,
              progress: progress.progress || 0,
              loaded: progress.loaded || 0,
              total: progress.total || 100
            }
          });
        }
      }
    );

    console.log('Worker: Pipeline initialized successfully using', hasWebGPU ? 'WebGPU' : 'CPU');
    self.postMessage({ type: 'initialized' });
  } catch (error) {
    console.error('Worker: Initialization error:', error);
    self.postMessage({ 
      type: 'error', 
      data: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    });
  }
}

// Handle messages from main thread
self.onmessage = async (event) => {
  const { type, data } = event.data;
  console.log('Worker: Received message:', { type, data });

  switch (type) {
    case 'initialize':
      await initializeModel();
      break;

    case 'analyze':
      if (!classifier) {
        self.postMessage({ 
          type: 'error', 
          error: 'Classifier not initialized',
          id: data?.id 
        });
        return;
      }

      try {
        console.log('Worker: Analyzing text:', data.text);
        const result = await classifier(data.text);
        console.log('Worker: Analysis result:', JSON.stringify(result));
        
        const sentiment = result[0].label;
        
        self.postMessage({
          type: 'result',
          data: {
            id: data.id,
            sentiment,
            score: result[0].score
          }
        });
      } catch (error) {
        console.error('Worker: Analysis error:', error);
        self.postMessage({ 
          type: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error',
          id: data.id 
        });
      }
      break;
  }
};

// Ensure TypeScript knows this is a module worker
export {}; 