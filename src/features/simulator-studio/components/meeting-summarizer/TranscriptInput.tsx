
import React from "react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { FileText, Upload } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface TranscriptInputProps {
  transcript: string;
  setTranscript: (value: string) => void;
}

const TranscriptInput: React.FC<TranscriptInputProps> = ({ transcript, setTranscript }) => {
  const { toast } = useToast();

  const EXAMPLE_TRANSCRIPT = `John: Good morning everyone. Let's get started with today's agenda.
Sarah: I'd like to discuss the Q2 metrics first. We're seeing a 15% increase in user engagement.
Mike: That's great. We should leverage this for our next marketing campaign.
John: Agreed. Sarah, can you prepare a report by Friday?
Sarah: Yes, I'll have it ready.
John: Next item - the new feature rollout.
Mike: The development team will need another week before we're ready to launch.
John: OK, let's push the release date to the 15th.
Sarah: Should we notify our beta testers?
John: Yes, Mike please take care of that.
Mike: I'll send the communication today.
Sarah: Also, we need to decide on the budget for Q3.
John: Let's schedule a separate meeting for that next Tuesday.
Mike: Sounds good. I'll prepare the financial projections.
John: Perfect. Is there anything else we need to discuss?
Sarah: Not from my side.
Mike: All good here.
John: Great. Thanks everyone for your time.`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTranscript(event.target.result.toString());
      }
    };
    reader.readAsText(file);
  };

  const useExampleTranscript = () => {
    setTranscript(EXAMPLE_TRANSCRIPT);
    toast({
      title: "Example transcript loaded",
      description: "A sample meeting transcript has been loaded.",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Meeting Transcript</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Button 
          variant="outline" 
          className="flex gap-2 bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
          onClick={useExampleTranscript}
        >
          <FileText className="h-4 w-4" />
          Use Example
        </Button>
        
        <div className="relative">
          <Button
            variant="outline" 
            className="flex gap-2 relative bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload Transcript
          </Button>
          <input
            type="file"
            id="file-upload"
            accept=".txt,.doc,.docx,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      
      <Textarea
        placeholder="Paste your meeting transcript here..."
        className="h-[200px] bg-slate-800 border-slate-700 text-slate-100 focus-visible:ring-blue-500"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />
    </div>
  );
};

export default TranscriptInput;
