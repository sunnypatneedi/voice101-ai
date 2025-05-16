import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/features/simulator-studio/hooks/use-mobile";
import { CarouselItem } from "@/features/simulator-studio/lib/carousel";

export const useCarousel = (totalItems: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const isMobile = useIsMobile();
  
  // Set slidesToScroll based on screen size
  const slidesToScroll = isMobile ? 1 : 3;
  
  // Modified to use containScroll: "keepSnaps" to allow partial next slide visibility
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: isMobile ? "start" : "center",
    loop: true,
    slidesToScroll: slidesToScroll,
    containScroll: "keepSnaps", // Allow partial next card visibility
    dragFree: true,
  });
  
  // Calculate number of groups (each group has slidesToScroll slides)
  const totalGroups = Math.ceil(totalItems / slidesToScroll);

  // Track which items are visible for lazy loading - Load more items to ensure smooth transitions
  useEffect(() => {
    if (!emblaApi) return;
    
    const updateVisibleItems = () => {
      // Get all items - this ensures we always have items to display
      // This is a temporary fix to make sure all cards are visible
      const itemsToLoad = new Set<number>();
      
      // Just load all items - solves the immediate visibility issue
      for (let i = 0; i < totalItems; i++) {
        itemsToLoad.add(i);
      }
      
      setVisibleItems(Array.from(itemsToLoad));
    };

    // Initially set visible items
    updateVisibleItems();
    
    // Update visible items when slides change
    emblaApi.on('select', updateVisibleItems);
    emblaApi.on('reInit', updateVisibleItems);
    
    return () => {
      emblaApi.off('select', updateVisibleItems);
      emblaApi.off('reInit', updateVisibleItems);
    };
  }, [emblaApi, totalItems, slidesToScroll, totalGroups]);
  
  // Simulate loading for demo purposes - reduced time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle keyboard navigation - move by groups based on screen size
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!emblaApi) return;
      
      if (event.key === "ArrowRight") {
        const nextGroup = Math.min(Math.floor(currentSlide / slidesToScroll) + 1, totalGroups - 1);
        emblaApi.scrollTo(nextGroup * slidesToScroll);
        setCurrentSlide(nextGroup * slidesToScroll);
      } else if (event.key === "ArrowLeft") {
        const prevGroup = Math.max(Math.floor(currentSlide / slidesToScroll) - 1, 0);
        emblaApi.scrollTo(prevGroup * slidesToScroll);
        setCurrentSlide(prevGroup * slidesToScroll);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [emblaApi, currentSlide, totalGroups, slidesToScroll]);

  // Update current slide when carousel scrolls
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      // Round to the nearest group based on slidesToScroll
      setCurrentSlide(Math.floor(index / slidesToScroll) * slidesToScroll);
    };

    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, slidesToScroll]);

  // Handle custom navigation for groups of slides
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    const currentGroup = Math.floor(currentSlide / slidesToScroll);
    const prevGroup = (currentGroup - 1 + totalGroups) % totalGroups;
    emblaApi.scrollTo(prevGroup * slidesToScroll);
    setCurrentSlide(prevGroup * slidesToScroll);
  }, [emblaApi, currentSlide, totalGroups, slidesToScroll]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    const currentGroup = Math.floor(currentSlide / slidesToScroll);
    const nextGroup = (currentGroup + 1) % totalGroups;
    emblaApi.scrollTo(nextGroup * slidesToScroll);
    setCurrentSlide(nextGroup * slidesToScroll);
  }, [emblaApi, currentSlide, totalGroups, slidesToScroll]);

  return {
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
  };
};
