
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { MeetingSettings } from "./SummaryControls";
import { SummaryResults } from "./SummaryResults";

export const useMeetingSummary = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SummaryResults | null>(null);

  const generateSummary = async (data: MeetingSettings) => {
    if (!data.transcript.trim()) {
      toast({
        title: "Missing transcript",
        description: "Please enter or upload a meeting transcript.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, we would send this to an API endpoint
      // For now, we'll simulate the response with a timeout
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a simulated response based on settings
      const compressionFactor = data.compressRatio[0] / 100;
      const isBullet = data.formatStyle === "Bullet";
      
      // Simple mock of AI processing
      const lines = data.transcript.split("\n").filter(line => line.trim());
      const speakers = new Set<string>();
      const keyPoints = [];
      const actionItems = [];
      
      // Extract speakers and key points
      for (let line of lines) {
        const speakerMatch = line.match(/^([^:]+):/);
        if (speakerMatch) {
          speakers.add(speakerMatch[1].trim());
          
          // Look for potential action items (sentences with "will", "need to", etc.)
          if (
            line.includes(" will ") || 
            line.includes(" needs to ") || 
            line.includes(" by ") ||
            line.includes(" prepare ")
          ) {
            // Format action item based on includeSpeakers setting
            let actionItem = line;
            
            if (data.includeSpeakers === "None") {
              actionItem = line.replace(/^[^:]+: /, "");
            } else if (data.includeSpeakers === "Tagged") {
              const speaker = speakerMatch[1].trim();
              actionItem = `[${speaker}] ${line.replace(/^[^:]+: /, "")}`;
            }
            
            actionItems.push(actionItem);
          }
          
          // Extract key points (sentences with important keywords)
          if (
            line.includes("increase") || 
            line.includes("launch") || 
            line.includes("schedule") ||
            line.includes("report") ||
            line.includes("budget")
          ) {
            keyPoints.push(line);
          }
        }
      }
      
      // Generate summary based on format style
      let summaryText = "";
      
      if (isBullet) {
        // Bullet summary
        const points = [];
        for (let speaker of speakers) {
          const speakerLines = lines.filter(line => line.startsWith(speaker + ":"));
          
          // Add points based on includeSpeakers setting
          if (data.includeSpeakers === "All") {
            points.push(`${speaker} discussed ${speakerLines.length} topics.`);
          } else if (data.includeSpeakers === "Tagged") {
            points.push(`[${speaker}] contributed ${speakerLines.length} times.`);
          } else {
            points.push(`A participant discussed ${speakerLines.length} topics.`);
          }
        }
        
        // Add meeting overview points
        points.push(`The meeting covered ${lines.length} exchanges.`);
        points.push(`${actionItems.length} action items were identified.`);
        
        // Apply compression by taking only some points
        const keptPoints = Math.max(2, Math.floor(points.length * compressionFactor));
        summaryText = points.slice(0, keptPoints).map(p => `• ${p}`).join("\n");
        
      } else {
        // Narrative summary
        let narrative = `This meeting involved ${speakers.size} participants `;
        
        if (data.includeSpeakers !== "None") {
          narrative += `(${Array.from(speakers).join(", ")}) `;
        }
        
        narrative += `and covered various topics including project updates, metrics, and planning. `;
        narrative += `The discussion resulted in ${actionItems.length} action items `;
        narrative += `and focused primarily on business development.`;
        
        // Apply compression by potentially shortening the narrative
        if (compressionFactor < 0.7) {
          narrative = narrative.split(". ").slice(0, 2).join(". ") + ".";
        }
        
        summaryText = narrative;
      }
      
      // Remove some items based on compression ratio to simulate different detail levels
      const keptKeyPoints = Math.max(1, Math.floor(keyPoints.length * compressionFactor));
      const keptActionItems = Math.max(1, Math.floor(actionItems.length * compressionFactor));
      
      setResults({
        keyPoints: keyPoints.slice(0, keptKeyPoints),
        actionItems: actionItems.slice(0, keptActionItems),
        summaryText,
      });
      
      toast({
        title: "Summary generated",
        description: "Your meeting summary is ready to view.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error generating summary",
        description: "An error occurred while processing your transcript.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    generateSummary
  };
};
