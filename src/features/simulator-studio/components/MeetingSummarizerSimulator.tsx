
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TranscriptInput from "./meeting-summarizer/TranscriptInput";
import SummaryControls, { MeetingSettings } from "./meeting-summarizer/SummaryControls";
import SummaryResults from "./meeting-summarizer/SummaryResults";
import { useMeetingSummary } from "./meeting-summarizer/useMeetingSummary";

const MeetingSummarizerSimulator: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const { loading, results, generateSummary } = useMeetingSummary();

  const form = useForm<MeetingSettings>({
    defaultValues: {
      compressRatio: [50],
      formatStyle: "Bullet",
      includeSpeakers: "All",
      transcript: "",
    },
  });

  // Update the form's transcript field when the transcript state changes
  React.useEffect(() => {
    form.setValue("transcript", transcript);
  }, [transcript, form]);

  const onSubmit = async (data: MeetingSettings) => {
    await generateSummary(data);
  };

  return (
    <div className="space-y-6 bg-slate-900 p-3 sm:p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="grid gap-4 md:gap-6">
        <TranscriptInput transcript={transcript} setTranscript={setTranscript} />
        <SummaryControls form={form} onSubmit={onSubmit} loading={loading} />
        <SummaryResults results={results} />
      </div>
    </div>
  );
};

export default MeetingSummarizerSimulator;
