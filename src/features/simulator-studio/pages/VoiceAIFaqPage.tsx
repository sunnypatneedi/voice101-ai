
import React, { useState } from "react";
import { faqCategories } from "../components/voice-ai-faq/faqData";
import FaqContent from "../components/voice-ai-faq/FaqContent";
import FaqSearch from "../components/voice-ai-faq/FaqSearch";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VoiceAIFaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize with all categories expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    faqCategories.map(category => category.title)
  );
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const filteredCategories = searchTerm
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Voice AI Frequently Asked Questions</h1>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Essential questions to consider when building voice AI applications
      </p>
      
      <div className="mb-6">
        <FaqSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setExpandedCategories={setExpandedCategories}
          faqCategories={faqCategories}
        />
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
        <FaqContent 
          filteredCategories={filteredCategories}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
        />
      </div>
    </motion.div>
  );
};

export default VoiceAIFaqPage;
