
import React from 'react';
import { Input } from "../../components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";

interface ReminderSettingsProps {
  alertTime: string;
  setAlertTime: (time: string) => void;
  confirmMode: string;
  setConfirmMode: (mode: string) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  alertTime,
  setAlertTime,
  confirmMode,
  setConfirmMode,
  speechRate,
  setSpeechRate
}) => {
  return (
    <div className="space-y-6 p-4 rounded-lg bg-slate-700 border border-slate-600">
      <div className="space-y-2">
        <Label htmlFor="alertTime" className="text-slate-200 font-medium">Reminder Time</Label>
        <Input
          id="alertTime"
          type="time"
          value={alertTime}
          onChange={(e) => setAlertTime(e.target.value)}
          aria-label="Reminder Time"
          className="bg-slate-600 border-slate-500 text-white focus:border-blue-400 focus:ring-blue-400/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmMode" className="text-slate-200 font-medium">Confirmation Mode</Label>
        <Select value={confirmMode} onValueChange={setConfirmMode}>
          <SelectTrigger 
            id="confirmMode" 
            aria-label="Confirmation Mode"
            className="bg-slate-600 border-slate-500 text-white focus:border-blue-400 focus:ring-blue-400/20"
          >
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600 text-white">
            <SelectItem value="Repeat" className="focus:bg-blue-600 focus:text-white">Repeat</SelectItem>
            <SelectItem value="Single" className="focus:bg-blue-600 focus:text-white">Single</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="speechRate" className="text-slate-200 font-medium">
          Speech Rate: {speechRate.toFixed(1)}x
        </Label>
        <Slider
          id="speechRate"
          min={0.5}
          max={2.0}
          step={0.1}
          value={[speechRate]}
          onValueChange={(values) => setSpeechRate(values[0])}
          aria-label="Speech Rate"
          className="py-2"
        />
      </div>
    </div>
  );
};

export default ReminderSettings;
