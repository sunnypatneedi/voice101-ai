
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import SpeechEmotionDetectorSimulator from "../components/SpeechEmotionDetectorSimulator";
import { motion } from "framer-motion";

const SpeechEmotionDetector = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-slate-300 hover:text-white">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Gallery
            </Link>
          </Button>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Speech Emotion Detector</h1>
          <p className="text-slate-300 mb-8">Analyze emotional tone in spoken audio with real-time visualization</p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10"
        >
          <SpeechEmotionDetectorSimulator />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">How It Works</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>The simulator analyzes audio input to detect emotional states in speech.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Primary emotions detected include happy, sad, angry, neutral, and excited.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Real-time visualization shows the intensity of each detected emotion.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Adjust settings like sensitivity and analysis window for different speaking styles.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SpeechEmotionDetector;
