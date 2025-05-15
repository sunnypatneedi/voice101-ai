
import { useState } from "react";
import { useAudioRecording } from "../transcriber/useAudioRecording";

export interface QuickTalkSettings {
  noise: number;
  rate: number;
  lang: string;
}

export function useQuickTalkState() {
  const [settings, setSettings] = useState<QuickTalkSettings>({
    noise: 20,
    rate: 16000,
    lang: "auto"
  });
  
  const { 
    records, 
    isRecording, 
    isLoading, 
    startRecording, 
    stopRecording 
  } = useAudioRecording(settings);

  const updateSettings = (newSettings: Partial<QuickTalkSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    recordingState: {
      records,
      isRecording,
      isLoading,
      startRecording,
      stopRecording
    },
    updateSettings
  };
}
