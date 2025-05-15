
import React, { useState } from "react";
import { Card } from "@/features/simulator-studio/components/ui/card";
import { Slider } from "@/features/simulator-studio/components/ui/slider";
import { Button } from "@/features/simulator-studio/components/ui/button";
import { Upload, Play, RotateCcw } from "lucide-react";

const TurnDetectorSimulator: React.FC = () => {
  const [threshold, setThreshold] = useState<number[]>([50]);
  const [silenceDuration, setSilenceDuration] = useState<number[]>([300]);
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleProcess = () => {
    setIsProcessing(true);
    
    // Simulate processing with a timeout
    setTimeout(() => {
      // This would be replaced with actual turn detection logic
      setTranscript(
        "Speaker 1: Hello, how are you today?\n" +
        "Speaker 2: I'm doing well, thank you for asking.\n" +
        "Speaker 1: That's great to hear. What are your plans for the weekend?\n" +
        "Speaker 2: I'm thinking of going hiking, if the weather permits.\n" +
        "Speaker 1: That sounds fantastic! I love hiking too."
      );
      setIsProcessing(false);
    }, 1500);
  };
  
  const handleReset = () => {
    setThreshold([50]);
    setSilenceDuration([300]);
    setFile(null);
    setTranscript("");
    setIsProcessing(false);
  };
  
  return (
    <div className="space-y-6 bg-slate-900 p-3 sm:p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="grid gap-6">
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Voice Activity Detection Settings</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                VAD Threshold: {threshold[0]}%
              </label>
              <Slider
                value={threshold}
                onValueChange={setThreshold}
                min={0}
                max={100}
                step={1}
                className="w-full"
                disabled={isProcessing}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Sensitive</span>
                <span>Balanced</span>
                <span>Strict</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Silence Duration: {silenceDuration[0]}ms
              </label>
              <Slider
                value={silenceDuration}
                onValueChange={setSilenceDuration}
                min={100}
                max={1000}
                step={50}
                className="w-full"
                disabled={isProcessing}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>100ms</span>
                <span>500ms</span>
                <span>1000ms</span>
              </div>
              <p className="text-xs text-slate-400">
                Minimum silence between turns
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Upload Audio File
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                  />
                  <div className="w-full p-2 rounded bg-slate-700 text-slate-300 border border-slate-600 flex justify-between items-center">
                    <span className="truncate">
                      {file ? file.name : "No file selected"}
                    </span>
                    <Upload size={16} className="flex-shrink-0" />
                  </div>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                  onClick={handleProcess}
                  disabled={!file || isProcessing}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isProcessing ? "Processing..." : "Detect Turns"}
                </Button>
                <Button
                  variant="outline"
                  className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Detected Turns</h2>
          {transcript ? (
            <div className="space-y-3">
              <div className="bg-slate-700 p-4 rounded-lg overflow-x-auto">
                <pre className="text-slate-300 whitespace-pre-wrap">{transcript}</pre>
              </div>
              <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                <p className="text-sm text-slate-300">
                  <strong>Turn Detection Analysis:</strong> System detected 5 turn changes with the current threshold settings.
                  Try adjusting the threshold to see how it affects detection accuracy.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic">
              {isProcessing 
                ? "Processing audio file..." 
                : "Upload and process an audio file to see detected turns"}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TurnDetectorSimulator;
