
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Brain, MemoryStick } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface MemoryControlsProps {
  transcriptLength: number;
  setTranscriptLength: (value: number) => void;
  memoryRetention: number;
  setMemoryRetention: (value: number) => void;
  querySpecificity: number;
  setQuerySpecificity: (value: number) => void;
  memoryCleared: boolean;
  onClearMemory: () => void;
  onResetMemory: () => void;
  onLoadSample: () => void;
  onRunTest: () => void;
  isLoading: boolean;
}

const MemoryControls: React.FC<MemoryControlsProps> = ({
  transcriptLength,
  setTranscriptLength,
  memoryRetention,
  setMemoryRetention,
  querySpecificity,
  setQuerySpecificity,
  memoryCleared,
  onClearMemory,
  onResetMemory,
  onLoadSample,
  onRunTest,
  isLoading
}) => {
  return (
    <Card className="lg:col-span-1 bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Controls</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="transcript-length">Transcript Length (minutes)</Label>
              <span className="text-sm text-blue-400">{transcriptLength}</span>
            </div>
            <Slider 
              id="transcript-length"
              min={1} 
              max={15} 
              step={1}
              value={[transcriptLength]}
              onValueChange={(value) => setTranscriptLength(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="memory-retention">Memory Retention (%)</Label>
              <span className="text-sm text-blue-400">{memoryRetention}%</span>
            </div>
            <Slider 
              id="memory-retention"
              min={0} 
              max={100} 
              step={5}
              value={[memoryRetention]}
              onValueChange={(value) => setMemoryRetention(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="query-specificity">Query Specificity (%)</Label>
              <span className="text-sm text-blue-400">{querySpecificity}%</span>
            </div>
            <Slider 
              id="query-specificity"
              min={0} 
              max={100} 
              step={5}
              value={[querySpecificity]}
              onValueChange={(value) => setQuerySpecificity(value[0])}
            />
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="clear-memory" className="cursor-pointer">Clear Memory</Label>
              <Switch
                id="clear-memory"
                checked={memoryCleared}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onClearMemory();
                  } else {
                    onResetMemory();
                  }
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Toggle to simulate clearing the assistant's memory between interactions.
            </p>
          </div>
          
          <Button 
            onClick={onLoadSample} 
            variant="outline" 
            className="w-full mt-4 border-blue-700/50 bg-blue-900/20 hover:bg-blue-800/30"
          >
            <MemoryStick className="mr-2 h-4 w-4" />
            Load Sample Transcript
          </Button>
          
          <Button 
            onClick={onRunTest} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Running Test...</>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Run Memory Test
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryControls;
