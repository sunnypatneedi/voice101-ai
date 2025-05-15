
import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/simulator-studio/components/ui/card";
import { Button } from "@/features/simulator-studio/components/ui/button";
import { Link } from "react-router-dom";
import { CarouselItem } from "@/features/simulator-studio/lib/carousel";
import { useIsMobile } from "@/features/simulator-studio/hooks/use-mobile";

interface CarouselCardProps {
  item: CarouselItem;
  controlLabels: string[];
  simulatorPath: string;
}

// Using React.memo to prevent unnecessary re-renders
export const CarouselCard = memo(({ item, controlLabels, simulatorPath }: CarouselCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg shadow-purple-900/20 hover:shadow-purple-700/30 transition-all duration-500 hover:translate-y-[-5px] h-full animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-t-lg pb-4">
        <CardTitle className="text-xl md:text-2xl text-center text-white">
          {item.title}
        </CardTitle>
        <p className="text-sm md:text-base text-center text-blue-200 mt-2">
          {item.tagline}
        </p>
      </CardHeader>
      
      {/* Try Simulator Button - Moved to the top below the header */}
      <div className="flex justify-center py-4 md:py-5 bg-slate-900 border-b border-slate-800">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 md:px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm md:text-base w-full md:w-auto mx-4"
          aria-label={`Try ${item.title} simulator`}
          asChild={simulatorPath !== "#"}
        >
          {simulatorPath !== "#" ? (
            <Link to={simulatorPath}>
              Try the simulator
            </Link>
          ) : (
            <span>Coming Soon</span>
          )}
        </Button>
      </div>
      
      <CardContent className="p-4 md:p-6 bg-slate-900">
        <div className="space-y-4">
          {/* Focus Area Section */}
          <div>
            <h3 className="font-semibold text-base md:text-lg text-blue-400 mb-2 md:mb-3">Focus Area:</h3>
            <p className="text-sm md:text-base text-slate-200 pl-4">{item.focusArea}</p>
          </div>
          
          {/* Key Features Section (previously In Scope) */}
          <div>
            <h3 className="font-semibold text-base md:text-lg text-green-400 mb-2 md:mb-3">Key Features:</h3>
            <ul className="space-y-1 md:space-y-2">
              {item.inScope.map((scope, i) => (
                <li key={i} className="flex items-start text-sm md:text-base">
                  <span className="text-green-400 mr-2">•</span>
                  <span className="text-slate-200">{scope}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      {/* Controls Section */}
      <div className="px-4 md:px-6 py-4 bg-slate-800 border-t border-slate-700 rounded-b-lg">
        <h3 className="font-semibold text-base md:text-lg text-blue-400 mb-3">Controls:</h3>
        <ul className="space-y-2">
          {controlLabels.map((control, i) => (
            <li key={i} className="flex items-start text-sm md:text-base">
              <span className="text-blue-400 mr-2">•</span>
              <span className="text-slate-200">{control}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
});

CarouselCard.displayName = "CarouselCard";
