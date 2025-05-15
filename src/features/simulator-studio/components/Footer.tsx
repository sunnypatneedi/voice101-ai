
import React from "react";
import { Link } from "react-router-dom";
import VoiceAIFaq from "./voice-ai-faq";
import { Separator } from "../../../components/ui/separator";
import { FileText, Users } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto py-6 md:py-8 px-4 md:px-6 border-t border-slate-800">
      {/* Top footer section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-0">
          <p className="text-sm md:text-base text-slate-400">
            © 2025 Voice AI Simulator Studio. All rights reserved.
          </p>
          <VoiceAIFaq />
        </div>
        <div className="flex space-x-4">
          <Link to="#" className="text-sm md:text-base text-slate-400 hover:text-white">Privacy</Link>
          <Link to="#" className="text-sm md:text-base text-slate-400 hover:text-white">Terms</Link>
          <Link to="#" className="text-sm md:text-base text-slate-400 hover:text-white">Contact</Link>
        </div>
      </div>

      {/* Separator */}
      <Separator className="bg-slate-800 my-6" />
      
      {/* Bottom footer section with icons */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-16">
        <Link to="#" className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300">
          <FileText className="w-5 h-5 mr-3" />
          <span className="text-sm">Main Concepts</span>
        </Link>
        <Link to="#" className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300">
          <FileText className="w-5 h-5 mr-3" />
          <span className="text-sm">Resources</span>
        </Link>
        <Link to="#" className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300">
          <Users className="w-5 h-5 mr-3" />
          <span className="text-sm">Experts</span>
        </Link>
        <Link to="#" className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300">
          <Users className="w-5 h-5 mr-3" />
          <span className="text-sm">Communities</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
