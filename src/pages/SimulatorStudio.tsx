import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const SimulatorStudio = () => {
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Determine the base URL based on the environment
  const isDev = import.meta.env.DEV;
  const simStudioUrl = isDev 
    ? 'http://localhost:5173' 
    : 'https://voice101-ai.netlify.app/sim-studio';

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message for security
      if (event.origin !== simStudioUrl) return;
      
      // Handle navigation events from the iframe
      if (event.data?.type === 'navigate') {
        window.history.pushState({}, '', `/simulator-studio${event.data.path}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [simStudioUrl]);

  // Update iframe src when location changes
  const iframeSrc = `${simStudioUrl}${location.pathname.replace('/simulator-studio', '') || '/'}${location.search}${location.hash}`;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className="w-full h-full border-0"
        title="Voice AI Simulator Studio"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allow="microphone; camera"
      />
    </div>
  );
};

export default SimulatorStudio;
