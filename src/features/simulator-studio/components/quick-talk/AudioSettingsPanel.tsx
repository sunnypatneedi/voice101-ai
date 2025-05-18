
import React from "react";
import { AudioSettings } from "../transcriber/AudioSettings";
import { QuickTalkSettings } from "./useQuickTalkState";

interface AudioSettingsPanelProps {
  settings: QuickTalkSettings;
  onSettingsChange: (settings: Partial<QuickTalkSettings>) => void;
}

export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <AudioSettings 
      noise={settings.noise}
      setNoise={(noise) => onSettingsChange({ noise })}
      rate={settings.rate}
      setRate={(rate) => onSettingsChange({ rate })}
      lang={settings.lang}
      setLang={(lang) => onSettingsChange({ lang })}
    />
  );
};
