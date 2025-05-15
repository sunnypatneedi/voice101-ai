
import React from 'react';
import { Mic, Volume } from "lucide-react";

interface ReminderResultsProps {
  isListening: boolean;
  confirmationResult: string | null;
  audioUrl: string | null;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const ReminderResults: React.FC<ReminderResultsProps> = ({
  isListening,
  confirmationResult,
  audioUrl,
  audioRef
}) => {
  return (
    <div className="mt-6 space-y-4">
      {isListening && (
        <div className="p-4 border border-blue-500 rounded-md bg-blue-900/30 flex items-center justify-center gap-2 text-blue-300">
          <Mic className="animate-pulse text-blue-400" />
          <span>Listening for confirmation...</span>
        </div>
      )}

      {confirmationResult && (
        <div className={`p-4 border rounded-md ${
          confirmationResult === "Confirmed" 
            ? "border-green-500 bg-green-900/30 text-green-300" 
            : "border-red-500 bg-red-900/30 text-red-300"
        }`}>
          {confirmationResult}
        </div>
      )}

      {audioUrl && (
        <div className="p-4 border border-slate-600 rounded-md bg-slate-700">
          <div className="flex items-center gap-2 mb-3 text-slate-200">
            <Volume className="text-blue-400" />
            <span className="font-medium">Reminder Audio</span>
          </div>
          <audio ref={audioRef} controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default ReminderResults;
