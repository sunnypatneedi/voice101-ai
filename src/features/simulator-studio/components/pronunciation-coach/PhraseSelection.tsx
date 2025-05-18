
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface PhraseSelectionProps {
  selectedPhrase: string;
  setSelectedPhrase: (phrase: string) => void;
  phrases: string[];
}

const PhraseSelection: React.FC<PhraseSelectionProps> = ({ 
  selectedPhrase, 
  setSelectedPhrase, 
  phrases 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="phrase-select" className="block text-sm font-medium text-slate-300">
        Select a phrase to practice:
      </label>
      <Select
        value={selectedPhrase}
        onValueChange={setSelectedPhrase}
        aria-label="Select a phrase"
      >
        <SelectTrigger 
          id="phrase-select" 
          className="w-full bg-slate-700 border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500"
        >
          <SelectValue placeholder="Select a phrase" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600 text-white">
          {phrases.map((phrase) => (
            <SelectItem 
              key={phrase} 
              value={phrase} 
              className="focus:bg-blue-600 focus:text-white"
            >
              {phrase}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PhraseSelection;
