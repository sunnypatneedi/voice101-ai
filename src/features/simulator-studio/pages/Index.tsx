
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/features/simulator-studio/components/ui/tabs";
import VoiceAICarousel from "@/features/simulator-studio/components/VoiceAICarousel";
import { Button } from "@/features/simulator-studio/components/ui/button";
import { ArrowRight, Search, Command } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/features/simulator-studio/hooks/use-toast";

const fadeIn = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  transition: {
    duration: 0.6
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  const { toast } = useToast();
  const [commandOpen, setCommandOpen] = useState(false);

  // Simulating optimistic UI for theme change (just as an example)
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Add keyboard shortcut for command palette (Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(prev => !prev);
        toast({
          title: "Command palette",
          description: "This would open a command palette in a full implementation",
          variant: "default"
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toast]);

  const handleThemeToggle = () => {
    // Optimistic UI update - theme changes immediately
    setTheme(prev => prev === "dark" ? "light" : "dark");
    toast({
      title: "Theme switched!",
      description: `Theme has been changed to ${theme === "dark" ? "light" : "dark"} mode`,
      variant: "default"
    });
  };

  return <motion.div initial="initial" animate="animate" className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Hero Section - with animated entry */}
      <motion.section className="container mx-auto pt-10 md:pt-20 pb-4 md:pb-6 px-4 md:px-6" variants={staggerContainer}>
        <motion.div className="max-w-4xl mx-auto text-center" variants={staggerContainer}>
          <motion.h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" variants={fadeIn}>
            Voice AI Simulator Studio
          </motion.h1>
          
          <motion.p className="text-lg md:text-2xl mb-6 text-slate-300 px-2" variants={fadeIn}>
            Explore a collection of voice AI prototypes designed for real-world applications. 
            Each simulator demonstrates unique voice capabilities ready to try.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Carousel Section - with skeleton loading */}
      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.3,
      duration: 0.5
    }} className="container mx-auto py-2 md:py-6 px-2 md:px-6 max-w-7xl">
        <VoiceAICarousel />
      </motion.section>
      
      {/* Features section */}
      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.5,
      duration: 0.5
    }} className="container mx-auto py-12 px-4 md:px-6">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Explore and Learn Cutting-Edge Voice Technology</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[{
          title: "Realtime Transcription",
          description: "Convert speech to text instantly with advanced AI algorithms",
          icon: "🎤"
        }, {
          title: "Natural Voice Synthesis",
          description: "Generate human-like speech with customizable characteristics",
          icon: "🔊"
        }, {
          title: "Contextual Understanding",
          description: "AI that comprehends context and responds appropriately",
          icon: "🧠"
        }].map((feature, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6 + index * 0.1,
          duration: 0.5
        }} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </motion.div>)}
        </div>
      </motion.section>
    </motion.div>;
};

export default Index;
