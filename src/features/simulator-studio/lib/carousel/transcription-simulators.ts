
import { CarouselItem } from "./types";

export const quickTalkTranscriber: CarouselItem = {
  title: "QuickTalk Transcriber",
  tagline: "Convert voice notes to text quickly and accurately",
  focusArea: "Speech-to-text transcription",
  inScope: [
    "Short audio processing (30s)",
    "Basic noise filtering",
    "Accuracy optimization settings",
    "Transcription results display",
  ],
  outScope: [
    "Long-form transcription",
    "Real-time transcription",
    "Multiple speaker detection",
    "Language translation",
  ],
};

export const meetingSummarizer: CarouselItem = {
  title: "Meeting Summarizer",
  tagline: "Convert meeting recordings into concise summaries",
  focusArea: "Audio summarization",
  inScope: [
    "Key point extraction",
    "Action item identification",
    "Speaker labeling",
    "Summary format options",
  ],
  outScope: [
    "Real-time summarization",
    "Video processing",
    "Calendar integration",
    "Task assignment",
  ],
};

export const multiSpeakerMixer: CarouselItem = {
  title: "Multi-Speaker Mixer",
  tagline: "Evaluate speaker tagging on mixed audio",
  focusArea: "Speaker diarization",
  inScope: [
    "Upload 2-4 speaker tracks",
    "Toggle diarization on/off",
    "Display speaker labels on transcript",
    "Visualize speaker segments",
  ],
  outScope: [
    "True diarization algorithms",
    "Voice authentication",
    "Speaker recognition",
    "Multi-channel recording",
  ],
};
