
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" />
      <Input
        type="text"
        placeholder="Search for questions or answers..."
        className="pl-10 bg-background/50"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
