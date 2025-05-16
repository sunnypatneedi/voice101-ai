
import { useState, useCallback, useMemo } from "react";
import { useAudioRecording } from "../transcriber/useAudioRecording";

export interface QuickTalkSettings {
  noise: number;
  rate: number;
  lang: string;
}

interface RecordingState {
  records: any[]; // Replace 'any' with the actual type of records
  isRecording: boolean;
  isLoading: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

interface UseQuickTalkStateReturn {
  settings: QuickTalkSettings;
  recordingState: RecordingState;
  updateSettings: (newSettings: Partial<QuickTalkSettings>) => void;
}

export const useQuickTalkState = (): UseQuickTalkStateReturn => {
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

  const updateSettings = useCallback((newSettings: Partial<QuickTalkSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const recordingState = useMemo<RecordingState>(() => ({
    records,
    isRecording,
    isLoading,
    startRecording,
    stopRecording
  }), [records, isRecording, isLoading, startRecording, stopRecording]);

  return {
    settings,
    recordingState,
    updateSettings
  };
};

// This ensures the hook has a display name for debugging
try {
  Object.defineProperty(useQuickTalkState, 'name', { value: 'useQuickTalkState' });
} catch (e) {
  // This is just for development and debugging
  console.warn('Could not set display name for useQuickTalkState', e);
}
