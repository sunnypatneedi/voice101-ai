
import React from "react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const FaqButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate("/voice-ai-faq")} 
      variant="outline" 
      size="sm"
      className="text-xs md:text-sm bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border-none"
    >
      Voice AI FAQ
    </Button>
  );
};

export default FaqButton;
