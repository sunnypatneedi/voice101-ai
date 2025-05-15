
import React from "react";
import { Skeleton } from "@/features/simulator-studio/components/ui/skeleton";
import { useIsMobile } from "@/features/simulator-studio/hooks/use-mobile";

export const CarouselSkeleton = () => {
  const isMobile = useIsMobile();
  const count = isMobile ? 3 : 9;
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={`pl-4 min-w-0 shrink-0 grow-0 ${isMobile ? 'basis-[85%]' : 'basis-1/3'}`}
        >
          <div className="p-1 h-full">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg h-[450px] overflow-hidden">
              <Skeleton className="w-full h-16 rounded-t-lg bg-slate-700/50" />
              <div className="p-4 space-y-4">
                <Skeleton className="w-3/4 h-4 bg-slate-700/50" />
                <Skeleton className="w-full h-24 bg-slate-700/50" />
                <Skeleton className="w-full h-24 bg-slate-700/50" />
                <Skeleton className="w-full h-16 bg-slate-700/50" />
                <Skeleton className="w-1/2 mx-auto h-10 mt-8 bg-slate-700/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
