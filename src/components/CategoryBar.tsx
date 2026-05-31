import { CATEGORIES } from '../lib/mockData';

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function CategoryBar({ activeCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat
              ? 'bg-red-600 text-white'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
