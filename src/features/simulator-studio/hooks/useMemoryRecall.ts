
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { MemoryResult } from "../../components/memory-recall/MemoryTypes";

export const useMemoryRecall = () => {
  const [transcript, setTranscript] = useState("");
  const [query, setQuery] = useState("");
  const [memoryCleared, setMemoryCleared] = useState(false);
  const [transcriptLength, setTranscriptLength] = useState(5); // minutes
  const [memoryRetention, setMemoryRetention] = useState(50); // percentage
  const [querySpecificity, setQuerySpecificity] = useState(50); // percentage
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MemoryResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>("transcript");
  
  const { toast } = useToast();

  // Sample transcript for demo purposes
  const sampleTranscript = 
    "User: What's the weather forecast for tomorrow?\n\n" +
    "Assistant: Tomorrow will be sunny with a high of 72°F and a low of 58°F. There's a 10% chance of precipitation.\n\n" +
    "User: Should I bring an umbrella to my meeting?\n\n" +
    "Assistant: Based on the forecast, you likely won't need an umbrella as there's only a 10% chance of rain tomorrow.\n\n" +
    "User: What time is my first meeting tomorrow?\n\n" +
    "Assistant: You have a marketing strategy meeting scheduled for 9:30 AM with the product team in Conference Room B.\n\n" +
    "User: Who will be attending that meeting?\n\n" +
    "Assistant: The attendees for your 9:30 AM marketing strategy meeting include Sarah from Product Marketing, John from Sales, Alex from Design, and Maria who is the project lead.\n\n" +
    "User: What restaurant did I tell you about yesterday that I wanted to try?\n\n" +
    "Assistant: You mentioned wanting to try the new Italian restaurant called 'Bella Notte' on Main Street. You said you heard they have excellent handmade pasta.";

  const handleLoadSample = () => {
    setTranscript(sampleTranscript);
    toast({
      title: "Sample transcript loaded",
      description: "A sample conversation has been loaded into the transcript field",
    });
  };

  const handleClearMemory = () => {
    setMemoryCleared(true);
    toast({
      title: "Memory cleared",
      description: "The assistant's memory has been cleared",
    });
  };

  const handleResetMemory = () => {
    setMemoryCleared(false);
    toast({
      title: "Memory reset",
      description: "The assistant's memory has been restored",
    });
  };

  const calculateAccuracy = () => {
    // Simulate accuracy based on controls
    let base = memoryRetention / 100; // 0-1 based on memory retention setting
    
    // Adjust based on query specificity (more specific = easier to recall)
    base *= (0.5 + (querySpecificity / 200)); // 0.5-1 adjustment factor
    
    // Adjust based on transcript length (longer = harder to recall)
    base *= (1 - (transcriptLength / 30)); // Penalize for length

    // Add some randomness
    base = Math.min(Math.max(base + (Math.random() * 0.2 - 0.1), 0), 1);
    
    // Convert to percentage (0-100)
    return Math.round(base * 100);
  };

  const handleRunTest = () => {
    if (!transcript) {
      toast({
        title: "Missing transcript",
        description: "Please provide a conversation transcript",
        variant: "destructive",
      });
      return;
    }

    if (!query) {
      toast({
        title: "Missing query",
        description: "Please provide a test query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setActiveTab("results");

    // Simulate API call with timeout
    setTimeout(() => {
      // Generate mock results based on the controls and memory state
      const newResult: MemoryResult = {
        query,
        expectedAnswer: memoryCleared ? null : "The meeting is scheduled for 9:30 AM in Conference Room B.",
        actualAnswer: memoryCleared 
          ? "I'm sorry, I don't have that information in my memory."
          : "Your marketing strategy meeting is at 9:30 AM tomorrow in Conference Room B with Sarah, John, Alex, and Maria.",
        accuracy: memoryCleared ? 0 : calculateAccuracy(),
        responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
      };

      setResults([newResult, ...results]);
      setIsLoading(false);

      toast({
        title: "Test completed",
        description: `Memory recall test completed with ${memoryCleared ? "cleared" : "active"} memory`,
      });
    }, 1500);
  };

  return {
    transcript,
    setTranscript,
    query,
    setQuery,
    memoryCleared,
    transcriptLength,
    setTranscriptLength,
    memoryRetention,
    setMemoryRetention,
    querySpecificity,
    setQuerySpecificity,
    isLoading,
    results,
    activeTab,
    setActiveTab,
    handleLoadSample,
    handleClearMemory,
    handleResetMemory,
    handleRunTest,
  };
};
