
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Mic, Volume, Sliders } from "lucide-react";
import { motion } from "framer-motion";

interface Speaker {
  id: number;
  name: string;
  color: string;
}

const MultiSpeakerMixerSimulator = () => {
  // State for simulator controls
  const [speakerCount, setSpeakerCount] = useState<number>(2);
  const [diarizationEnabled, setDiarizationEnabled] = useState<boolean>(true);
  const [overlapPercentage, setOverlapPercentage] = useState<number>(20);
  const [diarizationMode, setDiarizationMode] = useState<string>("standard");
  
  // Demo speakers with colors
  const speakers: Speaker[] = [
    { id: 1, name: "Speaker 1", color: "#9b87f5" },
    { id: 2, name: "Speaker 2", color: "#0EA5E9" },
    { id: 3, name: "Speaker 3", color: "#F97316" },
    { id: 4, name: "Speaker 4", color: "#D946EF" },
  ];

  // Demo transcript segments
  const transcriptSegments = [
    { speakerId: 1, text: "I think we should focus on improving the user interface first." },
    { speakerId: 2, text: "That makes sense, but we also need to consider the backend performance." },
    { speakerId: 1, text: "What about prioritizing both and having two separate teams?" },
    { speakerId: 3, text: "We could do that, but we might need more resources." },
    { speakerId: 2, text: "I agree with that assessment." },
    { speakerId: 4, text: "Let's draft a proposal with timeline and resource requirements." },
  ];

  // Filter speakers based on current speakerCount
  const visibleSpeakers = speakers.slice(0, speakerCount);
  
  // Filter transcript segments to only show speakers that are visible
  const visibleTranscriptSegments = transcriptSegments.filter(segment => 
    segment.speakerId <= speakerCount
  );

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-blue-900">
            <CardTitle className="text-white text-center">Multi-Speaker Mixer</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="transcription">Transcription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="controls" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Speaker Count Control */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Mic className="mr-2 h-5 w-5" />
                        Speaker Count
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ToggleGroup type="single" value={speakerCount.toString()} onValueChange={(value) => setSpeakerCount(parseInt(value))}>
                        {[2, 3, 4].map((count) => (
                          <ToggleGroupItem key={count} value={count.toString()} className="w-full">
                            {count} Speakers
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </CardContent>
                  </Card>
                  
                  {/* Diarization Mode Control */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Sliders className="mr-2 h-5 w-5" />
                        Diarization Mode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ToggleGroup type="single" value={diarizationMode} onValueChange={setDiarizationMode}>
                        <ToggleGroupItem value="standard" className="w-full">
                          Standard
                        </ToggleGroupItem>
                        <ToggleGroupItem value="enhanced" className="w-full">
                          Enhanced
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </CardContent>
                  </Card>
                  
                  {/* Diarization Toggle */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Enable Diarization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="diarization-toggle"
                          checked={diarizationEnabled}
                          onCheckedChange={setDiarizationEnabled}
                        />
                        <Label htmlFor="diarization-toggle">
                          {diarizationEnabled ? "Diarization On" : "Diarization Off"}
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Overlap Percentage Control */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Volume className="mr-2 h-5 w-5" />
                        Speaker Overlap
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Overlap Percentage:</span>
                        <span className="font-bold">{overlapPercentage}%</span>
                      </div>
                      <Slider
                        value={[overlapPercentage]}
                        onValueChange={(values) => setOverlapPercentage(values[0])}
                        max={50}
                        step={5}
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>0%</span>
                        <span>50%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="audio" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleSpeakers.map(speaker => (
                    <Card key={speaker.id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: speaker.color }}>
                          {speaker.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-4">
                          <Button variant="secondary" className="w-full">
                            Upload Audio for {speaker.name}
                          </Button>
                          <div className="h-16 bg-slate-700 rounded-md flex items-center justify-center">
                            <p className="text-slate-400">No audio uploaded</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="col-span-1 md:col-span-2 bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Mixed Audio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-24 bg-slate-700 rounded-md flex items-center justify-center">
                        <Button disabled={visibleSpeakers.length === 0}>
                          Generate Mixed Audio
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="transcription" className="space-y-6">
                {diarizationEnabled ? (
                  <div className="space-y-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Diarized Transcript</h3>
                      
                      <div className="space-y-4">
                        {visibleTranscriptSegments.map((segment, index) => {
                          const speaker = speakers.find(s => s.id === segment.speakerId);
                          return (
                            <div key={index} className="flex">
                              <div 
                                className="flex-shrink-0 font-semibold mr-3" 
                                style={{ color: speaker?.color }}
                              >
                                {speaker?.name}:
                              </div>
                              <div className="text-slate-200">{segment.text}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Speaker Visualization</h3>
                      
                      <div className="h-24 bg-slate-700 rounded-md p-2">
                        {/* Timeline visualization - simplified representation */}
                        <div className="flex h-full rounded overflow-hidden">
                          {[
                            { speakerId: 1, width: "20%" },
                            { speakerId: 2, width: "15%" },
                            { speakerId: 1, width: "20%" },
                            { speakerId: 3, width: "15%" },
                            { speakerId: 2, width: "10%" },
                            { speakerId: 4, width: "20%" },
                          ]
                            .filter(segment => segment.speakerId <= speakerCount)
                            .map((segment, index) => {
                              const speaker = speakers.find(s => s.id === segment.speakerId);
                              return (
                                <div 
                                  key={index}
                                  className="h-full"
                                  style={{ 
                                    backgroundColor: speaker?.color, 
                                    width: segment.width,
                                    opacity: 0.7
                                  }}
                                />
                              );
                            })
                          }
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <div className="text-sm text-gray-400">0:00</div>
                        <div className="text-sm text-gray-400">1:00</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center">
                    <p className="text-lg text-slate-400 mb-4">Diarization is currently disabled</p>
                    <Button onClick={() => setDiarizationEnabled(true)}>
                      Enable Diarization
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MultiSpeakerMixerSimulator;
