
import React from "react";
import { Clock } from "lucide-react";
import { Brain } from "lucide-react";
import { MemoryResult } from "./MemoryTypes";

interface ResultsPanelProps {
  results: MemoryResult[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <Brain className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No memory tests have been run yet.</p>
        <p className="text-sm mt-2">Run a test to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <div key={index} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-blue-400">Test Query</h4>
            <div className="flex items-center text-sm text-slate-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>{result.responseTime}ms</span>
            </div>
          </div>
          
          <p className="text-white mb-4 bg-slate-800 p-3 rounded">"{result.query}"</p>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-green-400 mb-1">Assistant's Response:</h5>
              <p className="bg-slate-800 p-3 rounded text-slate-200">{result.actualAnswer}</p>
            </div>
            
            {result.expectedAnswer && (
              <div>
                <h5 className="font-medium text-yellow-400 mb-1">Expected Information:</h5>
                <p className="bg-slate-800 p-3 rounded text-slate-300">{result.expectedAnswer}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-3">
              <div className="font-medium">Memory Accuracy:</div>
              <div className={`px-3 py-1 rounded font-semibold ${
                result.accuracy > 75 ? "bg-green-900/50 text-green-400" :
                result.accuracy > 40 ? "bg-yellow-900/50 text-yellow-400" :
                "bg-red-900/50 text-red-400"
              }`}>
                {result.accuracy}%
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsPanel;
