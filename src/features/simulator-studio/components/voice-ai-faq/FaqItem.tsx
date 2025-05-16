
import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

interface FaqItemProps {
  item: {
    question: string;
    answer: string;
  };
  categoryTitle: string;
  index: number;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, categoryTitle, index }) => {
  return (
    <AccordionItem
      value={`${categoryTitle}-${index}`}
      className="border rounded-md bg-slate-50 overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-slate-100 text-left text-sm font-medium">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="px-4 py-3 text-sm">
        <div className="text-slate-700 mb-3">{item.answer}</div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FaqItem;
