
interface FAQ {
  question: string;
  answer: string;
}

export interface CategoryData {
  title: string;
  insight?: string;
  faqs: FAQ[];
}

export type FAQDataType = Record<string, CategoryData>;

export const faqData: FAQDataType = {
  'pronunciation': {
    title: 'Pronunciation & Formatting',
    insight: 'Regex → SSML rewrite layer with cached pronunciation dictionary beats provider defaults.',
    faqs: [
      {
        question: 'How will numbers be chunked to avoid "one-hundred-twenty-three" confusion?',
        answer: 'Use specific number formatting rules with SSML tags to control chunking. For example, split large numbers into groups or use currency/date formatting to ensure natural pronunciation.'
      },
      {
        question: 'Who normalizes dots, slashes, "@" in URLs and emails before speech?',
        answer: 'A text normalization layer should preprocess text before TTS, converting symbols to spoken equivalents. This responsibility typically falls on your middleware, not the TTS provider.'
      },
      {
        question: 'Can SSML phonemes auto-correct brand names across releases?',
        answer: 'Yes, maintain a pronunciation dictionary with SSML phoneme tags for brand names and technical terms. This ensures consistent pronunciation across TTS engine updates.'
      }
    ]
  },
  'latency': {
    title: 'Latency & Turn-Taking',
    insight: 'Co-locate STT-LLM-TTS and tune VAD thresholds per scenario.',
    faqs: [
      {
        question: 'Is voice-to-voice p95 latency < 800 ms under peak load?',
        answer: 'Optimal voice systems should target sub-800ms p95 latency. This requires optimized audio processing pipelines, efficient model loading, and proper infrastructure scaling.'
      },
      {
        question: 'What silence length triggers bot reply versus mid-sentence pause?',
        answer: 'Configure VAD (Voice Activity Detection) thresholds based on context. Typically 700-1000ms silence signals turn completion, while shorter pauses (300-500ms) are treated as mid-sentence breaks.'
      },
      {
        question: 'How quickly does barge-in cancel TTS (< 100 ms)?',
        answer: 'Effective barge-in systems should cancel TTS within 100ms of user speech detection. This requires client-side detection and immediate server notification to stop audio streaming.'
      }
    ]
  },
  'transcription': {
    title: 'Transcription Accuracy',
    insight: 'Contextual prompts plus speaker-diarization filters cut error rates sharply.',
    faqs: [
      {
        question: 'Which STT engine yields lowest WER for target accents?',
        answer: 'This varies by language and accent. Benchmark multiple providers with your actual user demographics. Domain-specific engines often outperform general ones for specific accents.'
      },
      {
        question: 'Are domain keywords included in STT boost list?',
        answer: 'Domain-specific terminology should be added to customization lists in your STT engine. This improves recognition for industry jargon, product names, and technical terms.'
      },
      {
        question: 'Do we isolate speakers to reduce crosstalk errors?',
        answer: 'Speaker diarization helps distinguish between speakers in multi-party conversations, significantly reducing transcription errors in group settings.'
      }
    ]
  },
  'tts': {
    title: 'Text-to-Speech Quality',
    insight: 'Version-pinned, steerable TTS with phoneme hints protects branded terms.',
    faqs: [
      {
        question: 'Which voices deliver < 200 ms time-to-first-byte in prod?',
        answer: 'Edge-deployed, optimized voices typically offer the best TTFB. Non-neural voices are faster but less natural. Test specific providers in your deployment environment for accurate metrics.'
      },
      {
        question: 'Is word-level timestamping available for interrupt rollback?',
        answer: 'Modern TTS systems offer word or phoneme-level timestamps that enable precise playback resumption after interruptions. This feature is crucial for natural conversation flow.'
      },
      {
        question: 'Can tempo, emotion, pitch be steered per utterance?',
        answer: 'Advanced TTS engines support SSML tags for controlling speech parameters dynamically. Some newer models also support emotional styling through prompt engineering or dedicated tags.'
      }
    ]
  },
  'network': {
    title: 'Network Transport',
    insight: 'Edge-routed WebRTC drops median RTT ~25 ms over public TCP paths.',
    faqs: [
      {
        question: 'Will clients default to WebRTC with WebSocket fallback?',
        answer: 'This hybrid approach maximizes quality and reliability. WebRTC offers lower latency and better audio quality, while WebSockets provide broader compatibility and firewall traversal.'
      },
      {
        question: 'How is jitter smoothed to keep Opus stream glitch-free?',
        answer: 'Implement adaptive jitter buffers that dynamically adjust based on network conditions. Pair with packet loss concealment and forward error correction for robust audio delivery.'
      }
    ]
  },
  'scaling': {
    title: 'Cold Starts & Scaling',
    insight: 'Predictive autoscaling and long drain times prevent session drops.',
    faqs: [
      {
        question: 'How many warm pods hold connect time below 5 s?',
        answer: 'Calculate based on peak concurrent users and session distribution. Keep enough warm instances to handle ~110% of typical load, with autoscaling triggered before reaching capacity.'
      },
      {
        question: 'Are models pre-loaded to avoid GPU spin-up stalls?',
        answer: 'Pre-warm models in memory and use model caching strategies. Consider smaller, specialized models when latency is critical versus larger, more capable models for complex interactions.'
      }
    ]
  },
  'function': {
    title: 'Function Calling & Workflow',
    insight: 'Insert "working" speech frames and placeholder messages until function completes.',
    faqs: [
      {
        question: 'Do prompts cap simultaneous tool calls to stop thrashing?',
        answer: 'Limit concurrent function calls in the LLM prompt design. Use sequential processing for complex workflows and implement timeouts to prevent hanging on failed calls.'
      },
      {
        question: 'How are async results surfaced without dead air?',
        answer: 'Implement conversational fillers like \'Let me check that...\' with progress updates. For longer operations, provide partial information while waiting for complete results.'
      }
    ]
  },
  'cost': {
    title: 'Cost Management',
    insight: 'Voice characters dominate cost; negotiate committed-use tiers early.',
    faqs: [
      {
        question: 'Which component now exceeds 30 % of per-minute spend?',
        answer: 'Monitor cost allocation across STT, LLM inference, and TTS. Often, LLM inference becomes the largest cost center as usage scales. Use model distillation and caching to optimize.'
      },
      {
        question: 'Is response caching enabled for repeated prompts and search hits?',
        answer: 'Implement semantic caching for similar queries and exact caching for repeated inputs. This significantly reduces costs for common interactions and informational queries.'
      }
    ]
  },
  'evaluation': {
    title: 'Evaluation & Monitoring',
    insight: 'Dashboards plus monthly waveform spot-checks catch regressions fast.',
    faqs: [
      {
        question: 'Which latency, WER, interruption thresholds trigger on-call alerts?',
        answer: 'Set p95 latency thresholds (typically 1-2s), WER increases (>5% above baseline), and failed interruption rates (>10%) as alert triggers. Adjust based on application criticality.'
      },
      {
        question: 'Do eval suites cover multi-turn flows with tool calls?',
        answer: 'Comprehensive testing should include end-to-end conversation flows with tool integration. Automate evaluation of turn completion, contextual understanding, and task success rates.'
      }
    ]
  },
  'interruptions': {
    title: 'Interruptions & Error Recovery',
    insight: 'Debounce interim transcripts 500 ms; map "start over" to soft context reset.',
    faqs: [
      {
        question: 'How are duplicate "hello" events debounced?',
        answer: 'Implement client-side acoustic echo cancellation and server-side duplicate detection with a short-term (3-5s) cooldown period for identical wake phrases or commands.'
      },
      {
        question: 'What phrase restarts context after ASR failure?',
        answer: 'Design explicit reset commands (\'let\'s start over\') and implicit recovery (\'I didn\'t catch that, let\'s try again\'). Maintain context unless explicitly requested to reset.'
      }
    ]
  },
  'compliance': {
    title: 'Compliance & Data Privacy',
    insight: 'In-region STT/TTS containers and token-level redaction simplify HIPAA/GDPR.',
    faqs: [
      {
        question: 'Are transcripts stored encrypted with PII redacted?',
        answer: 'Implement end-to-end encryption for all voice data and automated PII detection and redaction before storage. Define clear data retention policies aligned with regulatory requirements.'
      },
      {
        question: 'Which regions must audio remain for residency laws?',
        answer: 'Deploy in-region processing for data subject to GDPR (EU), LGPD (Brazil), PIPL (China), and other regional regulations. Use geo-fenced deployments and data localization controls.'
      }
    ]
  },
  'multilingual': {
    title: 'Multilingual & Localization',
    insight: 'Maintain language-specific prompt templates; reload voice config on detection.',
    faqs: [
      {
        question: 'How is language auto-detected and switched mid-call?',
        answer: 'Use language identification models on the first few utterances. For mid-conversation switching, monitor language confidence scores and confirm language changes before switching system behavior.'
      },
      {
        question: 'Can prompts and voices swap seamlessly per language flag?',
        answer: 'Design language-specific prompt templates and voice configurations that can be hot-swapped based on detected language. Maintain consistent persona characteristics across languages.'
      }
    ]
  }
};
