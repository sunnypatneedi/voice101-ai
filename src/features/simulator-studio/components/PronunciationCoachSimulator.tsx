
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { usePronunciationCoach, BreakdownLevel } from "../../hooks/usePronunciationCoach";
import PhraseSelection from "./pronunciation-coach/PhraseSelection";
import BreakdownSelector from "./pronunciation-coach/BreakdownSelector";
import SpeedControl from "./pronunciation-coach/SpeedControl";
import RecordingControls from "./pronunciation-coach/RecordingControls";
import PronunciationBreakdown from "./pronunciation-coach/PronunciationBreakdown";
import ProgressChart from "./pronunciation-coach/ProgressChart";

const PHRASES = ["Hello World", "She Sells Seashells"];
const BREAKDOWN_LEVELS: BreakdownLevel[] = ["Word", "Phoneme"];

const PronunciationCoachSimulator: React.FC = () => {
  const [selectedPhrase, setSelectedPhrase] = useState<string>(PHRASES[0]);
  const [breakdownLevel, setBreakdownLevel] = useState<BreakdownLevel>("Word");
  const [demoSpeed, setDemoSpeed] = useState<number>(1.0);

  const { 
    isRecording, 
    isPracticing, 
    isLoading,
    overallScore, 
    breakdown, 
    sessionHistory,
    toggleRecording, 
    startPractice 
  } = usePronunciationCoach({
    selectedPhrase,
    breakdownLevel,
    demoSpeed
  });

  const handleSpeedChange = (value: number[]) => {
    setDemoSpeed(value[0]);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Pronunciation Coach</h1>
        <p className="text-center text-slate-300 mb-6">
          Record a phrase, get feedback, and track your improvement
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <Card className="shadow-md border-slate-700 bg-slate-800 text-white">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
            <CardTitle className="text-slate-200">Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <PhraseSelection
              selectedPhrase={selectedPhrase}
              setSelectedPhrase={setSelectedPhrase}
              phrases={PHRASES}
            />

            <BreakdownSelector
              breakdownLevel={breakdownLevel}
              setBreakdownLevel={setBreakdownLevel}
              breakdownLevels={BREAKDOWN_LEVELS}
            />

            <SpeedControl
              demoSpeed={demoSpeed}
              handleSpeedChange={handleSpeedChange}
            />

            <RecordingControls
              isRecording={isRecording}
              isPracticing={isPracticing}
              isLoading={isLoading}
              toggleRecording={toggleRecording}
              startPractice={startPractice}
            />
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="shadow-md border-slate-700 bg-slate-800 text-white">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
            <CardTitle className="text-slate-200">
              {overallScore !== null
                ? `Score: ${overallScore}/100`
                : "Results"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PronunciationBreakdown
              breakdown={breakdown}
              isLoading={isLoading}
              overallScore={overallScore}
              breakdownLevel={breakdownLevel}
            />
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <ProgressChart sessionHistory={sessionHistory} />
    </div>
  );
};

export default PronunciationCoachSimulator;
