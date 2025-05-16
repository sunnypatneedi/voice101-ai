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
    <QueryClientProvider client={queryClient}>
      <BookLayout title="Simulator Studio (Beta)">
        <div className="container py-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Beta Preview</h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>This studio is a work in progress as we're still figuring out how to best make these use cases functional. We welcome all feedback and contributions to improve these tools.</p>
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="prose max-w-none">
            <p className="text-lg text-foreground/80 mb-8">
              Experiment with interactive Voice AI components and see them in action. 
              Test different configurations and see real-time results.
            </p>
            
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
          </div>
        </div>
      </BookLayout>
    </QueryClientProvider>
  );
};

export default SimulatorStudio;
