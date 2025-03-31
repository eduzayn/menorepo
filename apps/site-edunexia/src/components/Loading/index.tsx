import React from 'react';
import './loading.css';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', message, color = '#4A5568' }) => {
  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`} style={{ borderColor: color }}>
        <div className="spinner-inner" style={{ borderColor: color }} />
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading; 