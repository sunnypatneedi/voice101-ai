
import React from "react";
import { RecordingControls } from "../transcriber/RecordingControls";

interface RecordingControlsPanelProps {
  isRecording: boolean;
  isLoading: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const RecordingControlsPanel: React.FC<RecordingControlsPanelProps> = ({
  isRecording,
  isLoading,
  startRecording,
  stopRecording
}) => {
  return (
    <RecordingControls 
      isRecording={isRecording}
      isLoading={isLoading}
      startRecording={startRecording}
      stopRecording={stopRecording}
    />
  );
};
