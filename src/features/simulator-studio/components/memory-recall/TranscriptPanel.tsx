
import React from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface TranscriptPanelProps {
  transcript: string;
  setTranscript: (value: string) => void;
  query: string;
  setQuery: (value: string) => void;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcript,
  setTranscript,
  query,
  setQuery
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="transcript" className="text-sm font-medium mb-2 block">
          Conversation Transcript
        </Label>
        <Textarea
          id="transcript"
          placeholder="Paste or type a multi-turn conversation transcript here..."
          className="min-h-[200px] bg-slate-900 border-slate-700"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="test-query" className="text-sm font-medium mb-2 block">
          Test Query
        </Label>
        <div className="flex gap-2">
          <Textarea
            id="test-query"
            placeholder="Enter a query to test memory recall (e.g., 'What time is my meeting tomorrow?')"
            className="bg-slate-900 border-slate-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TranscriptPanel;
