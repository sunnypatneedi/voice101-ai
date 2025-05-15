
import { Badge } from "@/components/ui/badge";

interface CategorySelectorProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector = ({ categories, activeCategory, onSelectCategory }: CategorySelectorProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium mb-2 text-foreground/70">Categories</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`cursor-pointer px-3 py-2 h-auto text-sm hover:bg-primary/20 ${
              activeCategory === category ? 'bg-primary text-primary-foreground' : 'bg-secondary/50'
            }`}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
