
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Mic, 
  MicOff, 
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  AudioWaveform
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../hooks/use-toast";

const emotions = [
  { name: "Happy", icon: Smile, color: "bg-green-500" },
  { name: "Sad", icon: Frown, color: "bg-blue-500" },
  { name: "Angry", icon: Frown, color: "bg-red-500" },
  { name: "Neutral", icon: Meh, color: "bg-gray-500" },
  { name: "Excited", icon: Laugh, color: "bg-yellow-500" }
];

const SpeechEmotionDetectorSimulator = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [sensitivity, setSensitivity] = useState([50]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("live");
  const [emotionIntensities, setEmotionIntensities] = useState<Record<string, number>>({
    "Happy": 20,
    "Sad": 10,
    "Angry": 5,
    "Neutral": 65,
    "Excited": 0
  });
  
  // Simulate starting recording
  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Speak to detect emotions in your voice"
    });
    
    // Simulate emotion detection with changing values over time
    const emotionInterval = setInterval(() => {
      const newIntensities = { ...emotionIntensities };
      // Randomly adjust values to simulate real-time analysis
      emotions.forEach(emotion => {
        const randomChange = Math.floor(Math.random() * 15) - 7; // -7 to +7
        newIntensities[emotion.name] = Math.max(0, Math.min(100, 
          newIntensities[emotion.name] + randomChange));
      });
      
      // Ensure total adds up to 100%
      const total = Object.values(newIntensities).reduce((a, b) => a + b, 0);
      if (total > 0) {
        Object.keys(newIntensities).forEach(key => {
          newIntensities[key] = Math.round((newIntensities[key] / total) * 100);
        });
      }
      
      setEmotionIntensities(newIntensities);
      
      // Set the dominant emotion
      const dominant = Object.entries(newIntensities)
        .sort((a, b) => b[1] - a[1])[0];
      setSelectedEmotion(dominant[0]);
    }, 1000);
    
    // Store interval ID to clear later
    // @ts-ignore - This is a demo so we're attaching to window for simplicity
    window.emotionInterval = emotionInterval;
  };
  
  // Simulate stopping recording
  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Emotion analysis complete"
    });
    
    // Clear the update interval
    // @ts-ignore
    clearInterval(window.emotionInterval);
  };
  
  // Handle sensitivity change
  const handleSensitivityChange = (value: number[]) => {
    setSensitivity(value);
    toast({
      title: "Sensitivity updated",
      description: `Detection sensitivity set to ${value[0]}%`
    });
  };
  
  const renderEmotionBars = () => {
    return emotions.map((emotion) => {
      const intensity = emotionIntensities[emotion.name] || 0;
      
      return (
        <div key={emotion.name} className="mb-4">
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <emotion.icon 
                className={`mr-2 ${selectedEmotion === emotion.name ? "text-blue-500" : "text-gray-400"}`} 
                size={20} 
              />
              <span className={`text-sm font-medium ${selectedEmotion === emotion.name ? "text-blue-500" : "text-gray-300"}`}>
                {emotion.name}
              </span>
            </div>
            <span className="text-sm text-gray-400">{intensity}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <motion.div 
              className={`h-2.5 rounded-full ${emotion.color}`}
              initial={{ width: "0%" }}
              animate={{ width: `${intensity}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      );
    });
  };
  
  return (
    <Card className="border-slate-700 bg-slate-900 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">Speech Emotion Detector</h2>
            <p className="text-slate-300">Analyze emotional tones in spoken audio in real-time</p>
          </div>
          
          <Tabs defaultValue="live" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="live">Live Analysis</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="live" className="space-y-6">
              {/* Emotion Visualization Section */}
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 text-slate-200">Emotion Analysis</h3>
                
                {/* Dominant Emotion Display */}
                {selectedEmotion && (
                  <div className="flex items-center justify-center mb-6">
                    <motion.div 
                      className="flex flex-col items-center p-6 bg-slate-700/50 rounded-lg"
                      animate={{ scale: isRecording ? [1, 1.05, 1] : 1 }}
                      transition={{ repeat: isRecording ? Infinity : 0, duration: 2 }}
                    >
                      {(() => {
                        const emotion = emotions.find(e => e.name === selectedEmotion);
                        if (!emotion) return null;
                        const EmotionIcon = emotion.icon;
                        return (
                          <>
                            <EmotionIcon size={48} className="text-blue-400 mb-2" />
                            <span className="text-xl font-bold text-white">{selectedEmotion}</span>
                          </>
                        );
                      })()}
                    </motion.div>
                  </div>
                )}
                
                {/* Emotion Intensity Bars */}
                <div className="mt-4">
                  {renderEmotionBars()}
                </div>
                
                {/* Audio Visualization */}
                <div className="mt-6 flex justify-center">
                  <motion.div 
                    className="flex items-end space-x-1 h-16"
                    animate={{ opacity: isRecording ? 1 : 0.5 }}
                  >
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 bg-blue-500 rounded-full"
                        animate={{ 
                          height: isRecording 
                            ? [`${Math.random() * 50 + 10}%`, `${Math.random() * 80 + 20}%`] 
                            : "20%" 
                        }}
                        transition={{ 
                          duration: 0.4, 
                          repeat: isRecording ? Infinity : 0,
                          repeatType: "reverse"
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
              
              {/* Recording Controls */}
              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button 
                    onClick={handleStartRecording} 
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Mic className="mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopRecording} 
                    variant="destructive"
                    size="lg"
                  >
                    <MicOff className="mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              {/* Settings Panel */}
              <div className="space-y-6 bg-slate-800 p-4 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-slate-200">Sensitivity</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-slate-400 mr-4 w-20">Low</span>
                    <Slider
                      value={sensitivity}
                      onValueChange={handleSensitivityChange}
                      max={100}
                      step={1}
                      className="flex-grow"
                    />
                    <span className="text-sm text-slate-400 ml-4 w-20">High</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-slate-200">Emotion Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {emotions.map(emotion => (
                      <div key={emotion.name} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={emotion.name} 
                          checked={true} 
                          onChange={() => {}} 
                          className="mr-2"
                        />
                        <label htmlFor={emotion.name} className="text-slate-300 text-sm">
                          {emotion.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-slate-200">Analysis Window</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-slate-400 mr-4 w-20">200ms</span>
                    <Slider
                      value={[500]}
                      onValueChange={() => {}}
                      max={2000}
                      step={100}
                      className="flex-grow"
                    />
                    <span className="text-sm text-slate-400 ml-4 w-20">2000ms</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-slate-400 text-sm">
            <p>Try speaking with different emotions to see how the detector responds.</p>
            <p className="mt-1">For best results, speak clearly and adjust the sensitivity as needed.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechEmotionDetectorSimulator;
