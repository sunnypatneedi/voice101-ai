import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import BookLayout from '@/components/BookLayout';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

// Lazy load all simulator components
const Index = lazy(() => import("@/features/simulator-studio/pages/Index"));
const NotFound = lazy(() => import("@/features/simulator-studio/pages/NotFound"));
const QuickTalkTranscriber = lazy(() => import("@/features/simulator-studio/pages/QuickTalkTranscriber"));
const StoryVoiceMaker = lazy(() => import("@/features/simulator-studio/pages/StoryVoiceMaker"));
const SeniorCareReminder = lazy(() => import("@/features/simulator-studio/pages/SeniorCareReminder"));
const VoiceAssistantTesterPage = lazy(() => import("@/features/simulator-studio/pages/VoiceAssistantTester"));
const PronunciationCoachPage = lazy(() => import("@/features/simulator-studio/pages/PronunciationCoach"));
const MeetingSummarizerPage = lazy(() => import("@/features/simulator-studio/pages/MeetingSummarizer"));
const LatencyTunerPage = lazy(() => import("@/features/simulator-studio/pages/LatencyTuner"));
const TurnDetectorPage = lazy(() => import("@/features/simulator-studio/pages/TurnDetector"));
const SpeechEmotionDetector = lazy(() => import("@/features/simulator-studio/pages/SpeechEmotionDetector"));
const MultiSpeakerMixer = lazy(() => import("@/features/simulator-studio/pages/MultiSpeakerMixer"));
const MemoryRecallTest = lazy(() => import("@/features/simulator-studio/pages/MemoryRecallTest"));
const VoiceAIFaqPage = lazy(() => import("@/features/simulator-studio/pages/VoiceAIFaqPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Loading component for Suspense fallback
const SimulatorLoading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

const SimulatorStudio = () => {
  return (
    <BookLayout title="Simulator Studio">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </div>
      
      <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Beta Preview</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>This studio is a work in progress as we're still figuring out how to best make these use cases functional. We welcome all feedback and contributions to improve these tools.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="prose max-w-none">
        <p className="text-lg text-foreground/80 mb-8">
          Experiment with interactive Voice AI components and see them in action. 
          Test different configurations and see real-time results.
        </p>
        
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<SimulatorLoading />}>
            <Routes>
              <Route index element={<Index />} />
              <Route path="quick-talk-transcriber" element={<QuickTalkTranscriber />} />
              <Route path="story-voice-maker" element={<StoryVoiceMaker />} />
              <Route path="senior-care-reminder" element={<SeniorCareReminder />} />
              <Route path="voice-assistant-tester" element={<VoiceAssistantTesterPage />} />
              <Route path="pronunciation-coach" element={<PronunciationCoachPage />} />
              <Route path="meeting-summarizer" element={<MeetingSummarizerPage />} />
              <Route path="latency-tuner" element={<LatencyTunerPage />} />
              <Route path="turn-detector" element={<TurnDetectorPage />} />
              <Route path="speech-emotion-detector" element={<SpeechEmotionDetector />} />
              <Route path="interruption-handler" element={<div>Interruption Handler Simulator</div>} />
              <Route path="context-drift-simulator" element={<div>Context Drift Simulator</div>} />
              <Route path="legacy-fallback-gate" element={<div>Legacy Fallback Gate Simulator</div>} />
              <Route path="noise-robustness-tester" element={<div>Noise Robustness Tester</div>} />
              <Route path="multi-speaker-mixer" element={<MultiSpeakerMixer />} />
              <Route path="memory-recall-test" element={<MemoryRecallTest />} />
              <Route path="voice-ai-faq" element={<VoiceAIFaqPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </div>
    </BookLayout>
  );
};

export default SimulatorStudio;
