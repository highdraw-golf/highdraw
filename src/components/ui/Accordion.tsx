import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : [items[0]?.id]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setOpenIds(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div key={item.id} className="py-4">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {item.icon && <span className="text-slate-500 group-hover:text-[#B12535] transition-colors">{item.icon}</span>}
                <span className="font-serif text-base font-bold text-[#1A1F26] group-hover:text-[#B12535] transition-colors">
                  {item.title}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 group-hover:text-slate-700 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-[#B12535]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="pt-3 pb-1 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-200">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
