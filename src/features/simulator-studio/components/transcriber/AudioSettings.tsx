
import React from "react";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useIsMobile } from "../../hooks/use-mobile";

interface AudioSettingsProps {
  noise: number;
  setNoise: (value: number) => void;
  rate: number;
  setRate: (value: number) => void;
  lang: string;
  setLang: (value: string) => void;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  noise,
  setNoise,
  rate,
  setRate,
  lang,
  setLang,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 bg-slate-900 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold mb-4">Audio Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center flex-wrap">
            <label htmlFor="noise-slider" className="text-sm font-medium">
              Noise Level
            </label>
            <span className="text-sm font-medium">{noise} dB SNR</span>
          </div>
          <Slider
            id="noise-slider"
            min={0}
            max={40}
            step={1}
            value={[noise]}
            onValueChange={(value) => setNoise(value[0])}
            className="w-full"
            aria-label="Noise Level"
          />
          <p className="text-xs text-slate-400">Lower values simulate noisier environments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="sample-rate" className="text-sm font-medium block">
              Sample Rate (Hz)
            </label>
            <Select value={rate.toString()} onValueChange={(value) => setRate(parseInt(value))}>
              <SelectTrigger id="sample-rate" className="w-full bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select sample rate" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="8000">8000 Hz</SelectItem>
                <SelectItem value="16000">16000 Hz</SelectItem>
                <SelectItem value="44000">44000 Hz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="language-hint" className="text-sm font-medium block">
              Language Hint
            </label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger id="language-hint" className="w-full bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
