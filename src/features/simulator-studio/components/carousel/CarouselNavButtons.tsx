
import React from "react";
import { motion } from "framer-motion";

interface CarouselNavButtonsProps {
  scrollPrev: () => void;
  scrollNext: () => void;
}

export const CarouselNavButtons = ({ scrollPrev, scrollNext }: CarouselNavButtonsProps) => {
  return (
    <>
      <motion.button 
        onClick={scrollPrev}
        aria-label="View previous simulator group" 
        className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-blue-600/90 backdrop-blur-sm border border-blue-400/30 text-white h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: "-50%", opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="sr-only">Previous slide</span>
      </motion.button>
      
      <motion.button 
        onClick={scrollNext}
        aria-label="View next simulator group" 
        className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 bg-blue-600/90 backdrop-blur-sm border border-blue-400/30 text-white h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: "50%", opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="sr-only">Next slide</span>
      </motion.button>
    </>
  );
};
