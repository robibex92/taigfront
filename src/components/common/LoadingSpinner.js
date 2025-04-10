import React from 'react';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div 
      style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner; 