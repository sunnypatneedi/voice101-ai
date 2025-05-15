
import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';

interface BookLayoutProps {
  children: ReactNode;
  title?: string;
}
const BookLayout = ({
  children,
  title
}: BookLayoutProps) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {title && <div className="mb-8 flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          </div>}
        {children}
      </main>
      
      <footer className="mt-auto glass-effect py-6 px-4">
        <div className="container mx-auto text-center text-sm text-foreground/60">
          <p>Voice101 - Intro to VoiceAI. Key Terms and Concepts for Engineers </p>
          <p className="mt-2">❤️ Inspired by voiceaiandvoiceagents.com and Maven Voice Agents Course</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <a 
              href="https://github.com/sunnypatneedi/voice101-ai.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" /> View and contribute to this on GitHub
            </a>
          </div>
          <p className="mt-2">© {new Date().getFullYear()} Voice101 Book</p>
        </div>
      </footer>
    </div>;
};
export default BookLayout;
