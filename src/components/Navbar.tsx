
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, ExternalLink } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return <nav className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/assets/images/logo.png" alt="Voice101 Logo" className="w-20 h-20" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/foundational-terms" className={`relative font-medium ${isActive('/foundational-terms') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'} transition-colors`}>
            Foundational Terms
            {isActive('/foundational-terms') && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>}
          </Link>
          <Link to="/advanced-concepts" className={`relative font-medium ${isActive('/advanced-concepts') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'} transition-colors`}>
            Advanced Concepts
            {isActive('/advanced-concepts') && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>}
          </Link>
          <Link to="/faq" className={`relative font-medium ${isActive('/faq') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'} transition-colors`}>
            FAQs
            {isActive('/faq') && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>}
          </Link>
          <Link to="/simulator-studio" className={`relative font-medium ${isActive('/simulator-studio') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'} transition-colors`}>
            Simulator Studio
            {isActive('/simulator-studio') && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>}
          </Link>
          <a href="https://voiceaiandvoiceagents.com/" target="_blank" rel="noopener noreferrer" className="bg-accent/20 hover:bg-accent/30 text-accent font-medium px-4 py-2 rounded-md border border-accent/40 transition-colors flex items-center gap-2">
            <span>Voice AI & Voice Agents</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden bg-card border-t border-border/40 animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link to="/foundational-terms" className={`px-3 py-2 rounded-md ${isActive('/foundational-terms') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'}`} onClick={() => setIsMenuOpen(false)}>
              Foundational Terms
            </Link>
            <Link to="/advanced-concepts" className={`px-3 py-2 rounded-md ${isActive('/advanced-concepts') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'}`} onClick={() => setIsMenuOpen(false)}>
              Advanced Concepts
            </Link>
            <Link to="/faq" className={`px-3 py-2 rounded-md ${isActive('/faq') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'}`} onClick={() => setIsMenuOpen(false)}>
              FAQs
            </Link>
            <Link to="/simulator-studio" className={`px-3 py-2 rounded-md ${isActive('/simulator-studio') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'}`} onClick={() => setIsMenuOpen(false)}>
              Simulator Studio
            </Link>
            <a href="https://voiceaiandvoiceagents.com/" target="_blank" rel="noopener noreferrer" className="bg-accent/20 hover:bg-accent/30 text-accent font-medium px-3 py-2 rounded-md border border-accent/40 flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <span>Voice AI & Voice Agents</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link to="/" className="bg-primary/10 hover:bg-primary/20 text-primary font-medium px-3 py-2 rounded-md border border-primary/30 flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <BookOpen className="w-4 h-4" />
              <span>Book</span>
            </Link>
          </div>
        </div>}
    </nav>;
};
export default Navbar;
