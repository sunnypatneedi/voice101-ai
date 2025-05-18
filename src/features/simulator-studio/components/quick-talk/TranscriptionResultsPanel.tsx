
import React from "react";
import { TranscriptionResults } from "../transcriber/TranscriptionResults";

interface TranscriptionResultsPanelProps {
  records: any[];
  isLoading: boolean;
}

export const TranscriptionResultsPanel: React.FC<TranscriptionResultsPanelProps> = ({
  records,
  isLoading
}) => {
  return (
    <TranscriptionResults 
      records={records}
      isLoading={isLoading}
    />
  );
};
