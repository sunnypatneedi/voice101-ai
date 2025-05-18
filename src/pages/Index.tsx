import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Search, HelpCircle, Code } from 'lucide-react';
import BookLayout from '../components/BookLayout';
const Index = () => {
  const [showHighlight, setShowHighlight] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHighlight(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  return <BookLayout>
      <div className="animate-fade-in">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16 mt-6">
          
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Voice101<span className="text-foreground">.</span><span className="text-primary glow-text">ai</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-8">Start smart, scale deep: Voice AI basics for engineers.</p>
          
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">The intro to Voice AI</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/foundational-terms" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              Get Started
            </Link>
            <a href="#sections" className="bg-transparent border border-border hover:border-primary text-foreground px-6 py-3 rounded-md font-medium transition-colors">
              Explore Sections
            </a>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className={`glass-effect rounded-lg p-6 transition-all duration-500 ${showHighlight ? 'opacity-100' : 'opacity-0'}`} style={{
          transitionDelay: '100ms'
        }}>
            <Search className="w-10 h-10 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Key Terms</h2>
            <p className="text-foreground/80">Essential vocabulary and concepts every Voice AI engineer should know.</p>
          </div>
          <div className={`glass-effect rounded-lg p-6 transition-all duration-500 ${showHighlight ? 'opacity-100' : 'opacity-0'}`} style={{
          transitionDelay: '300ms'
        }}>
            <HelpCircle className="w-10 h-10 text-accent mb-4" />
            <h2 className="text-xl font-bold mb-2">Detailed Explanations</h2>
            <p className="text-foreground/80">Clear, concise definitions with practical applications and examples.</p>
          </div>
          <div className={`glass-effect rounded-lg p-6 transition-all duration-500 ${showHighlight ? 'opacity-100' : 'opacity-0'}`} style={{
          transitionDelay: '500ms'
        }}>
            <Code className="w-10 h-10 text-secondary mb-4" />
            <h2 className="text-xl font-bold mb-2">Production Techniques</h2>
            <p className="text-foreground/80">Advanced concepts and methodologies for building robust Voice AI applications.</p>
          </div>
        </div>
        
        {/* Sections */}
        <div id="sections" className="pt-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Sections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Link to="/foundational-terms" className="group">
              <div className="glass-effect rounded-lg p-8 border border-border/50 h-full group-hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">Foundational Terms</h3>
                  <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-foreground/80 mb-6">
                  Master the essential vocabulary and core concepts that form the building blocks of Voice AI technology.
                </p>
                <div className="text-sm text-foreground/60">
                  Includes: STT, TTS, TTFT, Turn, Wake Word, NLU
                </div>
              </div>
            </Link>
            
            <Link to="/advanced-concepts" className="group">
              <div className="glass-effect rounded-lg p-8 border border-border/50 h-full group-hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">Advanced Concepts</h3>
                  <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-foreground/80 mb-6">
                  Explore sophisticated techniques and methodologies used in production-grade Voice AI systems.
                </p>
                <div className="text-sm text-foreground/60">
                  Includes: Barge-in Handling, VAD, Diarization, Contextual Prompting, and more
                </div>
              </div>
            </Link>

            <Link to="/faq" className="group">
              <div className="glass-effect rounded-lg p-8 border border-border/50 h-full group-hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">FAQs & Insights</h3>
                  <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-foreground/80 mb-6">
                  Essential questions and valuable insights to consider when building voice AI applications.
                </p>
                <div className="text-sm text-foreground/60">
                  Includes: Pronunciation, Latency, Transcription, TTS Quality, and more
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </BookLayout>;
};
export default Index;