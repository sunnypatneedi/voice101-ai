
import { Toaster } from "../../components/ui/toaster";
import { Toaster as Sonner } from "../../components/ui/sonner";
import { TooltipProvider } from "../../components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuickTalkTranscriber from "./pages/QuickTalkTranscriber";
import StoryVoiceMaker from "./pages/StoryVoiceMaker";
import SeniorCareReminder from "./pages/SeniorCareReminder";
import VoiceAssistantTesterPage from "./pages/VoiceAssistantTester";
import PronunciationCoachPage from "./pages/PronunciationCoach";
import MeetingSummarizerPage from "./pages/MeetingSummarizer";
import LatencyTunerPage from "./pages/LatencyTuner";
import TurnDetectorPage from "./pages/TurnDetector";
import SpeechEmotionDetector from "./pages/SpeechEmotionDetector";
import MultiSpeakerMixer from "./pages/MultiSpeakerMixer";
import MemoryRecallTest from "./pages/MemoryRecallTest";
import VoiceAIFaqPage from "./pages/VoiceAIFaqPage";
import Footer from "./components/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // For better UX - prevent refetching when window regains focus
      retry: 1, // Only retry once for faster feedback
      staleTime: 30000, // Consider data fresh for 30 seconds to reduce unnecessary refetches
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton theme="dark" richColors />
      <AnimatePresence mode="wait">
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/quick-talk-transcriber" element={<QuickTalkTranscriber />} />
                <Route path="/story-voice-maker" element={<StoryVoiceMaker />} />
                <Route path="/senior-care-reminder" element={<SeniorCareReminder />} />
                <Route path="/voice-assistant-tester" element={<VoiceAssistantTesterPage />} />
                <Route path="/pronunciation-coach" element={<PronunciationCoachPage />} />
                <Route path="/meeting-summarizer" element={<MeetingSummarizerPage />} />
                <Route path="/speech-emotion-detector" element={<SpeechEmotionDetector />} />
                <Route path="/latency-tuner" element={<LatencyTunerPage />} />
                <Route path="/turn-detector" element={<TurnDetectorPage />} />
                <Route path="/multi-speaker-mixer" element={<MultiSpeakerMixer />} />
                <Route path="/memory-recall-test" element={<MemoryRecallTest />} />
                <Route path="/voice-ai-faq" element={<VoiceAIFaqPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AnimatePresence>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
