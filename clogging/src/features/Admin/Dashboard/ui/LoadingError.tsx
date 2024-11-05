// LoadingError.tsx
import React from 'react';

interface LoadingErrorProps {
  loading: boolean;
  error: string | null;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error }) => {
  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error loading comments: {error}</div>;
  }

  return null; // No loading or error
};

export default LoadingError;
