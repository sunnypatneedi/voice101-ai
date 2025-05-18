
import React from "react";
import { Button } from "../../components/ui/button";
import { Mic, MicOff, Play } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPracticing: boolean;
  isLoading: boolean;
  toggleRecording: () => void;
  startPractice: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPracticing,
  isLoading,
  toggleRecording,
  startPractice
}) => {
  return (
    <div className="flex gap-4 pt-2">
      <Button 
        onClick={toggleRecording} 
        className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}
        disabled={isPracticing || isLoading}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <>
            <MicOff className="h-4 w-4 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            Record
          </>
        )}
      </Button>
      
      <Button 
        onClick={startPractice} 
        disabled={isPracticing || isRecording || isLoading}
        variant="outline"
        className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
        aria-label="Practice pronunciation"
      >
        <Play className="h-4 w-4 mr-2" />
        Practice
      </Button>
    </div>
  );
};

export default RecordingControls;
