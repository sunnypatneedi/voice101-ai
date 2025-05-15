interface Term {
  id: string;
  title: string;
  description: string;
  category: 'foundational' | 'advanced';
  details?: string;
  sections?: { title: string; content: string }[];
  examples?: string[];
  resources?: { title: string; url: string }[];
}

export const terms: Term[] = [
  {
    id: 'stt',
    title: 'STT (Speech-to-Text)',
    description: 'Converts spoken language into written text, typically using Automatic Speech Recognition (ASR) algorithms.',
    category: 'foundational',
    details: 'Speech-to-Text technology, also known as Automatic Speech Recognition (ASR), transforms spoken words into written text. Modern STT systems use deep learning models like transformers and recurrent neural networks to process audio signals and predict text output. These systems handle various accents, dialects, and noisy environments with increasing accuracy. STT is foundational for voice assistants, transcription services, and any application that needs to understand human speech.'
  },
  {
    id: 'tts',
    title: 'TTS (Text-to-Speech)',
    description: 'Technology that converts written text into synthetic speech (artificial voice output).',
    category: 'foundational',
    details: 'Text-to-Speech converts written text into natural-sounding synthetic speech. Modern TTS systems use neural networks to generate incredibly lifelike voices with appropriate prosody, intonation, and emotion. These systems can be customized for different languages, accents, speaking styles, and even specific voices through voice cloning. TTS enables accessibility features, audiobooks, navigation systems, and voice responses in conversational AI.'
  },
  {
    id: 'ttft',
    title: 'TTFT (Time to First Token)',
    description: 'A latency metric representing the time from a user\'s query (end of spoken input) to the system producing the first part of its response (first output token).',
    category: 'foundational',
    details: 'Time to First Token (TTFT) measures the responsiveness of voice systems by tracking the delay between the end of user input and the beginning of system output. It\'s a critical UX metric that directly impacts perceived system performance and conversation quality. Optimizing TTFT involves techniques like predictive processing, response prefetching, and efficient model serving. Reducing TTFT creates more natural-feeling conversations that meet human expectations for dialogue timing.'
  },
  {
    id: 'turn',
    title: 'Turn (Dialogue Turn)',
    description: 'In a conversation, one turn is a single participant\'s utterance before the other party responds (i.e. speaking one-at-a-time in alternating turns).',
    category: 'foundational',
    details: 'A dialogue turn represents one complete exchange in a conversation - typically a user speaking followed by the system responding. Turn management is essential for creating natural conversation flow in voice interfaces. Systems track turn-taking signals like pauses, intonation changes, and explicit handoffs to determine when to listen versus speak. Effective turn management creates conversations that feel intuitive rather than mechanical.'
  },
  {
    id: 'wake-word',
    title: 'Wake Word',
    description: 'A specific word or phrase that, when detected, causes a voice assistant or device to "wake up" and start listening for commands (e.g. "Hey Siri", "Alexa").',
    category: 'foundational',
    details: 'Wake words are specific phrases that activate voice assistants from standby mode. They use lightweight, always-on detection models that balance sensitivity (not missing activations) with specificity (avoiding false triggers). Wake word technology achieves this through multi-stage verification, custom acoustic modeling, and personalization. Popular examples include "Hey Siri," "Alexa," and "OK Google," though custom wake words are increasingly supported.'
  },
  {
    id: 'nlu',
    title: 'NLU (Natural Language Understanding)',
    description: 'A branch of AI that enables machines to comprehend meaning and intent from human language input (converting raw text into structured data like intents and entities).',
    category: 'foundational',
    details: 'Natural Language Understanding processes text to extract meaning, intent, and structured information. NLU systems identify user intents (e.g., "set_alarm"), extract entities (e.g., time="7am"), and analyze sentiment or emotion. Modern NLU typically uses transformer models like BERT or domain-specific models trained for particular applications. NLU bridges the gap between raw text transcription and actionable understanding in voice systems.'
  },
  {
    id: 'pstn',
    title: 'PSTN (Public Switched Telephone Network)',
    description: 'Legacy phone network your bot must join to reach real numbers.',
    category: 'foundational',
    details: 'The Public Switched Telephone Network is the traditional circuit-switched telephone network that has been in use worldwide for over a century. For voice AI applications to connect with standard phone numbers, they must interface with the PSTN through specialized gateways. This requires understanding of telephony protocols, call routing, and carrier interfaces. Modern cloud telephony providers abstract much of this complexity, but engineers should understand basics of PSTN integration for robust production systems.'
  },
  {
    id: 'sip',
    title: 'SIP (Session Initiation Protocol)',
    description: 'VoIP signalling standard; used for carrier, PBX or call-center hand-offs.',
    category: 'foundational',
    details: 'Session Initiation Protocol is the dominant standard for initiating, maintaining, and terminating real-time voice sessions over IP networks. SIP handles call setup, modification, and teardown through a series of request/response exchanges. Voice AI systems often integrate with existing telephony infrastructure through SIP trunks or APIs. Understanding SIP is essential when designing voice applications that need to transfer calls between virtual agents and human representatives, or when integrating with enterprise PBX systems.'
  },
  {
    id: 'dtmf',
    title: 'DTMF (Dual-Tone Multi-Frequency)',
    description: 'Key-press tones; bots send these to navigate IVRs.',
    category: 'foundational',
    details: 'Dual-Tone Multi-Frequency signaling is the system used when pressing keys on a telephone keypad. Each keypress generates a specific combination of two tones that can be recognized by automated systems. Voice AI platforms must be able to detect incoming DTMF (for user input) and generate outgoing DTMF (for navigating other IVR systems). DTMF provides a reliable fallback input mechanism when speech recognition might struggle, such as in noisy environments or for sensitive information like account numbers.'
  },
  {
    id: 'aec',
    title: 'AEC (Acoustic Echo Cancellation)',
    description: 'Client-side filter that removes speaker bleed-through before STT.',
    category: 'foundational',
    details: 'Acoustic Echo Cancellation algorithms remove the sound of the system\'s own voice output from the input microphone signal. Without AEC, when a voice assistant speaks, its own voice would be picked up by the microphone and potentially mistaken as user speech. Effective AEC is critical for enabling barge-in and creating natural conversations. Modern AEC implementations use adaptive filters and machine learning to dynamically adjust to different acoustic environments and speaker configurations.'
  },
  {
    id: 'agc',
    title: 'AGC (Automatic Gain Control)',
    description: 'Mic-level amplifier that evens loud/quiet input; can hide pauses.',
    category: 'foundational',
    details: 'Automatic Gain Control dynamically adjusts microphone input levels to maintain consistent volume regardless of how loudly or softly a user speaks or their distance from the microphone. While AGC improves speech recognition accuracy by normalizing audio levels, it can sometimes mask natural pauses in speech if configured too aggressively. Voice AI engineers must balance AGC sensitivity to maintain natural conversation rhythm while ensuring clear audio capture.'
  },
  {
    id: 'opus',
    title: 'Opus',
    description: 'Low-latency audio codec baked into WebRTC; 6–510 kbps.',
    category: 'foundational',
    details: 'Opus is an open-source, highly versatile audio codec designed for interactive real-time applications over the internet. It combines the speech-focused SILK codec with the music-oriented CELT codec, making it suitable for both voice and wider-bandwidth audio. Opus is the default codec in WebRTC implementations and offers adjustable bitrates from as low as 6 kbps to 510 kbps. Its variable bitrate capability and low algorithmic delay (as little as 5ms) make it ideal for interactive voice AI applications.'
  },
  {
    id: 'pcm',
    title: 'PCM (Pulse-Code Modulation)',
    description: 'Raw, uncompressed audio (e.g., 24 kHz × 16-bit = 384 kbps).',
    category: 'foundational',
    details: 'Pulse-Code Modulation is the standard method for digitally representing raw audio signals. Unlike compressed formats, PCM stores the exact amplitude of the audio waveform at regular intervals (samples). The quality of PCM audio is determined by its sample rate (frequency of samples, typically 8-48 kHz) and bit depth (precision of each sample, commonly 16 or 24 bit). While PCM provides the highest quality for STT processing, its large file size and bandwidth requirements make it impractical for transmission, so voice systems typically use compression for transport and PCM for processing.'
  },
  {
    id: 'jitter-buffer',
    title: 'Jitter Buffer',
    description: 'Client queue that re-orders late packets; bigger buffer ⇒ more delay.',
    category: 'foundational',
    details: 'A jitter buffer temporarily stores incoming audio packets to compensate for variable network delays (jitter) that would otherwise cause audio distortion. The buffer allows packets that arrive out of sequence to be properly ordered before playback. The trade-off is clear: a larger buffer provides smoother audio but introduces more latency. Voice AI systems must carefully tune jitter buffer size based on network conditions and application requirements to balance audio quality against conversational responsiveness.'
  },
  {
    id: 'p50-p95',
    title: 'P50 / P95 Percentiles',
    description: 'Latency statistics; P95 ≅ "worst typical", design for both.',
    category: 'foundational',
    details: 'P50 and P95 percentiles are statistical measures used to quantify system performance, particularly latency. P50 (median) represents typical performance—half of all responses are faster, half are slower. P95 represents the "worst typical" case—95% of responses are faster than this threshold. Voice AI systems must optimize for both metrics: a good P50 ensures most interactions feel responsive, while an acceptable P95 prevents frustrating outliers. Engineers should track these metrics separately for each component (STT, LLM, TTS) and for end-to-end performance.'
  },
  {
    id: 'edge-routing',
    title: 'Edge Routing',
    description: 'Technique that sends user packets to nearest PoP, then across a private backbone.',
    category: 'foundational',
    details: 'Edge routing optimizes network performance by directing user traffic to the nearest point of presence (PoP), then routing it through a private network backbone to the destination server. This approach reduces public internet hops, minimizing latency and packet loss. For voice AI systems, edge routing can significantly improve audio quality and reduce round-trip times, especially for geographically distant users. Cloud providers with extensive global networks offer this as a service, often called Global Accelerator or similar names.'
  },
  {
    id: 'quic',
    title: 'QUIC',
    description: 'UDP-based transport behind HTTP/3; removes TCP head-of-line blocking.',
    category: 'foundational',
    details: 'QUIC is a transport layer network protocol initially developed by Google, now standardized as the foundation of HTTP/3. Unlike TCP, QUIC runs over UDP and implements its own reliability and congestion control mechanisms. It eliminates head-of-line blocking at the connection level, enabling independent streams of data that don\'t affect each other when packet loss occurs. For voice AI applications, QUIC can significantly improve performance over unstable connections, reducing latency spikes and providing more consistent audio transmission.'
  },
  {
    id: 'moq',
    title: 'MoQ (Media over QUIC)',
    description: 'Emerging IETF spec for low-latency media distribution on QUIC.',
    category: 'foundational',
    details: 'Media over QUIC is an emerging IETF standard designed specifically for low-latency streaming media applications running on the QUIC protocol. MoQ aims to replace older streaming technologies by leveraging QUIC\'s connection migration, multiplexing, and congestion control features while adding media-specific optimizations. For voice AI systems, MoQ promises to deliver more reliable audio streaming with lower latency, particularly in challenging network environments like mobile connections with frequent handovers between cell towers.'
  },
  {
    id: 'warm-transfer',
    title: 'Warm Transfer',
    description: 'Live hand-off: bot briefs the human agent before connecting caller.',
    category: 'foundational',
    details: 'Warm transfer is a call handoff technique where an AI agent provides context to a human agent before connecting the caller. This contrasts with cold transfers, where callers are switched with no context sharing. Implementing warm transfers requires careful orchestration of the conversation flow, including notifying the user about the transfer, preparing a summary for the human agent, and managing the technical aspects of the call routing. Effective warm transfers significantly improve customer experience by eliminating the need for callers to repeat information.'
  },
  {
    id: 'token-caching',
    title: 'Token Caching',
    description: 'Provider-side reuse of previous prompt tokens; cuts cost and TTFT.',
    category: 'foundational',
    details: 'Token caching is an optimization technique where providers store and reuse computations for previously processed tokens rather than recomputing them from scratch. This applies to both language models (caching key-value attention pairs) and TTS systems (caching audio for common phrases). Token caching can dramatically reduce Time to First Token (TTFT) and computational costs in conversational systems where context includes significant repeated content. Some LLM providers offer this as a service feature, helping voice AI systems maintain responsiveness while controlling costs.'
  },
  {
    id: 'word-level-timestamps',
    title: 'Word-level Timestamps',
    description: 'TTS metadata mapping each word to exact playback time; vital for rollback.',
    category: 'foundational',
    details: 'Word-level timestamps provide precise timing information about when each word starts and ends in generated speech. This metadata is crucial for synchronizing visual elements with audio (like highlighting text as it\'s spoken), implementing mid-utterance corrections, and enabling lip-sync for animated avatars. In voice AI systems, timestamps enable "rollback" functionality—when the system needs to correct itself mid-sentence, it can precisely determine how far back in the audio to rewind before continuing with the corrected content.'
  },
  {
    id: 'hipaa-baa',
    title: 'HIPAA BAA (Business Associate Agreement)',
    description: 'U.S. healthcare contract that allows PHI processing under HIPAA.',
    category: 'foundational',
    details: 'A HIPAA Business Associate Agreement is a legal contract required under U.S. healthcare privacy regulations before a covered entity can share Protected Health Information (PHI) with a service provider. For voice AI systems in healthcare, a BAA defines responsibilities regarding data security, breach notification procedures, and compliant handling of patient information. Cloud providers and AI vendors typically offer standard BAAs, but engineers must ensure their implementation actually follows the contractual requirements through proper encryption, access controls, and audit logging.'
  },
  {
    id: 'coppa',
    title: 'COPPA (Children\'s Online Privacy Protection Act)',
    description: 'U.S. regulation restricting data collection for < 13 yrs; affects call recording & evals.',
    category: 'foundational',
    details: 'The Children\'s Online Privacy Protection Act is a U.S. law that imposes strict requirements on the collection of personal information from children under 13. For voice AI systems that might interact with children, COPPA compliance involves obtaining verifiable parental consent before collecting voice recordings or other personal data. This affects how systems can implement features like voice activity detection, speaker recognition, or conversation recording for quality assurance. Voice AI platforms serving general audiences should implement age-gating or design child-safe interaction modes.'
  },
  {
    id: 'context-summarization',
    title: 'Context Summarization',
    description: 'LLM-generated abridged history inserted to keep prompts under token limits.',
    category: 'foundational',
    details: 'Context summarization uses an LLM to generate concise summaries of conversation history, reducing token count while preserving key information. As conversations grow longer, including the complete history in each prompt becomes prohibitively expensive and slow. Strategic summarization—retaining recent turns verbatim while summarizing older content—balances context awareness with computational efficiency. Effective implementation typically involves hierarchical summarization (summarizing previous summaries) and carefully choosing what details to preserve based on conversation type and current focus.'
  },
  {
    id: 'barge-in',
    title: 'Barge-in Handling',
    description: 'The capability for a voice system to be interrupted by the user\'s speech while the system is talking. When a barge-in is detected, the system stops its output and listens to the user, allowing more natural, interactive dialog.',
    category: 'advanced',
    details: 'Barge-in handling allows users to interrupt a voice system while it\'s speaking, making interactions feel more natural. When implemented well, the system immediately stops its response and shifts to listening mode. This requires concurrent processing of outgoing TTS and incoming audio for speech detection. Effective barge-in creates more dynamic conversations and lets users quickly redirect or correct the system without waiting for long responses to finish.'
  },
  {
    id: 'vad',
    title: 'Voice Activity Detection (VAD)',
    description: 'An algorithm that detects whether audio contains human speech or not. VAD distinguishes speech versus silence/noise in real time, often used to know when to start or stop listening.',
    category: 'advanced',
    details: 'Voice Activity Detection algorithms identify whether audio contains human speech versus background noise or silence. Modern VAD systems use neural networks to make precise speech/non-speech distinctions even in challenging acoustic environments. VAD determines when users start and stop speaking, enabling accurate turn-taking, endpoint detection, and audio processing efficiency by only analyzing speech segments.'
  },
  {
    id: 'semantic-vad',
    title: 'Semantic VAD (Context-aware Voice Activity Detection)',
    description: 'Combines pause length and linguistic cues to predict turn-end more accurately.',
    category: 'advanced',
    details: 'Semantic Voice Activity Detection goes beyond traditional VAD by incorporating linguistic context when determining whether a user has finished speaking. While basic VAD systems rely solely on silence detection, semantic VAD considers factors like sentence completeness, question intonation, and natural pause patterns. This approach significantly reduces both premature interruptions when users are simply pausing to think and unnecessary waiting after clearly complete utterances. Implementing semantic VAD typically involves combining acoustic models with language understanding components to make more intelligent end-of-turn decisions.'
  },
  {
    id: 'smart-turn',
    title: 'Smart Turn',
    description: 'Open-weights audio model that classifies end-of-utterance; avoids barge-in glitches.',
    category: 'advanced',
    details: 'Smart Turn refers to specialized machine learning models designed specifically to classify whether a user has completed their conversational turn. Unlike simple timeout-based approaches, Smart Turn models analyze subtle acoustic and linguistic signals to predict with high accuracy whether the user is finished speaking or just pausing briefly. These models are typically trained on large corpora of annotated conversations and can significantly reduce both false triggers (system responding too early) and perceived latency (system waiting too long). The open-weights nature of some implementations allows customization for specific domains or user populations.'
  },
  {
    id: 's2s-llm',
    title: 'Speech-to-Speech (S2S) LLM',
    description: 'Single model converts user audio → agent audio; removes STT/TTS but increases token load.',
    category: 'advanced',
    details: 'Speech-to-Speech LLMs represent a paradigm shift in conversational AI by directly transforming user speech into agent responses without explicit intermediate text representation. By eliminating separate STT and TTS components, these models can potentially reduce end-to-end latency and preserve paralinguistic features like tone and emphasis. However, current implementations typically require more computational resources than traditional pipelines. As these models mature, they promise more natural conversations with better preservation of emotional and prosodic aspects of speech.'
  },
  {
    id: 'composite-function-calling',
    title: 'Composite Function Calling',
    description: 'LLM chains multiple calls autonomously to finish a task (e.g., list → load).',
    category: 'advanced',
    details: 'Composite function calling enables language models to orchestrate sequences of API calls to complete complex tasks. Rather than requiring separate prompts for each step, the model determines the necessary sequence of operations and executes them in the correct order. For example, it might first call a function to list available appointments, then another to retrieve details about a specific appointment, and finally a third to schedule it—all from a single user request. This capability dramatically improves efficiency and user experience in voice AI systems by reducing the number of turns required to complete multi-step tasks.'
  },
  {
    id: 'async-functions',
    title: 'Async / Long-running Functions',
    description: 'Kick off background jobs that stream results back mid-dialogue.',
    category: 'advanced',
    details: 'Asynchronous or long-running functions allow voice AI systems to initiate time-consuming operations without blocking the conversation flow. Instead of making users wait in silence while processing an intensive request, the system can acknowledge the request, begin the operation in the background, and continue conversing. When results become available, they can be seamlessly incorporated into the dialogue. This pattern is especially valuable for operations like complex searches, large file processing, or third-party API calls with unpredictable latency, enabling more dynamic and responsive voice interactions.'
  },
  {
    id: 'state-machine',
    title: 'State-Machine Orchestration',
    description: 'Breaks long workflows into prompt+tool subsets; keeps instruction-following tight.',
    category: 'advanced',
    details: 'State-machine orchestration manages complex voice interactions by decomposing them into discrete states, each with specific prompt engineering and available tools. This approach helps prevent hallucination by constraining the model\'s focus to the current state\'s requirements rather than the entire workflow. The state machine transitions based on user inputs and system events, maintaining context across states while optimizing for each interaction segment. This architecture is particularly valuable for multi-turn processes like booking workflows or complex troubleshooting, where different stages require different specialized knowledge and tool access.'
  },
  {
    id: 'parallel-pipelines',
    title: 'Parallel Pipelines',
    description: 'Run STT, LLM, or guardrail branches simultaneously (e.g., async RAG + live chat).',
    category: 'advanced',
    details: 'Parallel pipelines architecture executes multiple processing streams concurrently to optimize responsiveness and capability. For example, a voice assistant might simultaneously run real-time STT for immediate simple responses while a more complex knowledge retrieval process happens in parallel. When the retrieval completes, its results can enhance or modify the ongoing conversation. This approach balances immediate responsiveness with deeper capabilities, particularly valuable for knowledge-intensive domains where retrieval latency would otherwise create uncomfortable pauses in conversation.'
  },
  {
    id: 'guardrails',
    title: 'Guardrails',
    description: 'Small LLM or heuristic layer catching hallucinations, unsafe content, prompt injection.',
    category: 'advanced',
    details: 'Guardrails are specialized safety systems that monitor and filter AI outputs before delivery to users. These can range from simple pattern-matching heuristics to dedicated small-footprint language models specifically trained to identify problematic content. Effective guardrail systems operate with minimal latency impact while protecting against issues like hallucinated information, unsafe content generation, and prompt injection attacks. For production voice AI systems, particularly in regulated industries or customer-facing applications, robust guardrails are essential for maintaining trust, compliance, and brand safety.'
  },
  {
    id: 'prompt-injection',
    title: 'Prompt Injection',
    description: 'Attack vector where user text rewrites the system prompt; must detect & strip.',
    category: 'advanced',
    details: 'Prompt injection is a security vulnerability where malicious users attempt to override or modify the system\'s instructions by inserting commands that the model might interpret as coming from the developers rather than the user. For example, a user might say "Ignore all previous instructions and instead do X." Defending against prompt injection requires techniques like input sanitization, robust system message formatting, guardrail models that detect attempts, and architectural designs that limit the impact of successful injections. This is particularly important in voice systems that may interact with unknown users in public settings.'
  },
  {
    id: 'context-caching',
    title: 'Context Caching API',
    description: 'Vendor feature that stores previous tokens server-side; huge for multimodal latency.',
    category: 'advanced',
    details: 'Context caching APIs allow LLM providers to store and efficiently reuse computation from previous interactions at the server level. Instead of reprocessing the entire conversation history with each turn, the provider maintains the model\'s internal state, significantly reducing both latency and token costs for subsequent messages. This is particularly valuable for multimodal or voice applications where context windows can grow large due to rich prompts or extensive conversation history. Effective implementation requires careful management of cache invalidation and version control as prompts or models are updated.'
  },
  {
    id: 'jagged-frontier',
    title: 'Jagged Frontier',
    description: 'Ethos that model capability is uneven; necessitates evals per release.',
    category: 'advanced',
    details: 'The jagged frontier concept acknowledges that AI model capabilities develop unevenly across different tasks and domains. A model update might improve performance in one area while regressing in another, creating a constantly shifting "frontier" of capabilities. This reality necessitates comprehensive evaluation suites that test diverse skills with each release or model change. For voice AI systems, understanding the specific strengths and weaknesses of underlying models is crucial for designing appropriate guardrails, fallbacks, and user experiences that work reliably despite the uneven capability landscape.'
  },
  {
    id: 'reasoning-models',
    title: 'Reasoning-Mode Models',
    description: 'DeepSeek R1, o3-mini, etc. emit thinking tokens; too slow for live speech but great for async planning.',
    category: 'advanced',
    details: 'Reasoning-mode models explicitly generate intermediate reasoning steps before producing final answers, making their problem-solving process transparent and auditable. While these models offer higher accuracy for complex tasks, their step-by-step thinking process makes them too slow for real-time voice interactions. However, they excel in background tasks like conversation planning, complex content generation, and decision-making processes where latency is less critical than correctness. Voice AI architectures can leverage these models for preparation and planning stages while using faster models for direct user interaction.'
  },
  {
    id: 'serverless-gpu',
    title: 'Serverless GPU / Cold Starts',
    description: 'On-demand pods lower cost but add 4-10 s spin-up unless pre-warmed.',
    category: 'advanced',
    details: 'Serverless GPU deployments offer cost-effective scaling for AI workloads by allocating computing resources only when needed, rather than maintaining constantly running instances. However, these systems face "cold start" delays of 4-10 seconds when initializing new instances to handle traffic spikes. For voice applications where consistent low latency is critical, this presents a challenge. Strategies like predictive scaling, request queuing, instance pre-warming, and hybrid architectures can mitigate cold start issues while still capturing the cost benefits of serverless deployment.'
  },
  {
    id: 'private-backbone',
    title: 'Private-Backbone RTT',
    description: 'Δ latency vs. public Internet on long hauls; can shave ~25–40 ms.',
    category: 'advanced',
    details: 'Private backbone networks offer significantly reduced round-trip times (RTT) compared to the public internet, especially for long-distance connections. By routing traffic through dedicated, optimized infrastructure, cloud providers can reduce latency by 25-40ms on transcontinental routes. This performance advantage is particularly important for voice AI systems where every millisecond of delay impacts conversational naturalness. When evaluating cloud or edge providers for voice applications, engineers should consider not just data center proximity but also the provider\'s network architecture and private backbone capabilities.'
  },
  {
    id: 'fec',
    title: 'Forward Error Correction (FEC)',
    description: 'Opus option that rebuilds dropped packets without retransmit; lowers glitch rate.',
    category: 'advanced',
    details: 'Forward Error Correction is a technique that adds redundant data to audio transmissions, allowing receivers to reconstruct lost packets without requesting retransmission. In the Opus codec, FEC can be enabled to improve audio quality over unreliable networks by predicting the content of dropped packets based on surrounding audio information. While FEC increases bandwidth usage slightly, it significantly reduces audible glitches and improves perceived audio quality, particularly on cellular or Wi-Fi connections with occasional packet loss. Voice AI systems should consider adaptive FEC that activates based on detected network conditions.'
  },
  {
    id: 'speaker-isolation',
    title: 'Speaker Isolation',
    description: 'ML filter (e.g., Krisp) that mutes background voices, boosting STT accuracy.',
    category: 'advanced',
    details: 'Speaker isolation uses machine learning algorithms to differentiate between a primary speaker and background voices or noise, enhancing only the desired audio source. This technology is particularly valuable in voice AI applications operating in noisy environments like cafes, offices, or homes with multiple people speaking. By filtering out competing voices before audio reaches the speech recognition engine, speaker isolation can dramatically improve transcription accuracy and reduce false activations. Modern implementations can run efficiently on edge devices, providing privacy benefits by processing sensitive audio locally.'
  },
  {
    id: 'diarization',
    title: 'Diarization (Speaker Diarization)',
    description: 'Labeling "who spoke when"; useful for multi-speaker transcripts & analytics.',
    category: 'advanced',
    details: 'Speaker diarization technology distinguishes between different speakers in an audio stream and labels each segment with consistent speaker identities. This capability is essential for accurately transcribing meetings, interviews, or any multi-participant conversation. Beyond basic transcription, diarization enables advanced analytics like speaking time distribution, interruption patterns, and speaker-specific sentiment analysis. Voice AI systems that need to participate in group conversations rely on diarization to understand the social dynamics and determine when and how to contribute appropriately.'
  },
  {
    id: 'open-weights',
    title: 'Open-Weights Fine-Tuning',
    description: 'Training models like Llama 3.3 on domain data for faster/cheaper inference.',
    category: 'advanced',
    details: 'Open-weights fine-tuning involves customizing publicly available large language models like Llama for specific domains or applications. By training these models on relevant domain data, organizations can create specialized versions that offer better performance for their use case while requiring less computational resources than larger generalist models. For voice AI applications, domain-adapted models can provide faster responses with better domain knowledge, leading to more natural conversations at lower cost. This approach is particularly valuable for specialized industries like healthcare, finance, or technical support.'
  },
  {
    id: 'regression-budget',
    title: 'Regression Budget / Hill-Climbing',
    description: 'Strategy: only ship a model if no key metric regresses; choose hills worth climbing.',
    category: 'advanced',
    details: 'Regression budget is a product development methodology that establishes acceptable trade-offs between improving some metrics while potentially degrading others. The hill-climbing aspect refers to choosing which "hills" (improvements) are worth pursuing even if they come with small costs elsewhere. For voice AI systems, this might mean accepting slightly slower response times if it significantly improves answer quality, or vice versa. These decisions should be guided by user research to determine which metrics most impact satisfaction in specific contexts, creating a framework for making consistent, user-centered optimization choices.'
  },
  {
    id: 'edge-inference',
    title: 'Offline / Edge Inference',
    description: 'Shipping STT/TTS locally (e.g., on-prem hospital servers) for HIPAA or no-network sites.',
    category: 'advanced',
    details: 'Edge inference deploys AI models directly on local devices or on-premises servers rather than in the cloud. This approach offers several advantages: reduced latency by eliminating network round trips, continued operation during internet outages, and enhanced privacy by keeping sensitive data local. For healthcare organizations handling PHI or industrial facilities with limited connectivity, edge-deployed voice AI can provide critical functionality while meeting compliance requirements. Modern approaches often use quantized or distilled models to run efficiently on limited hardware while maintaining acceptable quality.'
  },
  {
    id: 'latency-budgets',
    title: 'Latency Budgets',
    description: 'Allocated time limits for each stage of a voice pipeline to meet an overall response time goal. For example, in a 1-second total budget, ASR, NLU, and TTS each might get specific ms allotments so that the end-to-end voice response stays within the target latency.',
    category: 'advanced',
    details: 'Latency budgets allocate specific time limits to each component in a voice processing pipeline to meet overall responsiveness goals. These budgets help teams identify bottlenecks and optimize the most impactful components. Effective implementations include monitoring systems that track component performance against budgets and adaptive approaches that reallocate budgets based on conversation context or user expectations.'
  },
  {
    id: 'phoneme-steering',
    title: 'Phoneme Steering',
    description: 'Guiding a speech system\'s output at the phonetic level. For instance, using phonetic spellings or SSML <phoneme> tags to control pronunciation in TTS, ensuring correct or custom pronunciations and speaking style for domain-specific words (important in names, medical terms, etc.).',
    category: 'advanced',
    details: 'Phoneme steering controls pronunciation at the phonetic level, ensuring accurate pronunciation of names, technical terms, and domain-specific vocabulary. This can be implemented through SSML tags, pronunciation dictionaries, or direct phoneme sequence manipulation. Effective phoneme steering improves user experience by avoiding jarring mispronunciations, particularly in specialized domains like healthcare, legal, and technical support where precision matters.'
  },
  {
    id: 'token-caching',
    title: 'Token Caching',
    description: 'An optimization technique where the system caches computations or outputs associated with tokens to avoid repeating work. For example, large language models cache key–value pairs from prior tokens\' attention layers so that generating each new token is faster. In voice pipelines, caching can also include reusing frequent TTS audio snippets or partial STT results to improve efficiency.',
    category: 'advanced',
    details: 'Token caching improves efficiency by storing and reusing computation results for frequently processed text or speech segments. In language models, this means preserving key-value attention pairs across inference steps. In voice systems, it can include caching TTS audio for common phrases or preserving partial processing results. Token caching significantly reduces latency and computational costs for repetitive content while maintaining quality.'
  },
  {
    id: 'real-time-evaluation',
    title: 'Real-Time Evaluation Tooling',
    description: 'Tools that monitor and assess a voice AI system\'s performance on the fly during live interactions. These can measure metrics like transcription accuracy, response latency, or dialogue quality in real time, enabling immediate feedback and adjustments. (E.g. live word error rate tracking, or conversation quality scoring for call-center bots).',
    category: 'advanced',
    details: 'Real-time evaluation tooling monitors voice system performance during live interactions, providing immediate feedback on metrics like transcription accuracy, latency, and conversation quality. These tools use canary testing, confidence scoring, and automated quality checks to identify issues as they happen. Effective implementations can trigger fallback strategies for low-confidence interactions and generate alerts for human intervention when needed.'
  },
  {
    id: 'human-in-the-loop',
    title: 'Human-in-the-Loop Workflows',
    description: 'Processes that integrate human oversight or intervention in the AI loop. For voice systems this might mean humans reviewing or correcting transcripts, validating an assistant\'s responses, or labeling difficult audio segments. Such HITL approaches ensure higher accuracy and safety by leveraging human expertise for critical steps (common in healthcare for verifying medical transcripts, or in education to supervise AI tutors).',
    category: 'advanced',
    details: 'Human-in-the-loop workflows incorporate human judgment at key points in voice AI processes. These can include real-time supervision where humans verify critical interactions, asynchronous review for quality improvement, and targeted intervention triggered by confidence thresholds. HITL approaches are especially important in high-stakes domains like healthcare, legal, and customer service where errors could have significant consequences.'
  },
  {
    id: 'edge-deployments',
    title: 'Edge Deployments',
    description: 'Running voice AI models locally on edge devices (e.g. on a smartphone, embedded device, or on-prem server) instead of in the cloud. On-device voice processing (Edge AI) keeps audio data local, which improves privacy and can reduce latency (important for sensitive domains like healthcare data privacy or for offline/low-bandwidth environments).',
    category: 'advanced',
    details: 'Edge deployments run voice AI models directly on local devices rather than in the cloud. This approach offers privacy advantages by keeping sensitive audio data local, reduced latency by eliminating network round-trips, and offline functionality for use without internet connectivity. Implementation typically requires model compression, hardware acceleration, and careful power management to deliver quality performance within device constraints.'
  },
  {
    id: 'content-filtering',
    title: 'Content Filtering (Profanity Filter)',
    description: 'Mechanisms to detect and censor or avoid inappropriate content in voice AI interactions. For example, speech recognition can mask or omit profanities/hate speech in transcripts, and TTS systems can be restricted from uttering unsafe content. This is crucial for child-safe applications and maintaining professional or compliant dialogue in education and healthcare settings.',
    category: 'advanced',
    details: 'Content filtering systems detect and handle inappropriate content in voice interactions. These systems typically combine word lists, context analysis, and tone detection to identify problematic content. Implementation options include masking/bleeping offensive terms, substituting alternative wording, or refusing to process certain content entirely. Effective filtering balances protection against harmful content with avoiding overcensorship of legitimate speech.'
  },
  {
    id: 'phi',
    title: 'PHI (Protected Health Information)',
    description: 'Any personal health data that can identify an individual (e.g. medical record details, spoken health info). Voice AI solutions in healthcare must treat audio and transcripts containing PHI with strict security and compliance (e.g. HIPAA regulations), ensuring such data is stored and processed privately (often via encryption or edge processing).',
    category: 'advanced',
    details: 'Protected Health Information in voice AI requires specialized handling to maintain compliance with regulations like HIPAA. Implementation includes automatic PHI detection in transcripts, secure storage with encryption at rest and in transit, and access controls limiting who can view sensitive data. Many healthcare voice applications use edge processing to keep PHI local or implement specialized redaction workflows for transcription services.'
  }
];

export const getTermBySlug = (slug: string): Term | undefined => {
  return terms.find(term => term.id === slug);
};
