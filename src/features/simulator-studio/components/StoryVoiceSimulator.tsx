
import React, { useState } from 'react';
import { toast } from '../../hooks/use-toast';
import StoryControls from './story-voice/StoryControls';
import AudioPlayer from './story-voice/AudioPlayer';

const StoryVoiceSimulator = () => {
  const [template, setTemplate] = useState('Adventure');
  const [voiceStyle, setVoiceStyle] = useState('Friendly');
  const [effectVolume, setEffectVolume] = useState(50);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Simulated API call since we're mocking the backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response with audio URL
      // In a real implementation, this would come from your backend
      const mockAudioUrl = 'https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-3.mp3';
      
      setAudioUrl(mockAudioUrl);
      toast({
        title: "Story generated successfully!",
        description: `Template: ${template}, Voice: ${voiceStyle}, Effects: ${effectVolume}%`
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Failed to generate story",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        StoryVoice Maker
      </h1>
      <p className="text-slate-300 text-center">
        Generate AI storytelling with customizable voices and sound effects
      </p>

      <StoryControls
        template={template}
        setTemplate={setTemplate}
        voiceStyle={voiceStyle}
        setVoiceStyle={setVoiceStyle}
        effectVolume={effectVolume}
        setEffectVolume={setEffectVolume}
        isLoading={isLoading}
        onGenerate={handleGenerate}
      />

      {audioUrl && (
        <AudioPlayer audioUrl={audioUrl} />
      )}
    </div>
  );
};

export default StoryVoiceSimulator;
