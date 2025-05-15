import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BookLayout from '@/components/BookLayout';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "@/features/simulator-studio/pages/Index";
import NotFound from "@/features/simulator-studio/pages/NotFound";
import QuickTalkTranscriber from "@/features/simulator-studio/pages/QuickTalkTranscriber";
import StoryVoiceMaker from "@/features/simulator-studio/pages/StoryVoiceMaker";
import SeniorCareReminder from "@/features/simulator-studio/pages/SeniorCareReminder";
import VoiceAssistantTesterPage from "@/features/simulator-studio/pages/VoiceAssistantTester";
import PronunciationCoachPage from "@/features/simulator-studio/pages/PronunciationCoach";
import MeetingSummarizerPage from "@/features/simulator-studio/pages/MeetingSummarizer";
import LatencyTunerPage from "@/features/simulator-studio/pages/LatencyTuner";
import TurnDetectorPage from "@/features/simulator-studio/pages/TurnDetector";
import SpeechEmotionDetector from "@/features/simulator-studio/pages/SpeechEmotionDetector";
import MultiSpeakerMixer from "@/features/simulator-studio/pages/MultiSpeakerMixer";
import MemoryRecallTest from "@/features/simulator-studio/pages/MemoryRecallTest";
import VoiceAIFaqPage from "@/features/simulator-studio/pages/VoiceAIFaqPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const SimulatorStudio = () => {
  return (
    <BookLayout title="Simulator Studio">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </div>
      
      <div className="prose max-w-none">
        <p className="text-lg text-foreground/80 mb-8">
          Experiment with interactive Voice AI components and see them in action. 
          Test different configurations and see real-time results.
        </p>
        
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route index element={<Index />} />
            <Route path="quick-talk-transcriber" element={<QuickTalkTranscriber />} />
            <Route path="story-voice-maker" element={<StoryVoiceMaker />} />
            <Route path="senior-care-reminder" element={<SeniorCareReminder />} />
            <Route path="voice-assistant-tester" element={<VoiceAssistantTesterPage />} />
            <Route path="pronunciation-coach" element={<PronunciationCoachPage />} />
            <Route path="meeting-summarizer" element={<MeetingSummarizerPage />} />
            <Route path="speech-emotion-detector" element={<SpeechEmotionDetector />} />
            <Route path="latency-tuner" element={<LatencyTunerPage />} />
            <Route path="turn-detector" element={<TurnDetectorPage />} />
            <Route path="multi-speaker-mixer" element={<MultiSpeakerMixer />} />
            <Route path="memory-recall-test" element={<MemoryRecallTest />} />
            <Route path="voice-ai-faq" element={<VoiceAIFaqPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </div>
    </BookLayout>
  );
};

export default SimulatorStudio;
