import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Card className="space-y-3 border-slate-200 bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
            <button
              type="button"
              onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="text-sm font-semibold text-slate-800 md:text-base">{item.question}</span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600">
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: isOpen ? '200px' : '0px',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="pt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
