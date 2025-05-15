
import BookLayout from '../components/BookLayout';
import TermCard from '../components/TermCard';
import { terms } from '../data/terms';
import { Separator } from "@/components/ui/separator";

const FoundationalTerms = () => {
  const foundationalTerms = terms.filter(term => term.category === 'foundational');
  
  // Group terms into sections
  const coreTerms = ['stt', 'tts', 'ttft', 'turn', 'wake-word', 'nlu'].map(
    id => foundationalTerms.find(term => term.id === id)
  ).filter(Boolean);
  
  const audioTerms = ['aec', 'agc', 'opus', 'pcm', 'jitter-buffer'].map(
    id => foundationalTerms.find(term => term.id === id)
  ).filter(Boolean);

  const networkTerms = ['pstn', 'sip', 'dtmf', 'edge-routing', 'quic', 'moq', 'p50-p95'].map(
    id => foundationalTerms.find(term => term.id === id)
  ).filter(Boolean);
  
  const optimizationTerms = ['token-caching', 'warm-transfer', 'word-level-timestamps', 'context-summarization'].map(
    id => foundationalTerms.find(term => term.id === id)
  ).filter(Boolean);
  
  const complianceTerms = ['hipaa-baa', 'coppa', 'phi'].map(
    id => foundationalTerms.find(term => term.id === id)
  ).filter(Boolean);
  
  return (
    <BookLayout title="Foundational Terms">
      <div className="animate-fade-in">
        <div className="mb-12">
          <p className="text-lg text-foreground/80 max-w-3xl">
            Master these essential Voice AI concepts that form the building blocks of any voice-enabled application.
          </p>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Core Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreTerms.map((term) => term && (
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
        
        <Separator className="my-12" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Audio Processing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioTerms.map((term) => term && (
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
        
        <Separator className="my-12" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Networking & Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkTerms.map((term) => term && (
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
        
        <Separator className="my-12" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Optimization Techniques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizationTerms.map((term) => term && (
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
        
        <Separator className="my-12" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Compliance & Regulations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceTerms.map((term) => term && (
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
      </div>
    </BookLayout>
  );
};

export default FoundationalTerms;
