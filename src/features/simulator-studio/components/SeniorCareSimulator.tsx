
import React, { useState, useRef } from 'react';
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import ReminderSettings from './senior-care/ReminderSettings';
import ReminderResults from './senior-care/ReminderResults';

const SeniorCareSimulator = () => {
  const [alertTime, setAlertTime] = useState('08:00');
  const [confirmMode, setConfirmMode] = useState('Repeat');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const testReminder = async () => {
    // In a real application, this would call the backend
    // For the simulator, we'll mock the response
    setConfirmationResult(null);
    
    try {
      toast({
        title: "Processing reminder",
        description: "Generating audio response...",
      });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response with a sample audio file
      // In a real app, this would be a URL returned from the API
      setAudioUrl("/test-audio.mp3");
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          listenForConfirmation();
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process reminder",
        variant: "destructive",
      });
    }
  };

  const listenForConfirmation = async () => {
    setIsListening(true);
    
    try {
      // In a real application, this would use the Web Speech API or a similar service
      // For the simulator, we'll mock the STT functionality
      
      toast({
        title: "Listening",
        description: "Say 'yes' or 'no' to confirm...",
      });
      
      // Mock 5 second listening period
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Randomly decide if the user said "yes" or "no" for simulation purposes
      const mockResponse = Math.random() > 0.5 ? "yes" : "no";
      const confirmed = mockResponse === "yes";
      
      setConfirmationResult(confirmed ? "Confirmed" : "Not confirmed");
      
      toast({
        title: confirmed ? "Confirmed" : "Not confirmed",
        description: `We heard: "${mockResponse}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process speech input",
        variant: "destructive",
      });
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ReminderSettings 
          alertTime={alertTime}
          setAlertTime={setAlertTime}
          confirmMode={confirmMode}
          setConfirmMode={setConfirmMode}
          speechRate={speechRate}
          setSpeechRate={setSpeechRate}
        />

        <Button 
          onClick={testReminder} 
          className="w-full mt-6"
          disabled={isListening}
        >
          Test Reminder
        </Button>

        <ReminderResults
          isListening={isListening}
          confirmationResult={confirmationResult}
          audioUrl={audioUrl}
          audioRef={audioRef}
        />
      </div>
    </div>
  );
};

export default SeniorCareSimulator;
