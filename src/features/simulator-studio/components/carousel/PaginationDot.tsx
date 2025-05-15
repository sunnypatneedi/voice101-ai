
import React from "react";
import { motion } from "framer-motion";

interface PaginationDotProps {
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export const PaginationDot = ({ isActive, onClick, ariaLabel }: PaginationDotProps) => {
  return (
    <motion.button
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      className={`h-2 transition-all duration-500 rounded-full ${
        isActive 
          ? "bg-gradient-to-r from-blue-400 to-purple-600 w-10 shadow-lg shadow-purple-500/20" 
          : "bg-slate-600/50 hover:bg-slate-500/70 w-2"
      }`}
      aria-label={ariaLabel}
      onClick={onClick}
    />
  );
};
