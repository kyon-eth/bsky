import React from 'react';

interface LoadingStatus {
  status?: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

interface ModelLoadingOverlayProps {
  loadingStatus: LoadingStatus;
}

export function ModelLoadingOverlay({ loadingStatus }: ModelLoadingOverlayProps) {
  // Calculate normalized progress
  const calculateProgress = () => {
    if (loadingStatus.loaded && loadingStatus.total) {
      return (loadingStatus.loaded / loadingStatus.total) * 100;
    }
    return loadingStatus.progress || 0;
  };

  const progressPercent = Math.min(Math.max(calculateProgress(), 0), 100);

  // Format file size
  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  // Get current status message
  const getStatusMessage = () => {
    if (loadingStatus.status === 'complete') return 'Initialization complete';
    if (loadingStatus.status === 'finalizing') return 'Finalizing model initialization...';
    if (loadingStatus.status === 'downloading' && loadingStatus.file) {
      return `Downloading ${loadingStatus.file}`;
    }
    if (loadingStatus.file) return loadingStatus.file;
    return 'Initializing...';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Title */}
          <h2 className="text-xl font-bold mb-2">
            Loading Sentiment Analysis Model
          </h2>

          {/* Status message */}
          <p className="text-sm text-gray-500 mb-6">
            {getStatusMessage()}
          </p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Progress text */}
          {loadingStatus.loaded && loadingStatus.total && (
            <p className="text-sm text-gray-500">
              {formatFileSize(loadingStatus.loaded)} of {formatFileSize(loadingStatus.total)}
              {' '}({progressPercent.toFixed(1)}%)
            </p>
          )}

          {/* Info text */}
          <p className="text-xs text-gray-400 mt-4">
            This may take a while on first load (~300MB)
          </p>
        </div>
      </div>
    </div>
  );
}
