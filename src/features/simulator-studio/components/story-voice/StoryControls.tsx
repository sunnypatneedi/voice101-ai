
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { Button } from '../../components/ui/button';
import { Volume2 } from 'lucide-react';

interface StoryControlsProps {
  template: string;
  setTemplate: (template: string) => void;
  voiceStyle: string;
  setVoiceStyle: (style: string) => void;
  effectVolume: number;
  setEffectVolume: (volume: number) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

const StoryControls: React.FC<StoryControlsProps> = ({
  template,
  setTemplate,
  voiceStyle,
  setVoiceStyle,
  effectVolume,
  setEffectVolume,
  isLoading,
  onGenerate
}) => {
  return (
    <div className="space-y-4 bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">
          Story Template
        </label>
        <Select value={template} onValueChange={setTemplate}>
          <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600 text-white">
            <SelectItem value="Adventure">Adventure</SelectItem>
            <SelectItem value="Bedtime">Bedtime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">
          Voice Style
        </label>
        <Select value={voiceStyle} onValueChange={setVoiceStyle}>
          <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Select voice style" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600 text-white">
            <SelectItem value="Friendly">Friendly</SelectItem>
            <SelectItem value="Calm">Calm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-slate-200">
            Sound Effects Volume
          </label>
          <span className="text-sm text-slate-300">{effectVolume}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-slate-400" />
          <Slider
            value={[effectVolume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => setEffectVolume(values[0])}
            className="flex-1"
          />
        </div>
      </div>

      <Button 
        onClick={onGenerate} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Story"}
      </Button>
    </div>
  );
};

export default StoryControls;
