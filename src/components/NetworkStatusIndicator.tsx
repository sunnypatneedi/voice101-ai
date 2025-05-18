import { useEffect, useState } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface NetworkStatusIndicatorProps {
  showTooltip?: boolean;
  className?: string;
}

const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  showTooltip = true,
  className = '',
}) => {
  const { isOnline, isSlow, effectiveConnectionType } = useNetworkStatus();
  const [showStatus, setShowStatus] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Show status indicator briefly when network status changes
  useEffect(() => {
    if (!isOnline || isSlow) {
      setShowStatus(true);
    } else {
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isSlow]);

  if (!showStatus) return null;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        text: 'Offline',
        icon: (
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-800 dark:text-red-200',
      };
    }
    
    if (isSlow) {
      return {
        text: `Slow Network (${effectiveConnectionType})`,
        icon: (
          <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        ),
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-800 dark:text-yellow-200',
      };
    }
    
    return {
      text: 'Online',
      icon: (
        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-200',
    };
  };

  const status = getStatusInfo();

  return (
    <div 
      className={`relative inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} ${className}`}
      onMouseEnter={() => setTooltipVisible(showTooltip)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <span className="flex items-center">
        <span className="mr-1.5">{status.icon}</span>
        <span>{status.text}</span>
      </span>
      
      {tooltipVisible && showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          {status.text}
          <div className="absolute top-full left-1/2 w-2 h-2 bg-gray-800 transform -translate-x-1/2 -translate-y-1 rotate-45"></div>
        </div>
      )}
      
      {!isOnline && (
        <span className="absolute flex h-2.5 w-2.5 -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;
