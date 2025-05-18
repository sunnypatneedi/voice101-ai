
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onPlayStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;
    
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const handleTimeUpdate = () => {
      if (audioElement.duration) {
        setProgress((audioElement.currentTime / audioElement.duration) * 100);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    };
    
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);
    
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, onPlayStateChange]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          if (onPlayStateChange) onPlayStateChange(true);
        })
        .catch(e => console.error('Error playing audio:', e));
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md space-y-4">
      <div className="flex items-center gap-3">
        <Button 
          onClick={togglePlayPause} 
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-none"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ 
                width: `${progress}%`, 
                transition: 'width 0.1s' 
              }}
            />
          </div>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;
