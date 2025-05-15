
import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";
import { Play, RotateCcw } from "lucide-react";

const LatencyTunerSimulator: React.FC = () => {
  const [latency, setLatency] = useState<number[]>([300]);
  const [isRunning, setIsRunning] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [pipelineStage, setPipelineStage] = useState<string>("end-to-end");
  
  const handleTest = () => {
    setIsRunning(true);
    
    // Simulate the process with the set latency
    setTimeout(() => {
      setResponseTime(latency[0]);
      setIsRunning(false);
    }, latency[0]);
  };
  
  const handleReset = () => {
    setLatency([300]);
    setResponseTime(null);
    setIsRunning(false);
  };
  
  return (
    <div className="space-y-6 bg-slate-900 p-3 sm:p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="grid gap-6">
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Latency Simulator</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Pipeline Delay: {latency[0]}ms
              </label>
              <Slider
                value={latency}
                onValueChange={setLatency}
                min={0}
                max={1000}
                step={10}
                className="w-full"
                disabled={isRunning}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0ms</span>
                <span>500ms</span>
                <span>1000ms</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Pipeline Stage</label>
              <select
                value={pipelineStage}
                onChange={(e) => setPipelineStage(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
                disabled={isRunning}
              >
                <option value="end-to-end">End-to-End</option>
                <option value="stt">Speech-to-Text</option>
                <option value="llm">LLM Processing</option>
                <option value="tts">Text-to-Speech</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleTest}
                disabled={isRunning}
              >
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Processing..." : "Test Latency"}
              </Button>
              <Button 
                variant="outline" 
                className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                onClick={handleReset}
                disabled={isRunning}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Results</h2>
          {responseTime !== null ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Actual Response Time:</span>
                <span className="font-bold text-green-400">{responseTime}ms</span>
              </div>
              <div className="bg-slate-700 p-3 rounded-lg">
                <p className="text-slate-300">
                  {responseTime < 100 
                    ? "Excellent latency! Users perceive this as instantaneous."
                    : responseTime < 300
                    ? "Good latency. Users notice a slight delay but workflow remains uninterrupted."
                    : responseTime < 600
                    ? "Moderate latency. Users may become impatient during frequent interactions."
                    : "High latency. Users will likely feel frustrated with the response time."}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic">Run the test to see results</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LatencyTunerSimulator;
