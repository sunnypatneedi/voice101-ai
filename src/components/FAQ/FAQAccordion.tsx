
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

const FAQAccordion = ({ faqs }: FAQAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index}`}
          className="bg-card px-4 rounded-lg border"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <span className="text-left font-medium">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="py-4 text-foreground/80">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;
