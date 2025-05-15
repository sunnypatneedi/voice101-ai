
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BookLayout from '../components/BookLayout';
import { getTermBySlug } from '../data/terms';

const TermDetail = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const term = getTermBySlug(id || '');
  
  if (!term) {
    return (
      <BookLayout title="Term Not Found">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Term Not Found</h2>
          <p className="text-foreground/80 mb-6">The term you're looking for doesn't exist or has been moved.</p>
          <Link to="/foundational-terms" className="text-primary hover:underline">
            Go back to all terms
          </Link>
        </div>
      </BookLayout>
    );
  }
  
  return (
    <BookLayout title={term.title}>
      <div className="mb-8">
        <Link to="/foundational-terms" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all terms</span>
        </Link>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-foreground/80 mb-6">{term.description}</p>
        
        {term.sections?.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}
        
        {term.examples && term.examples.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Examples</h2>
            <ul className="space-y-4">
              {term.examples.map((example, index) => (
                <li key={index}>
                  <div dangerouslySetInnerHTML={{ __html: example }} />
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {term.resources && term.resources.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <ul className="space-y-2">
              {term.resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BookLayout>
  );
};

export default TermDetail;
