
import React from "react";
import { ChartLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip 
} from "../../components/ui/chart";
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from "recharts";

interface SessionHistory {
  date: string;
  score: number;
  phrase: string;
}

interface ProgressChartProps {
  sessionHistory: SessionHistory[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ sessionHistory }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Prepare chart data
  const chartData = sessionHistory.map((session) => ({
    name: formatDate(session.date),
    score: session.score,
    phrase: session.phrase,
  })).slice(-10); // Show only the last 10 sessions

  return (
    <Card className="shadow-md border-slate-700 bg-slate-800 text-white">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
        <CardTitle className="text-slate-200">
          <ChartLine className="h-5 w-5 inline-block mr-2 text-blue-400" />
          Progress Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {sessionHistory.length === 0 ? (
          <div className="text-center text-slate-400 py-6">
            No sessions recorded yet. Complete your first session to start tracking progress.
          </div>
        ) : (
          <div className="h-64">
            <ChartContainer
              config={{
                score: {
                  label: "Score",
                  color: "#3B82F6",
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickLine={{ stroke: "#475569" }}
                    axisLine={{ stroke: "#475569" }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickLine={{ stroke: "#475569" }}
                    axisLine={{ stroke: "#475569" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: "#1e40af" }} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
