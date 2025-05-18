
import React from "react";
import { BreakdownLevel } from "../../hooks/usePronunciationCoach";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface BreakdownSelectorProps {
  breakdownLevel: BreakdownLevel;
  setBreakdownLevel: (level: BreakdownLevel) => void;
  breakdownLevels: BreakdownLevel[];
}

const BreakdownSelector: React.FC<BreakdownSelectorProps> = ({
  breakdownLevel,
  setBreakdownLevel,
  breakdownLevels
}) => {
  return (
    <div className="space-y-2 w-full">
      <label htmlFor="breakdown-select" className="block text-sm font-medium text-slate-300">
        Analysis breakdown level:
      </label>
      <Select
        value={breakdownLevel}
        onValueChange={(value) => setBreakdownLevel(value as BreakdownLevel)}
        aria-label="Select breakdown level"
      >
        <SelectTrigger 
          id="breakdown-select" 
          className="w-full max-w-xs bg-slate-700 border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500"
        >
          <SelectValue placeholder="Select breakdown level" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600 text-white">
          {breakdownLevels.map((level) => (
            <SelectItem 
              key={level} 
              value={level} 
              className="focus:bg-blue-600 focus:text-white"
            >
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BreakdownSelector;
