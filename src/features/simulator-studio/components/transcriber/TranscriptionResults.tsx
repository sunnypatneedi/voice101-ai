
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface TranscriptRecord {
  start: number;
  text: string;
  confidence: number;
}

interface TranscriptionResultsProps {
  records: TranscriptRecord[];
  isLoading: boolean;
}

export const TranscriptionResults: React.FC<TranscriptionResultsProps> = ({ records, isLoading }) => {
  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 border-slate-700">
            <TableHead className="text-slate-200">Start Time (s)</TableHead>
            <TableHead className="text-slate-200">Text</TableHead>
            <TableHead className="text-slate-200 text-right">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-800">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                <p className="mt-2 text-slate-300">Processing audio...</p>
              </TableCell>
            </TableRow>
          ) : records.length > 0 ? (
            records.map((record, index) => (
              <TableRow key={index} className="border-slate-700">
                <TableCell className="font-mono">{record.start.toFixed(2)}</TableCell>
                <TableCell>{record.text}</TableCell>
                <TableCell className="text-right">
                  <span 
                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                      record.confidence >= 0.9 ? "bg-green-900 text-green-300" :
                      record.confidence >= 0.7 ? "bg-blue-900 text-blue-300" :
                      "bg-orange-900 text-orange-300"
                    }`}
                  >
                    {Math.round(record.confidence * 100)}%
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-slate-400 py-8">
                No transcription data yet. Record some audio to see results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
