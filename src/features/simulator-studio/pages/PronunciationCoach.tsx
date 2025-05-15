
import React from "react";
import PronunciationCoachSimulator from "../../components/PronunciationCoachSimulator";
import { Button } from "../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../../hooks/use-mobile";

const PronunciationCoachPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header Section */}
      <header className="container mx-auto pt-6 md:pt-10 pb-6 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
              Pronunciation Coach
            </h1>
            <p className="mt-2 md:mt-4 text-base md:text-lg text-slate-300 max-w-3xl">
              Practice your pronunciation with AI feedback. Select a phrase, record yourself, 
              and get detailed analysis at word or phoneme level.
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
        <div className="max-w-4xl mx-auto">
          <PronunciationCoachSimulator />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto py-6 md:py-8 px-4 md:px-6 border-t border-slate-800 mt-8 md:mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm md:text-base text-slate-400 mb-4 md:mb-0">
            © 2025 Voice AI Simulator Studio. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm md:text-base text-slate-400 hover:text-white">Privacy</a>
            <a href="#" className="text-sm md:text-base text-slate-400 hover:text-white">Terms</a>
            <a href="#" className="text-sm md:text-base text-slate-400 hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PronunciationCoachPage;
