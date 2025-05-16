
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
    // Check if we already have an active recording
    if (isRecording) {
      console.warn('Recording already in progress');
      return;
    }

    try {
      // First check if the browser supports the MediaDevices API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser');
      }

      // Request microphone access with specific constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: currentSettings.rate,
          channelCount: 1,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Check if we actually got an audio track
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio track found in the stream');
      }

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      // Handle data available event
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      // Handle recording stop
      recorder.onstop = () => {
        try {
          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: "audio/webm" });
            sendToWhisper(blob);
          }
        } catch (error) {
          console.error('Error processing recording:', error);
          toast({
            title: "Processing Error",
            description: "There was an error processing your recording.",
            variant: "destructive",
          });
        } finally {
          // Always stop all tracks to release the microphone
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
          chunks.length = 0; // Clear chunks
        }
      };
      
      // Handle recorder errors
      recorder.onerror = (event) => {
        console.error('Recorder error:', event);
        toast({
          title: "Recording Error",
          description: "An error occurred while recording.",
          variant: "destructive",
        });
        stopRecording();
      };
      
      mediaRef.current = recorder;
      recorder.start(100); // Request data every 100ms for better UX
      setIsRecording(true);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      let errorMessage = "Could not access your microphone.";
      
      if (error.name === 'NotAllowedError' || error.message.includes('permission')) {
        errorMessage = "Microphone access was denied. Please allow microphone access to use this feature.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "No microphone was found. Please ensure a microphone is connected.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = "Could not start the microphone. It might be in use by another application.";
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = "The requested audio constraints could not be satisfied.";
      } else if (error.name === 'TypeError') {
        errorMessage = "Invalid audio constraints provided.";
      }
      
      toast({
        title: "Microphone Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Reset recording state
      setIsRecording(false);
      mediaRef.current = null;
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRef.current && mediaRef.current.state !== 'inactive') {
        // Stop the recorder first
        mediaRef.current.stop();
        
        // Get the stream from the recorder
        const stream = mediaRef.current.stream;
        
        // Stop all tracks in the stream
        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
        }
        
        // Clean up
        mediaRef.current = null;
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast({
        title: "Error",
        description: "An error occurred while stopping the recording.",
        variant: "destructive",
      });
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
