
import React, { useMemo } from "react";
import { carouselData } from "@/features/simulator-studio/lib/carousel";
import { CarouselContent } from "@/features/simulator-studio/components/carousel/CarouselContent";
import { CarouselPagination } from "@/features/simulator-studio/components/carousel/CarouselPagination";
import { CarouselNavButtons } from "@/features/simulator-studio/components/carousel/CarouselNavButtons";
import { CarouselSkeleton } from "@/features/simulator-studio/components/carousel/CarouselSkeleton";
import { useCarousel } from "@/features/simulator-studio/hooks/useCarousel";
import { motion, AnimatePresence } from "framer-motion";

const VoiceAICarousel = () => {
  const {
    emblaRef,
    emblaApi,
    currentSlide,
    setCurrentSlide,
    isLoading,
    slidesToScroll,
    totalGroups,
    scrollPrev,
    scrollNext,
    visibleItems
  } = useCarousel(carouselData.length);
  
  // We'll use all items instead of filtering by visibility to ensure smooth transitions
  const carouselItems = useMemo(() => carouselData, []);

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Voice AI Prototype Gallery
      </motion.h2>
      
      <div className="w-full max-w-6xl mx-auto" aria-live="polite">
        <div ref={emblaRef} className="overflow-visible">
          <div className="flex -ml-4 transition-all duration-700 ease-out">
            <AnimatePresence>
              {isLoading ? (
                <CarouselSkeleton />
              ) : (
                <CarouselContent 
                  items={carouselItems} 
                  isLoading={isLoading} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <CarouselNavButtons scrollPrev={scrollPrev} scrollNext={scrollNext} />
      </div>
      
      <CarouselPagination 
        currentSlide={currentSlide}
        totalGroups={totalGroups}
        emblaApi={emblaApi}
        setCurrentSlide={setCurrentSlide}
        slidesToScroll={slidesToScroll}
      />
    </motion.div>
  );
};

export default VoiceAICarousel;
