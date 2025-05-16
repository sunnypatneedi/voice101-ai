
export interface FaqQuestion {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  questions: FaqQuestion[];
  insight: string; // Insight at the category level
}

export const faqCategories: FaqCategory[] = [
  {
    title: "Pronunciation & Formatting",
    insight: "Regex → SSML rewrite layer with cached pronunciation dictionary beats provider defaults.",
    questions: [
      {
        question: "How will numbers be chunked to avoid \"one-hundred-twenty-three\" confusion?",
        answer: "Use specific number formatting rules with SSML tags to control chunking. For example, split large numbers into groups or use currency/date formatting to ensure natural pronunciation."
      },
      {
        question: "Who normalizes dots, slashes, \"@\" in URLs and emails before speech?",
        answer: "A text normalization layer should preprocess text before TTS, converting symbols to spoken equivalents. This responsibility typically falls on your middleware, not the TTS provider."
      },
      {
        question: "Can SSML phonemes auto-correct brand names across releases?",
        answer: "Yes, maintain a pronunciation dictionary with SSML phoneme tags for brand names and technical terms. This ensures consistent pronunciation across TTS engine updates."
      }
    ]
  },
  {
    title: "Latency & Turn-Taking",
    insight: "Co-locate STT-LLM-TTS and tune VAD thresholds per scenario.",
    questions: [
      {
        question: "Is voice-to-voice p95 latency < 800 ms under peak load?",
        answer: "Optimal voice systems should target sub-800ms p95 latency. This requires optimized audio processing pipelines, efficient model loading, and proper infrastructure scaling."
      },
      {
        question: "What silence length triggers bot reply versus mid-sentence pause?",
        answer: "Configure VAD (Voice Activity Detection) thresholds based on context. Typically 700-1000ms silence signals turn completion, while shorter pauses (300-500ms) are treated as mid-sentence breaks."
      },
      {
        question: "How quickly does barge-in cancel TTS (< 100 ms)?",
        answer: "Effective barge-in systems should cancel TTS within 100ms of user speech detection. This requires client-side detection and immediate server notification to stop audio streaming."
      }
    ]
  },
  {
    title: "Transcription Accuracy",
    insight: "Contextual prompts plus speaker-diarization filters cut error rates sharply.",
    questions: [
      {
        question: "Which STT engine yields lowest WER for target accents?",
        answer: "This varies by language and accent. Benchmark multiple providers with your actual user demographics. Domain-specific engines often outperform general ones for specific accents."
      },
      {
        question: "Are domain keywords included in STT boost list?",
        answer: "Domain-specific terminology should be added to customization lists in your STT engine. This improves recognition for industry jargon, product names, and technical terms."
      },
      {
        question: "Do we isolate speakers to reduce crosstalk errors?",
        answer: "Speaker diarization helps distinguish between speakers in multi-party conversations, significantly reducing transcription errors in group settings."
      }
    ]
  },
  {
    title: "Text-to-Speech Quality",
    insight: "Version-pinned, steerable TTS with phoneme hints protects branded terms.",
    questions: [
      {
        question: "Which voices deliver < 200 ms time-to-first-byte in prod?",
        answer: "Edge-deployed, optimized voices typically offer the best TTFB. Non-neural voices are faster but less natural. Test specific providers in your deployment environment for accurate metrics."
      },
      {
        question: "Is word-level timestamping available for interrupt rollback?",
        answer: "Modern TTS systems offer word or phoneme-level timestamps that enable precise playback resumption after interruptions. This feature is crucial for natural conversation flow."
      },
      {
        question: "Can tempo, emotion, pitch be steered per utterance?",
        answer: "Advanced TTS engines support SSML tags for controlling speech parameters dynamically. Some newer models also support emotional styling through prompt engineering or dedicated tags."
      }
    ]
  },
  {
    title: "Network Transport",
    insight: "Edge-routed WebRTC drops median RTT ~25 ms over public TCP paths.",
    questions: [
      {
        question: "Will clients default to WebRTC with WebSocket fallback?",
        answer: "This hybrid approach maximizes quality and reliability. WebRTC offers lower latency and better audio quality, while WebSockets provide broader compatibility and firewall traversal."
      },
      {
        question: "How is jitter smoothed to keep Opus stream glitch-free?",
        answer: "Implement adaptive jitter buffers that dynamically adjust based on network conditions. Pair with packet loss concealment and forward error correction for robust audio delivery."
      }
    ]
  },
  {
    title: "Cold Starts & Scaling",
    insight: "Predictive autoscaling and long drain times prevent session drops.",
    questions: [
      {
        question: "How many warm pods hold connect time below 5 s?",
        answer: "Calculate based on peak concurrent users and session distribution. Keep enough warm instances to handle ~110% of typical load, with autoscaling triggered before reaching capacity."
      },
      {
        question: "Are models pre-loaded to avoid GPU spin-up stalls?",
        answer: "Pre-warm models in memory and use model caching strategies. Consider smaller, specialized models when latency is critical versus larger, more capable models for complex interactions."
      }
    ]
  },
  {
    title: "Function Calling & Workflow",
    insight: "Insert \"working\" speech frames and placeholder messages until function completes.",
    questions: [
      {
        question: "Do prompts cap simultaneous tool calls to stop thrashing?",
        answer: "Limit concurrent function calls in the LLM prompt design. Use sequential processing for complex workflows and implement timeouts to prevent hanging on failed calls."
      },
      {
        question: "How are async results surfaced without dead air?",
        answer: "Implement conversational fillers like 'Let me check that...' with progress updates. For longer operations, provide partial information while waiting for complete results."
      }
    ]
  },
  {
    title: "Cost Management",
    insight: "Voice characters dominate cost; negotiate committed-use tiers early.",
    questions: [
      {
        question: "Which component now exceeds 30 % of per-minute spend?",
        answer: "Monitor cost allocation across STT, LLM inference, and TTS. Often, LLM inference becomes the largest cost center as usage scales. Use model distillation and caching to optimize."
      },
      {
        question: "Is response caching enabled for repeated prompts and search hits?",
        answer: "Implement semantic caching for similar queries and exact caching for repeated inputs. This significantly reduces costs for common interactions and informational queries."
      }
    ]
  },
  {
    title: "Evaluation & Monitoring",
    insight: "Dashboards plus monthly waveform spot-checks catch regressions fast.",
    questions: [
      {
        question: "Which latency, WER, interruption thresholds trigger on-call alerts?",
        answer: "Set p95 latency thresholds (typically 1-2s), WER increases (>5% above baseline), and failed interruption rates (>10%) as alert triggers. Adjust based on application criticality."
      },
      {
        question: "Do eval suites cover multi-turn flows with tool calls?",
        answer: "Comprehensive testing should include end-to-end conversation flows with tool integration. Automate evaluation of turn completion, contextual understanding, and task success rates."
      }
    ]
  },
  {
    title: "Interruptions & Error Recovery",
    insight: "Debounce interim transcripts 500 ms; map \"start over\" to soft context reset.",
    questions: [
      {
        question: "How are duplicate \"hello\" events debounced?",
        answer: "Implement client-side acoustic echo cancellation and server-side duplicate detection with a short-term (3-5s) cooldown period for identical wake phrases or commands."
      },
      {
        question: "What phrase restarts context after ASR failure?",
        answer: "Design explicit reset commands ('let's start over') and implicit recovery ('I didn't catch that, let's try again'). Maintain context unless explicitly requested to reset."
      }
    ]
  },
  {
    title: "Compliance & Data Privacy",
    insight: "In-region STT/TTS containers and token-level redaction simplify HIPAA/GDPR.",
    questions: [
      {
        question: "Are transcripts stored encrypted with PII redacted?",
        answer: "Implement end-to-end encryption for all voice data and automated PII detection and redaction before storage. Define clear data retention policies aligned with regulatory requirements."
      },
      {
        question: "Which regions must audio remain for residency laws?",
        answer: "Deploy in-region processing for data subject to GDPR (EU), LGPD (Brazil), PIPL (China), and other regional regulations. Use geo-fenced deployments and data localization controls."
      }
    ]
  },
  {
    title: "Multilingual & Localization",
    insight: "Maintain language-specific prompt templates; reload voice config on detection.",
    questions: [
      {
        question: "How is language auto-detected and switched mid-call?",
        answer: "Use language identification models on the first few utterances. For mid-conversation switching, monitor language confidence scores and confirm language changes before switching system behavior."
      },
      {
        question: "Can prompts and voices swap seamlessly per language flag?",
        answer: "Design language-specific prompt templates and voice configurations that can be hot-swapped based on detected language. Maintain consistent persona characteristics across languages."
      }
    ]
  },
  {
    title: "Edge and Offline Deployments",
    insight: "Local models and one-way updates enable privacy-first, zero-latency experiences.",
    questions: [
      {
        question: "How can we run voice AI without an internet connection?",
        answer: "Deploy ASR and TTS models fully on-device so the assistant works offline, giving near-zero latency and keeping user data local."
      },
      {
        question: "What's the best way to update an AI model on isolated edge devices?",
        answer: "Use one-way updates: the device periodically downloads new model files when connectivity is available but never uploads user data, allowing improvements without cloud dependence."
      },
      {
        question: "How do edge deployments improve user privacy?",
        answer: "All speech processing stays on the device, meaning sensitive audio isn't streamed or stored on external servers (fewer points of compromise)."
      },
      {
        question: "How can we minimize latency in low-connectivity environments?",
        answer: "Run inference locally on the device; avoiding network round-trips yields ultra-low response times even with no network."
      },
      {
        question: "What optimizations let voice AI run on limited hardware?",
        answer: "Shrink models via quantization or pruning to fit memory/CPU constraints, and use efficient runtimes so small edge devices can handle speech tasks."
      }
    ]
  },
  {
    title: "Sensitive Use Cases - Healthcare, Education, and Children",
    insight: "Strict compliance and explicit consent frameworks are essential for vulnerable users.",
    questions: [
      {
        question: "How do we make a voice AI COPPA-compliant for kids under 13?",
        answer: "Avoid collecting personal info from children and don't retain their voice data beyond immediate transcription; if voice is only used as a substitute for typing and not stored, it falls under a COPPA exception (when in doubt, get verifiable parental consent)."
      },
      {
        question: "What are FERPA considerations for voice tech in schools?",
        answer: "Treat student voice recordings and transcripts as educational records: you likely need school or parental consent before use, and must secure that data against unauthorized access in compliance with FERPA."
      },
      {
        question: "How can voice assistants be HIPAA-compliant in healthcare?",
        answer: "Treat all spoken health information as PHI: use encryption and secure storage, process data locally or on HIPAA-certified servers, and ensure any cloud service has a Business Associate Agreement (otherwise, transmitting patient identifiers via a consumer voice assistant would violate HIPAA)."
      },
      {
        question: "How should GDPR affect voice AI design?",
        answer: "Build in privacy by design: obtain explicit user consent for audio recording, minimize data retention, let users access or delete their voice data on request, and never use voice data for undisclosed purposes (to meet GDPR transparency and rights requirements)."
      },
      {
        question: "How do we handle user consent in a voice-only interface?",
        answer: "Provide a brief spoken disclosure about data use at start, then ask the user to clearly agree (e.g. \"Do I have your permission to continue?\") and only proceed once you receive a confirmed \"yes\" or equivalent consent."
      },
      {
        question: "What safety measures protect children using voice AI?",
        answer: "Strictly filter out inappropriate content and behaviors, use age-appropriate responses, and include parental controls or notifications for any features that could pose risks (for example, disabling purchases or personal data sharing in kids' modes)."
      }
    ]
  },
  {
    title: "Model Training and Regressions",
    insight: "Diverse synthetic data and comprehensive regression testing protect quality.",
    questions: [
      {
        question: "How can synthetic data boost voice model training?",
        answer: "Generate artificial speech data (via TTS or voice conversion) to cover linguistic edge cases – this helps include accents, speaking styles, or languages that are scarce in real data, making the model more generalised and robust."
      },
      {
        question: "How do we ensure the model works for different accents and languages?",
        answer: "Include a diverse range of accents and languages in your training and test sets. It's a best practice to augment data for underrepresented dialects (even using synthetic augmentation) and evaluate the model separately on each locale to verify none are left behind."
      },
      {
        question: "How do we catch regressions when updating a voice model?",
        answer: "Maintain a fixed benchmark suite of test utterances with known expected outcomes and metrics (e.g. word error rate, intent accuracy). Before deploying a new model version, compare its results to the previous version's – any significant drop in performance on these consistent tests flags a regression."
      },
      {
        question: "How can we detect quality drift in a deployed voice system?",
        answer: "Continuously monitor live performance signals like ASR error rates, misunderstanding rates, or user frustration (e.g. repeated \"sorry?\" prompts). A steady upward creep in errors or user corrections over time can indicate data drift, prompting a review of recent inputs and perhaps model retraining."
      },
      {
        question: "What's the strategy to recover from a model quality drop?",
        answer: "Have a rollback plan to a known-good model if things go wrong. In parallel, use human-in-the-loop analysis on the failure cases to update your training data, then fine-tune or retrain the model on those cases. Incrementally test improvements offline until the quality returns to target before rolling out the fix."
      }
    ]
  },
  {
    title: "Evaluation Tooling and Human-in-the-Loop",
    insight: "Combine automated metrics and human review to catch issues early.",
    questions: [
      {
        question: "What should we monitor to ensure the voice assistant works properly?",
        answer: "Set up analytics to track key metrics: speech recognition confidence/error rates, response times, and user behaviors (like how often they have to repeat themselves or abort a task). Real-time dashboards and alerts on these metrics help catch issues early and guide tuning efforts."
      },
      {
        question: "How do we incorporate human-in-the-loop learning?",
        answer: "Regularly sample conversation logs (with user permission) and have human reviewers label errors or ambiguous cases. This could mean correcting ASR transcripts, tagging misunderstood intents, or flagging inappropriate responses – these human-labeled insights can then feed back into improving the next model iteration."
      },
      {
        question: "How can we QA a voice assistant's function-calling ability?",
        answer: "Write automated tests for scenarios where the assistant should invoke external functions or APIs (like booking an appointment or controlling a device). Simulate user requests for each function, then verify the assistant calls the correct API with proper parameters and handles the response (or errors) correctly in its reply."
      },
      {
        question: "How do we test the assistant's handling of interruptions (barge-in)?",
        answer: "Simulate user speech that talks over the AI's speech in mid-response. Your QA should confirm that the system detects the barge-in, immediately stops talking, listens to the user, and then appropriately addresses the new input or resumes the prior flow as needed."
      },
      {
        question: "What are best practices for error recovery testing?",
        answer: "Intentionally feed the system invalid or garbled inputs and verify it responds with a graceful fallback (like \"I'm sorry, can you rephrase that?\") rather than crashing or looping. Test that after such an error prompt, the user can successfully continue the conversation."
      },
      {
        question: "How do we ensure multi-turn conversations work as expected?",
        answer: "Create end-to-end test dialogues covering multiple turns, including context carryover and topic switches. For each test script, check that the assistant maintains context correctly (e.g. remembers names or choices mentioned earlier) or uses clarifying questions if the context is unclear, and that it can smoothly handle users changing the subject without confusion."
      }
    ]
  },
  {
    title: "UX and Voice Design",
    insight: "Voice persona consistency and multimodal integration create seamless experiences.",
    questions: [
      {
        question: "What's an ideal pacing for the AI's speech?",
        answer: "Use a natural conversational pace – not monotonic or too rushed. Insert brief pauses at commas or before important points so users can process information. The goal is a rhythm that feels human: clear and calm, but not sluggish."
      },
      {
        question: "Should the AI voice include \"um\" or other disfluencies?",
        answer: "Only sparingly, if at all. A touch of well-placed filler (like a brief \"um,\" or a sigh) can make the voice sound more relatable, but overdoing it confuses the message. Clarity and brevity outweigh the benefit of mimicking human hesitation in most cases."
      },
      {
        question: "How do we choose the right vocal persona for our assistant?",
        answer: "Design a persona that aligns with your brand and audience needs, then select or train a voice to match it. For example, a banking assistant might use a calm, mature voice to convey trust, whereas a learning toy might have a bright, enthusiastic voice. Consistency is key – keep the tone, style, and vocabulary uniform so the persona feels authentic in every interaction."
      },
      {
        question: "What's important when designing voice interactions for children?",
        answer: "Use simple, concrete language and a cheerful tone. Speak a bit slower and with extra clarity. It helps to offer guided choices (\"Do you want A or B?\") rather than open-ended questions, and to respond with positive reinforcement and patience. The experience should feel like a friendly, helpful mentor rather than a strict adult."
      },
      {
        question: "How can we leverage multimodal interfaces alongside voice?",
        answer: "Play to each medium's strength: use voice for quick, eyes-free interactions, and use a screen or visuals to show detailed information or options. For instance, the assistant might say a summary or question, while a screen displays a list of selectable items or additional details. This complementary approach ensures voice is used where it's most efficient, and screens or touch controls are there to fill in where voice alone isn't ideal."
      },
      {
        question: "How can we make a voice assistant's answers explainable?",
        answer: "Design the system to offer simple explanations for its actions or advice – for instance, a medical assistant might add \"I recommended that because it's a common remedy\" – and allow users to ask follow-up \"why?\" questions to gain more insight into the assistant's reasoning."
      },
      {
        question: "How do we build user trust in sensitive voice interactions?",
        answer: "Use a confident yet empathetic tone and consistently reliable information. The assistant should openly identify as AI, clarify its limitations when relevant, and gracefully hand off to a human or expert when a query falls outside its scope, so users know it's honest and safe to engage with."
      },
      {
        question: "How can we ensure the voice UX is age-appropriate?",
        answer: "Tailor language and interaction style to the user's age group. For example, young children get a playful, simplified experience (slower speech, easy words, gentle encouragement), while an adult user might receive a more professional and faster-paced dialogue suited to their context."
      }
    ]
  }
];
