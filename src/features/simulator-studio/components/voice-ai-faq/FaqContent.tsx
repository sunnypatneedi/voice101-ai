
import React from "react";
import FaqCategory from "./FaqCategory";
import { FaqCategory as FaqCategoryType } from "./faqData";

interface FaqContentProps {
  filteredCategories: FaqCategoryType[];
  expandedCategories: string[];
  toggleCategory: (category: string) => void;
}

const FaqContent: React.FC<FaqContentProps> = ({
  filteredCategories,
  expandedCategories,
  toggleCategory,
}) => {
  return (
    <div className="px-4 py-2 overflow-y-auto max-h-[calc(90vh-10rem)]">
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category, index) => (
          <FaqCategory
            key={index}
            category={category}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
          />
        ))
      ) : (
        <p className="text-center py-8 text-slate-500">No questions match your search.</p>
      )}
    </div>
  );
};

export default FaqContent;
