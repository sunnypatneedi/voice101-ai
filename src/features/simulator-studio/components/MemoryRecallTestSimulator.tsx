
import React from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import MemoryControls from "./memory-recall/MemoryControls";
import TranscriptPanel from "./memory-recall/TranscriptPanel";
import ResultsPanel from "./memory-recall/ResultsPanel";
import { useMemoryRecall } from "../hooks/useMemoryRecall";

const MemoryRecallTestSimulator = () => {
  const {
    transcript,
    setTranscript,
    query,
    setQuery,
    memoryCleared,
    transcriptLength,
    setTranscriptLength,
    memoryRetention,
    setMemoryRetention,
    querySpecificity,
    setQuerySpecificity,
    isLoading,
    results,
    activeTab,
    setActiveTab,
    handleLoadSample,
    handleClearMemory,
    handleResetMemory,
    handleRunTest,
  } = useMemoryRecall();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <MemoryControls
          transcriptLength={transcriptLength}
          setTranscriptLength={setTranscriptLength}
          memoryRetention={memoryRetention}
          setMemoryRetention={setMemoryRetention}
          querySpecificity={querySpecificity}
          setQuerySpecificity={setQuerySpecificity}
          memoryCleared={memoryCleared}
          onClearMemory={handleClearMemory}
          onResetMemory={handleResetMemory}
          onLoadSample={handleLoadSample}
          onRunTest={handleRunTest}
          isLoading={isLoading}
        />
        
        {/* Main Content Panel */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 bg-slate-700">
              <TabsTrigger value="transcript">Transcript & Query</TabsTrigger>
              <TabsTrigger value="results">Test Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transcript" className="p-6">
              <TranscriptPanel
                transcript={transcript}
                setTranscript={setTranscript}
                query={query}
                setQuery={setQuery}
              />
            </TabsContent>
            
            <TabsContent value="results" className="p-6">
              <ResultsPanel results={results} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default MemoryRecallTestSimulator;
