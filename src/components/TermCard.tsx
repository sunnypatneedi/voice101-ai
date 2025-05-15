
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TermCardProps {
  id: string;
  title: string;
  description: string;
  category: 'foundational' | 'advanced';
}

const TermCard = ({ id, title, description, category }: TermCardProps) => {
  return (
    <Link 
      to={`/term/${category}/${id}`}
      className="block"
    >
      <div className="group card-hover-effect h-full bg-card rounded-lg p-6 border border-border/50 flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-foreground/80 text-sm flex-grow line-clamp-3 mb-4">
          {description}
        </p>
        <div className="flex items-center text-primary text-sm font-medium">
          Read more
          <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default TermCard;
