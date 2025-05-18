
import React from "react";
import { AudioSettingsPanel } from "./quick-talk/AudioSettingsPanel";
import { RecordingControlsPanel } from "./quick-talk/RecordingControlsPanel";
import { TranscriptionResultsPanel } from "./quick-talk/TranscriptionResultsPanel";
import { useQuickTalkState } from "./quick-talk/useQuickTalkState";

export default function QuickTalkSimulator() {
  const { 
    settings,
    recordingState,
    updateSettings,
  } = useQuickTalkState();

  return (
    <div className="space-y-6">
      <AudioSettingsPanel 
        settings={settings}
        onSettingsChange={updateSettings}
      />

      <RecordingControlsPanel 
        isRecording={recordingState.isRecording}
        isLoading={recordingState.isLoading}
        startRecording={recordingState.startRecording}
        stopRecording={recordingState.stopRecording}
      />

      <TranscriptionResultsPanel 
        records={recordingState.records}
        isLoading={recordingState.isLoading}
      />
    </div>
  );
}
