
import React from "react";
import QuickTalkSimulator from "../components/QuickTalkSimulator";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";

const QuickTalkTranscriber = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header Section */}
      <header className="container mx-auto pt-6 md:pt-10 pb-6 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              QuickTalk Transcriber
            </h1>
            <p className="mt-2 md:mt-4 text-base md:text-lg text-slate-300 max-w-3xl">
              Convert short audio notes to text reliably with our speech-to-text simulator.
            </p>
          </div>
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "lg"}
            asChild
            className="bg-blue-600 hover:bg-blue-500 text-white border-blue-400/30 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/40 font-medium text-sm md:text-base whitespace-nowrap"
          >
            <Link to="/">
              <ChevronLeft className="mr-1" />
              Back to Simulators
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-4 md:py-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-lg shadow-purple-900/20 p-4 md:p-6">
          <QuickTalkSimulator />
        </div>
      </main>

      {/* Footer removed as it's now centralized in the App component */}
    </div>
  );
};

export default QuickTalkTranscriber;
