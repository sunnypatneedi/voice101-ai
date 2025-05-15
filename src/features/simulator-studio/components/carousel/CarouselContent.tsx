
import React from "react";
import { motion } from "framer-motion";
import { CarouselCard } from "@/features/simulator-studio/components/carousel/CarouselCard";
import { getControlLabels, getSimulatorPath } from "@/features/simulator-studio/components/carousel/carouselUtils";
import { CarouselItem } from "@/features/simulator-studio/lib/carousel";
import { useIsMobile } from "@/features/simulator-studio/hooks/use-mobile";

interface CarouselContentProps {
  items: CarouselItem[];
  isLoading: boolean;
  visibleItems?: number[];
}

export const CarouselContent = ({ items, isLoading, visibleItems = [] }: CarouselContentProps) => {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        // For now, all items are visible to fix the navigation issue
        const isVisible = true; // visibleItems.length === 0 || visibleItems.includes(index);
        
        return (
          <motion.div 
            key={index} 
            className={`pl-4 min-w-0 shrink-0 grow-0 ${isMobile ? 'basis-[85%]' : 'basis-1/3'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <div className="p-1 h-full">
              {isVisible ? (
                <CarouselCard 
                  item={item} 
                  controlLabels={getControlLabels(item.title)}
                  simulatorPath={getSimulatorPath(item.title)}
                />
              ) : (
                <div className="h-full bg-slate-800/20 border border-slate-700/30 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse h-8 w-8 rounded-full bg-slate-700/50"></div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
