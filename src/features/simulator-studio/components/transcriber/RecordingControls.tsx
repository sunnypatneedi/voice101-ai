
import React from "react";
import { Button } from "../ui/button";
import { Mic, MicOff } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isLoading: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isLoading,
  startRecording,
  stopRecording,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button
        onClick={startRecording}
        disabled={isRecording || isLoading}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
      >
        <Mic className="mr-2 h-5 w-5" /> Start Recording
      </Button>
      
      <Button
        onClick={stopRecording}
        disabled={!isRecording || isLoading}
        variant="destructive"
        size="lg"
        className="px-6 py-2"
      >
        <MicOff className="mr-2 h-5 w-5" /> Stop Recording
      </Button>
    </div>
  );
};
