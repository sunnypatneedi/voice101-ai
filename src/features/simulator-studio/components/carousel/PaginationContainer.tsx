
import React, { ReactNode } from "react";

interface PaginationContainerProps {
  children: ReactNode;
}

export const PaginationContainer = ({ children }: PaginationContainerProps) => {
  return (
    <div className="flex justify-center mt-6 gap-3 py-2">
      {children}
    </div>
  );
};
