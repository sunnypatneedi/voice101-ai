
import { CarouselItem } from "../../lib/carousel/types";

// Function to get the route path based on simulator title
export const getSimulatorPath = (title: string): string => {
  const pathMap: Record<string, string> = {
    "QuickTalk Transcriber": "/simulator-studio/quick-talk-transcriber",
    "StoryVoice Maker": "/simulator-studio/story-voice-maker",
    "SeniorCare Reminder": "/simulator-studio/senior-care-reminder",
    "Voice Assistant Tester": "/simulator-studio/voice-assistant-tester",
    "Pronunciation Coach": "/simulator-studio/pronunciation-coach",
    "Meeting Summarizer": "/simulator-studio/meeting-summarizer",
    "Speech Emotion Detector": "/simulator-studio/speech-emotion-detector",
    "Latency Tuner": "/simulator-studio/latency-tuner",
    "Turn Detector": "/simulator-studio/turn-detector",
    "Interruption Handler": "/simulator-studio/interruption-handler",
    "Context Drift Simulator": "/simulator-studio/context-drift-simulator",
    "Memory Recall Test": "/simulator-studio/memory-recall-test",
    "Legacy Fallback Gate": "/simulator-studio/legacy-fallback-gate",
    "Noise Robustness Tester": "/simulator-studio/noise-robustness-tester",
    "Multi-Speaker Mixer": "/simulator-studio/multi-speaker-mixer",
  };
  
  return pathMap[title] || "#";
};

// Function to get control labels for each simulator
export const getControlLabels = (title: string): string[] => {
  const controlMap: Record<string, string[]> = {
    "QuickTalk Transcriber": ["Audio Length", "Noise Filtering", "Accuracy Level"],
    "StoryVoice Maker": ["Story Template", "Voice Character", "Background Effects"],
    "SeniorCare Reminder": ["Reminder Time", "Confirmation Mode", "Speech Rate (range [0.5, 2.0])"],
    "Voice Assistant Tester": ["Command Type", "Response Format", "Error Handling"],
    "Pronunciation Coach": ["Accent Type", "Difficulty Level", "Practice Mode"],
    "Meeting Summarizer": ["Compression Ratio", "Format Style", "Speaker Labels"],
    "Speech Emotion Detector": ["Sensitivity Level", "Emotion Categories", "Analysis Window"],
    "Latency Tuner": ["Delay Amount (0-1000ms)", "Pipeline Stage", "Feedback Type"],
    "Turn Detector": ["VAD Threshold", "Silence Duration", "Overlap Tolerance"],
    "Interruption Handler": ["TTS Length", "Interruption Timing", "Fallback Mode"],
    "Context Drift Simulator": ["Context Length (0-5 turns)", "Topic Complexity", "Response Detail"],
    "Memory Recall Test": ["Transcript Length", "Memory Retention", "Query Specificity"],
    "Legacy Fallback Gate": ["Rule Confidence", "LLM Confidence", "Fallback Priority"],
    "Noise Robustness Tester": ["Noise Level (SNR)", "Noise Type", "Audio Quality"],
    "Multi-Speaker Mixer": ["Speaker Count (2-4)", "Diarization Mode", "Overlap Percentage"],
  };
  
  return controlMap[title] || [];
};
