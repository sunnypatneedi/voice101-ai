
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useVoiceAssistantTest } from "./assistant/useVoiceAssistantTest";
import TestConfigForm, { TesterFormValues } from "./voice-assistant/TestConfigForm";
import TestResults, { TestResultsData } from "./voice-assistant/TestResults";

export default function VoiceAssistantTester() {
  const [testResults, setTestResults] = useState<TestResultsData | null>(null);

  const form = useForm<TesterFormValues>({
    defaultValues: {
      testCommand: "PlayMusic",
      contextLines: "0",
      errorMode: "None",
    },
  });

  const { runTest, isLoading } = useVoiceAssistantTest();

  const onSubmit = async (values: TesterFormValues) => {
    const results = await runTest({
      testCommand: values.testCommand,
      contextLines: parseInt(values.contextLines),
      errorMode: values.errorMode,
    });
    setTestResults(results);
  };

  return (
    <div className="space-y-8">
      <TestConfigForm 
        onSubmit={onSubmit} 
        isLoading={isLoading} 
        form={form} 
      />

      {testResults && <TestResults results={testResults} />}
    </div>
  );
}
