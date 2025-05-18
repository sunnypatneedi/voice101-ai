
import React from "react";
import { UseEmblaCarouselType } from "embla-carousel-react";
import { PaginationDot } from "@/features/simulator-studio/components/carousel/PaginationDot";
import { PaginationContainer } from "@/features/simulator-studio/components/carousel/PaginationContainer";

interface CarouselPaginationProps {
  currentSlide: number;
  totalGroups: number;
  emblaApi: UseEmblaCarouselType[1] | undefined;
  setCurrentSlide: (index: number) => void;
  slidesToScroll: number;
}

export const CarouselPagination = ({ 
  currentSlide, 
  totalGroups, 
  emblaApi, 
  setCurrentSlide,
  slidesToScroll = 3
}: CarouselPaginationProps) => {
  // Get the current group based on the currentSlide and slidesToScroll
  const currentGroup = Math.floor(currentSlide / slidesToScroll);
  
  const handleDotClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index * slidesToScroll);
      setCurrentSlide(index * slidesToScroll);
    }
  };

  return (
    <PaginationContainer>
      {Array.from({ length: totalGroups }).map((_, index) => (
        <PaginationDot 
          key={index}
          isActive={currentGroup === index}
          ariaLabel={`Go to slide group ${index + 1}`}
          onClick={() => handleDotClick(index)}
        />
      ))}
    </PaginationContainer>
  );
};
