
import { useState } from "react";

interface TestParams {
  testCommand: string;
  contextLines: number;
  errorMode: string;
}

interface TestResult {
  responseText: string;
  accuracyScore: number;
}

export function useVoiceAssistantTest() {
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async (params: TestParams): Promise<TestResult> => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would make an actual API call
      // Simulating API call with delay and mock responses
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Log what would be sent to the API
      console.log("API Call params:", params);
      
      // Generate simulated response based on params
      const result = generateSimulatedResponse(params);
      return result;
    } catch (error) {
      console.error("Error running voice assistant test:", error);
      return {
        responseText: "Sorry, an error occurred while processing your request.",
        accuracyScore: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { runTest, isLoading };
}

// Helper function to generate simulated responses based on the input parameters
function generateSimulatedResponse(params: TestParams): TestResult {
  const { testCommand, contextLines, errorMode } = params;
  
  // Base accuracy affected by error mode
  let baseAccuracy = errorMode === "None" ? 0.95 : 
                    errorMode === "AddNoise" ? 0.65 : 
                    0.45; // Bad grammar
  
  // Context lines improve accuracy (if no errors)
  const contextBonus = errorMode === "None" ? Math.min(contextLines * 0.02, 0.05) : 0;
  
  // Calculate final accuracy score
  const accuracyScore = Math.min(Math.max(baseAccuracy + contextBonus, 0), 1);
  
  // Generate response text based on command and accuracy
  let responseText = "";
  
  if (accuracyScore > 0.7) {
    // High accuracy responses
    switch (testCommand) {
      case "PlayMusic":
        responseText = "Playing your favorite music playlist now.";
        break;
      case "SetTimer":
        responseText = "Timer set for 5 minutes.";
        break;
      case "GetWeather":
        responseText = "Currently it's 72°F and sunny in your location.";
        break;
      default:
        responseText = "Command processed successfully.";
    }
  } else {
    // Low accuracy responses
    switch (errorMode) {
      case "AddNoise":
        responseText = "I'm having trouble understanding. Could you repeat that?";
        break;
      case "BadGrammar":
        responseText = "I think you want to " + testCommand.toLowerCase() + ", but I'm not sure.";
        break;
      default:
        responseText = "Sorry, I couldn't understand that command.";
    }
  }
  
  return {
    responseText,
    accuracyScore
  };
}
