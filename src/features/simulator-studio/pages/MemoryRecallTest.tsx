
import React from "react";
import MemoryRecallTestSimulator from "../components/MemoryRecallTestSimulator";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";

const MemoryRecallTestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pb-10">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-slate-300 hover:text-white">
            <Link to="/" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Memory Recall Test
          </h1>
          <p className="text-slate-300 text-center max-w-3xl mx-auto mb-10">
            Test how well AI systems maintain stateful memory over multi-turn conversations with customizable transcript length, memory retention, and query specificity.
          </p>
          
          <MemoryRecallTestSimulator />
        </div>
      </div>
    </div>
  );
};

export default MemoryRecallTestPage;
