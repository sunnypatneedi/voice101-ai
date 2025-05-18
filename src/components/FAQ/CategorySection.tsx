
import CategoryInsight from "./CategoryInsight";
import FAQAccordion from "./FAQAccordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface CategorySectionProps {
  category: string;
  faqs: FAQItem[];
}

const CategorySection = ({ category, faqs }: CategorySectionProps) => {
  if (faqs.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">{category}</h2>
      <CategoryInsight category={category} />
      <FAQAccordion faqs={faqs} />
    </div>
  );
};

export default CategorySection;
