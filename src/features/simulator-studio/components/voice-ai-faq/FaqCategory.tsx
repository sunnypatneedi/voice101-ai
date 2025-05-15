
import React from "react";
import { Accordion } from "../ui/accordion";
import FaqItem from "./FaqItem";
import { FaqCategory as FaqCategoryType } from "./faqData";
import { Info } from "lucide-react";

interface FaqCategoryProps {
  category: FaqCategoryType;
  expandedCategories: string[];
  toggleCategory: (category: string) => void;
}

const FaqCategory: React.FC<FaqCategoryProps> = ({
  category,
  expandedCategories,
  toggleCategory,
}) => {
  const isExpanded = expandedCategories.includes(category.title);
  
  return (
    <div className="mb-6">
      <h3
        className="text-sm font-semibold text-blue-600 mb-2 flex items-center cursor-pointer hover:underline"
        onClick={() => toggleCategory(category.title)}
      >
        {category.title}
      </h3>
      
      {/* Display insight at the category level */}
      {isExpanded && category.insight && (
        <div className="flex items-start mb-4 bg-blue-100 p-4 rounded-lg border-2 border-blue-400 shadow-md">
          <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-blue-800">
            <span className="font-bold text-blue-700 block mb-1">Insight:</span>
            <p>{category.insight}</p>
          </div>
        </div>
      )}
      
      <Accordion
        type="multiple"
        className="space-y-2"
        defaultValue={category.questions.map((_, i) => `${category.title}-${i}`)}
        value={isExpanded ? category.questions.map((_, i) => `${category.title}-${i}`) : []}
      >
        {category.questions.map((item, qIndex) => (
          <FaqItem
            key={qIndex}
            item={item}
            categoryTitle={category.title}
            index={qIndex}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default FaqCategory;
