
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../../components/ui/accordion";
import { FileText, List, ListOrdered } from "lucide-react";

export type SummaryResults = {
  keyPoints: string[];
  actionItems: string[];
  summaryText: string;
};

interface SummaryResultsProps {
  results: SummaryResults | null;
}

const SummaryResults: React.FC<SummaryResultsProps> = ({ results }) => {
  if (!results) return null;
  
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-900/30 border-blue-700 text-blue-100">
        <AlertTitle className="text-blue-200 font-semibold">Summary Generated</AlertTitle>
        <AlertDescription className="text-blue-200">
          Results are displayed below. Try adjusting parameters to see how they affect the output.
        </AlertDescription>
      </Alert>
      
      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="key-points" className="border-slate-600 bg-slate-800 rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 hover:bg-slate-700 text-white">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Key Points</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-slate-800/70 px-4 py-3">
            <ul className="list-disc list-inside space-y-2 text-slate-200">
              {results.keyPoints.length > 0 ? (
                results.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))
              ) : (
                <li className="text-slate-400">No key points identified</li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="action-items" className="border-slate-600 bg-slate-800 rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 hover:bg-slate-700 text-white">
            <div className="flex items-center gap-2">
              <ListOrdered className="h-4 w-4" />
              <span>Action Items</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-slate-800/70 px-4 py-3">
            <ul className="list-disc list-inside space-y-2 text-slate-200">
              {results.actionItems.length > 0 ? (
                results.actionItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))
              ) : (
                <li className="text-slate-400">No action items identified</li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="summary" className="border-slate-600 bg-slate-800 rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 hover:bg-slate-700 text-white">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Full Summary</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-slate-800/70 px-4 py-3">
            <div className="text-slate-200 whitespace-pre-line">
              {results.summaryText}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SummaryResults;
