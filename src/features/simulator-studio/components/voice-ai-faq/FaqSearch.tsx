
import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface FaqSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setExpandedCategories: (categories: string[]) => void;
  faqCategories: { title: string }[];
}

const FaqSearch: React.FC<FaqSearchProps> = ({
  searchTerm,
  setSearchTerm,
  setExpandedCategories,
  faqCategories,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // Auto-expand categories with matching questions when searching
    if (e.target.value) {
      const matchingCategories = faqCategories
        .filter(category => category.title.toLowerCase().includes(e.target.value.toLowerCase()))
        .map(category => category.title);
      
      setExpandedCategories(matchingCategories);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
      <Input
        type="search"
        placeholder="Search for questions or answers..."
        className="pl-9 pr-4"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default FaqSearch;
