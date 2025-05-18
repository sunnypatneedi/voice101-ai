
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Check, X } from "lucide-react";

export interface TestResultsData {
  responseText: string;
  accuracyScore: number;
}

interface TestResultsProps {
  results: TestResultsData | null;
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  if (!results) return null;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Assistant Response
          {results.accuracyScore >= 0.7 ? (
            <Check className="text-green-500 ml-2" />
          ) : (
            <X className="text-red-500 ml-2" />
          )}
        </CardTitle>
        <CardDescription className="text-slate-300">
          Accuracy Score: {(results.accuracyScore * 100).toFixed(0)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-700 p-4 rounded-md border border-slate-600">
          <p className="text-white">{results.responseText}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResults;
