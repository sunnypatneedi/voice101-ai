
import React from "react";
import { Slider } from "../../components/ui/slider";

interface SpeedControlProps {
  demoSpeed: number;
  handleSpeedChange: (value: number[]) => void;
}

const SpeedControl: React.FC<SpeedControlProps> = ({ demoSpeed, handleSpeedChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="speed-slider" className="block text-sm font-medium text-slate-300">
        Practice speed: {demoSpeed.toFixed(1)}x
      </label>
      <Slider
        id="speed-slider"
        min={0.5}
        max={2.0}
        step={0.1}
        defaultValue={[1.0]}
        value={[demoSpeed]}
        onValueChange={handleSpeedChange}
        aria-label="Adjust playback speed"
        className="py-2"
      />
    </div>
  );
};

export default SpeedControl;
