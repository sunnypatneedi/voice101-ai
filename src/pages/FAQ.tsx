
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BookLayout from '../components/BookLayout';

import CategorySelector from '../components/FAQ/CategorySelector';
import FAQAccordion from '../components/FAQ/FAQAccordion';
import CategoryInsight from '../components/FAQ/CategoryInsight';
import SearchBar from '../components/FAQ/SearchBar';
import CategorySection from '../components/FAQ/CategorySection';
import { faqData, FAQDataType } from '../data/faqData';

const FAQ = () => {
  const categories = Object.keys(faqData);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const filteredFAQs = searchQuery
    ? Object.entries(faqData).flatMap(([category, categoryData]) => {
        const filtered = categoryData.faqs.filter(item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filtered.length ? [{ category, items: filtered }] : [];
      })
    : [];
  
  return (
    <BookLayout title="FAQs & Insights">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </div>
      
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      
      {!searchQuery ? (
        <>
          <CategorySelector 
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
          
          <div className="mt-12">
            <CategoryInsight category={activeCategory} />
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <FAQAccordion faqs={faqData[activeCategory].faqs} />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((categoryData, index) => (
              <CategorySection 
                key={index}
                category={categoryData.category}
                faqs={categoryData.items}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/80">No results found for "{searchQuery}"</p>
              <button
                className="mt-4 text-primary hover:underline"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </BookLayout>
  );
};

export default FAQ;
