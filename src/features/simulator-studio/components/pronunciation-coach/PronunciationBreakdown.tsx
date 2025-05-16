
import React from "react";
import { PronunciationBreakdown } from "../../hooks/usePronunciationCoach";

interface PronunciationBreakdownProps {
  breakdown: PronunciationBreakdown[];
  isLoading: boolean;
  overallScore: number | null;
  breakdownLevel: "Word" | "Phoneme";
}

const PronunciationBreakdownComponent: React.FC<PronunciationBreakdownProps> = ({
  breakdown,
  isLoading,
  overallScore,
  breakdownLevel
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (overallScore === null) {
    return (
      <div className="text-center text-slate-400 py-10">
        Record yourself saying the phrase to see your score and breakdown
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-slate-200">Breakdown:</h3>
        <span className="text-sm text-slate-400">{breakdownLevel} level analysis</span>
      </div>
      <div className="overflow-auto max-h-48 border rounded-md border-slate-600">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                {breakdownLevel === "Word" ? "Word" : "Word & Phoneme"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {breakdown.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-300">
                    {item.word}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-400">
                    <div className="flex items-center">
                      <div 
                        className="h-2 rounded-full mr-2" 
                        style={{ 
                          width: `${item.score}px`,
                          backgroundColor: item.score > 80 ? '#34D399' : item.score > 60 ? '#FBBF24' : '#F87171'
                        }} 
                      ></div>
                      {item.score}/100
                    </div>
                  </td>
                </tr>
                {breakdownLevel === "Phoneme" && item.phonemes && item.phonemes.map((phoneme, pidx) => (
                  <tr key={`${index}-${pidx}`} className="bg-slate-900">
                    <td className="px-4 py-1 pl-8 whitespace-nowrap text-xs text-slate-400">
                      {phoneme.phoneme}
                    </td>
                    <td className="px-4 py-1 whitespace-nowrap text-xs text-slate-400">
                      <div className="flex items-center">
                        <div 
                          className="h-1.5 rounded-full mr-2" 
                          style={{ 
                            width: `${phoneme.score / 2}px`,
                            backgroundColor: phoneme.score > 80 ? '#34D399' : phoneme.score > 60 ? '#FBBF24' : '#F87171'
                          }} 
                        ></div>
                        {phoneme.score}/100
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PronunciationBreakdownComponent;
