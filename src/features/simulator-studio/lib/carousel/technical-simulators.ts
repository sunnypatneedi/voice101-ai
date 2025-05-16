
import { CarouselItem } from "./types";

export const latencyTuner: CarouselItem = {
  title: "Latency Tuner",
  tagline: "Teach impact of pipeline delay on user experience",
  focusArea: "End-to-end delay",
  inScope: [
    "Adjust end-to-end delay slider (0-1000ms)",
    "Simulate STT→LLM→TTS delays",
    "Display response time metrics",
    "Compare delay perceptions",
  ],
  outScope: [
    "Real network latency",
    "Adaptive streaming",
    "Hardware optimization",
    "Complex benchmarks",
  ],
};

export const turnDetector: CarouselItem = {
  title: "Turn Detector",
  tagline: "Practice tuning voice activity detection thresholds",
  focusArea: "Turn-taking",
  inScope: [
    "Upload overlapping audio clips",
    "Adjust VAD threshold",
    "Highlight detected turns in transcript",
    "Visualize speech segments",
  ],
  outScope: [
    "Full speaker diarization",
    "Real-time streaming",
    "Voice recognition",
    "Audio generation",
  ],
};

export const interruptionHandler: CarouselItem = {
  title: "Interruption Handler",
  tagline: "Handle mid-utterance cancellations gracefully",
  focusArea: "Mid-utterance interrupts",
  inScope: [
    "Play lengthy TTS output",
    "Stop button to interrupt",
    "Show fallback prompt on stop",
    "Analyze response timing",
  ],
  outScope: [
    "Multi-turn dialogue UI",
    "Complex chat flows",
    "Custom voice generation",
    "Voice cloning",
  ],
};

export const noiseRobustnessTester: CarouselItem = {
  title: "Noise Robustness Tester",
  tagline: "Measure ASR under varied noise conditions",
  focusArea: "Environmental noise",
  inScope: [
    "Slider for 0-40 dB SNR",
    "Inject white noise into audio",
    "Display STT word-error rates",
    "Compare clarity metrics",
  ],
  outScope: [
    "Adaptive noise suppression",
    "Offline profiling",
    "Custom noise models",
    "Voice enhancement",
  ],
};
