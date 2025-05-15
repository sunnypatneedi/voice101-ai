
import { useState, useRef } from "react";
import { toast } from "../../hooks/use-toast";

interface TranscriptRecord {
  start: number;
  text: string;
  confidence: number;
}

interface AudioSettings {
  noise: number;
  rate: number;
  lang: string;
}

export const useAudioRecording = (settings?: AudioSettings) => {
  const [records, setRecords] = useState<TranscriptRecord[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  
  // Use settings or default values
  const currentSettings = settings || { noise: 20, rate: 16000, lang: "auto" };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        sendToWhisper(blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && isRecording) {
      mediaRef.current.stop();
      setIsRecording(false);
      setIsLoading(true);
    }
  };

  // Simulate sending to Whisper API with the settings
  const sendToWhisper = async (blob: Blob) => {
    try {
      // In a real implementation, this would send data to an API
      // Here we'll simulate the response with a timeout, but use the settings
      
      // Log the settings that would be used in a real API call
      console.log("Audio processing with settings:", {
        noiseLevel: currentSettings.noise,
        sampleRate: currentSettings.rate,
        language: currentSettings.lang
      });
      
      // Create dummy response data
      // Simulate different confidence levels based on noise setting
      const confidenceBase = Math.max(0.6, 1 - (currentSettings.noise / 100));
      
      // Simulate quality differences based on sample rate
      const qualityModifier = currentSettings.rate >= 44000 ? 0.15 : 
                             currentSettings.rate >= 16000 ? 0.05 : -0.1;
      
      // Simulate language detection effect
      const langModifier = currentSettings.lang === "auto" ? -0.03 : 0.02;
      
      setTimeout(() => {
        const dummyResponse = {
          transcripts: [
            { 
              start: 0.0, 
              text: "Hello, this is a sample transcription.", 
              confidence: Math.min(0.98, confidenceBase + qualityModifier + langModifier)
            },
            { 
              start: 2.4, 
              text: "Testing the QuickTalk transcriber.", 
              confidence: Math.min(0.96, confidenceBase + qualityModifier + langModifier - 0.05) 
            },
            { 
              start: 4.8, 
              text: "The quality depends on noise and sample rate.", 
              confidence: Math.min(0.94, confidenceBase + qualityModifier + langModifier - 0.1) 
            }
          ]
        };
        
        setRecords(dummyResponse.transcripts);
        setIsLoading(false);
        
        toast({
          title: "Transcription Complete",
          description: "Audio has been successfully transcribed.",
        });
      }, 2000); // Simulate API delay
      
      /* 
      // Real implementation would look like this:
      const form = new FormData();
      form.append("file", blob);
      form.append("noise", currentSettings.noise.toString());
      form.append("rate", currentSettings.rate.toString());
      form.append("lang", currentSettings.lang);
      
      const res = await fetch("/whisper", { 
        method: "POST", 
        body: form 
      });
      
      const data = await res.json();
      setRecords(data.transcripts);
      setIsLoading(false);
      */
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setIsLoading(false);
      toast({
        title: "Transcription Error",
        description: "Could not transcribe the audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    records,
    isRecording,
    isLoading,
    startRecording,
    stopRecording
  };
};
