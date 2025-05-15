
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export type PronunciationBreakdown = {
  word: string;
  score: number;
  phonemes?: { phoneme: string; score: number }[];
};

export type PronunciationSession = {
  date: string;
  phrase: string;
  score: number;
};

export type BreakdownLevel = "Word" | "Phoneme";

interface PronunciationCoachProps {
  selectedPhrase: string;
  breakdownLevel: BreakdownLevel;
  demoSpeed: number;
}

export function usePronunciationCoach({
  selectedPhrase,
  breakdownLevel,
  demoSpeed,
}: PronunciationCoachProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<PronunciationBreakdown[]>([]);
  const [sessionHistory, setSessionHistory] = useState<PronunciationSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load session history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("pronunciationHistory");
    if (savedHistory) {
      try {
        setSessionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse session history:", e);
        localStorage.removeItem("pronunciationHistory");
      }
    }
  }, []);

  // Save session history to localStorage when it changes
  useEffect(() => {
    if (sessionHistory.length > 0) {
      localStorage.setItem("pronunciationHistory", JSON.stringify(sessionHistory));
    }
  }, [sessionHistory]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    toast.info("Recording started...");
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsLoading(true);
    
    // Simulate API call with random delay
    setTimeout(() => {
      analyzeRecording();
    }, Math.random() * 400 + 200); // 200-600ms delay
  }, []);

  const analyzeRecording = useCallback(() => {
    // In a real implementation, this would send the audio to an API
    // Here we'll simulate the response with realistic data
    
    // Generate a random overall score between 50-95
    const score = Math.floor(Math.random() * 46) + 50;
    setOverallScore(score);
    
    // Generate word-by-word or phoneme-level breakdown
    const words = selectedPhrase.split(" ");
    const newBreakdown: PronunciationBreakdown[] = words.map(word => {
      const wordScore = Math.floor(Math.random() * 46) + 50;
      
      // If breakdown level is Phoneme, add phoneme details
      if (breakdownLevel === "Phoneme") {
        const phonemes = word.split("").map(letter => {
          return {
            phoneme: letter,
            score: Math.floor(Math.random() * 46) + 50
          };
        });
        
        return {
          word,
          score: wordScore,
          phonemes
        };
      }
      
      return {
        word,
        score: wordScore
      };
    });
    
    setBreakdown(newBreakdown);
    
    // Add to session history
    const newSession = {
      date: new Date().toISOString(),
      phrase: selectedPhrase,
      score
    };
    
    setSessionHistory(prev => [...prev, newSession]);
    setIsLoading(false);
    toast.success("Analysis complete!");
  }, [selectedPhrase, breakdownLevel]);

  const startPractice = useCallback(() => {
    setIsPracticing(true);
    toast.info(`Playing phrase at ${demoSpeed}x speed...`);
    
    // Simulate TTS playback
    setTimeout(() => {
      toast.info("Now repeat the phrase...");
      setIsPracticing(false);
    }, 2000);
  }, [demoSpeed]);

  return {
    isRecording,
    isPracticing,
    isLoading,
    overallScore,
    breakdown,
    sessionHistory,
    toggleRecording,
    startPractice
  };
}
