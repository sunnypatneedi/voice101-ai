
import React from 'react';

interface ErrorDisplayProps {
  errors: string[];
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #e74c3c',
      borderRadius: '4px',
      backgroundColor: '#fdecea',
      color: '#333',
    }}>
      <h1 style={{ color: '#c0392b', marginTop: 0 }}>Application Error</h1>
      <p>There was a problem loading the application. Please try refreshing the page.</p>
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.9em',
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Error Details:</p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
