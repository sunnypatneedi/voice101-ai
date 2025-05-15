
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { faqData } from "@/data/faqData";

interface CategoryInsightProps {
  category: string;
}

const CategoryInsight = ({ category }: CategoryInsightProps) => {
  const insight = faqData[category]?.insight || "No specific insight available for this category.";
  
  return (
    <Card className="bg-primary/10 border-primary/20 mb-6 p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-primary mt-1 shrink-0" />
        <div>
          <div className="font-semibold mb-2">Insight:</div>
          <div>{insight}</div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryInsight;
