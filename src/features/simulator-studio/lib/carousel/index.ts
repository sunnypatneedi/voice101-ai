
import { CarouselItem } from "./types";
import { quickTalkTranscriber, meetingSummarizer, multiSpeakerMixer } from "./transcription-simulators";
import { storyVoiceMaker, seniorCareReminder, pronunciationCoach, speechEmotionDetector } from "./voice-simulators";
import { voiceAssistantTester, contextDriftSimulator, memoryRecallTest, legacyFallbackGate } from "./assistant-simulators";
import { latencyTuner, turnDetector, interruptionHandler, noiseRobustnessTester } from "./technical-simulators";

// Use 'export type' instead of just 'export' for the type
export type { CarouselItem } from "./types";

export const carouselData: CarouselItem[] = [
  quickTalkTranscriber,
  storyVoiceMaker,
  seniorCareReminder,
  voiceAssistantTester,
  pronunciationCoach,
  meetingSummarizer,
  speechEmotionDetector,
  latencyTuner,
  turnDetector,
  interruptionHandler,
  contextDriftSimulator,
  memoryRecallTest,
  legacyFallbackGate,
  noiseRobustnessTester,
  multiSpeakerMixer,
];

// Export individual items for direct access
export {
  quickTalkTranscriber,
  storyVoiceMaker,
  seniorCareReminder,
  voiceAssistantTester,
  pronunciationCoach,
  meetingSummarizer,
  speechEmotionDetector,
  latencyTuner,
  turnDetector,
  interruptionHandler,
  contextDriftSimulator,
  memoryRecallTest,
  legacyFallbackGate,
  noiseRobustnessTester,
  multiSpeakerMixer
};
