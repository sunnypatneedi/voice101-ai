
import { CarouselItem } from "./types";

export const voiceAssistantTester: CarouselItem = {
  title: "Voice Assistant Tester",
  tagline: "Evaluate voice assistant responses to common and edge-case queries",
  focusArea: "Voice assistant accuracy and understanding",
  inScope: [
    "Test voice commands with varying phrasing",
    "Evaluate response quality and accuracy",
    "Simulate different user contexts",
  ],
  outScope: [
    "Multi-turn conversation testing",
    "Multiple voice assistant comparison",
    "System-level integration",
  ],
};

export const contextDriftSimulator: CarouselItem = {
  title: "Context Drift Simulator",
  tagline: "Measure how well assistants maintain context over time",
  focusArea: "Contextual awareness in conversations",
  inScope: [
    "Track topic maintenance across turns",
    "Introduce tangential information",
    "Measure recall of earlier topics",
  ],
  outScope: [
    "Cross-session memory testing",
    "Adversarial context attacks",
    "Multi-user conversation simulation",
  ],
};

export const memoryRecallTest: CarouselItem = {
  title: "Memory Recall Test",
  tagline: "Test stateful memory over multi-turn dialogs",
  focusArea: "Long-term memory",
  inScope: [
    "Feed multi-minute transcript",
    "Clear memory toggle",
    "Query past details after delay",
    "Assess recall accuracy",
  ],
  outScope: [
    "Cross-session memory persistence",
    "Memory deletion verification",
    "Knowledge base integration testing",
  ],
};

export const legacyFallbackGate: CarouselItem = {
  title: "Legacy Fallback Gate",
  tagline: "Test graceful fallback to rule-based systems when needed",
  focusArea: "Hybrid system integration",
  inScope: [
    "Define confidence thresholds",
    "Compare rule vs LLM outputs",
    "Simulate ambiguous queries",
  ],
  outScope: [
    "Custom rule system creation",
    "Full dialog system integration",
    "Automatic rule generation",
  ],
};
