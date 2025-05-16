
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BookLayout from '../components/BookLayout';
import TermCard from '../components/TermCard';
import { terms } from '../data/terms';
import { Button } from '@/components/ui/button';

const AdvancedConcepts = () => {
  const advancedTerms = terms.filter(term => term.category === 'advanced');
  
  return (
    <BookLayout title="Advanced Concepts">
      <Button asChild variant="ghost" className="mb-4 -ml-4">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <div className="animate-fade-in">
        <div className="mb-12">
          <p className="text-lg text-foreground/80 max-w-3xl">
            Explore sophisticated techniques and methodologies used in production-grade Voice AI systems.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedTerms.map((term) => (
            <TermCard 
              key={term.id}
              id={term.id}
              title={term.title}
              description={term.description}
              category={term.category}
            />
          ))}
        </div>
      </div>
    </BookLayout>
  );
};

export default AdvancedConcepts;
