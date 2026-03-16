'use client';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { id: 'Burger', name: 'Burger', emoji: '🍔' },
  { id: 'Pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'Döner', name: 'Döner', emoji: '🌯' },
  { id: 'Fast Food', name: 'Fast Food', emoji: '🍟' },
  { id: 'Tatlı', name: 'Tatlı', emoji: '🍰' },
  { id: 'Kahve', name: 'Kahve', emoji: '☕' },
  { id: 'Salata', name: 'Salata', emoji: '🥗' },
  { id: 'Sushi', name: 'Sushi', emoji: '🍱' },
  { id: 'Pide', name: 'Pide', emoji: '🥙' },
  { id: 'Lahmacun', name: 'Lahmacun', emoji: '🫓' },
  { id: 'Çorba', name: 'Çorba', emoji: '🍲' },
  { id: 'Tavuk', name: 'Tavuk', emoji: '🍗' },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 border-2 ${
              isActive
                ? 'bg-primary border-primary text-white shadow-md scale-105'
                : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            <span className="text-lg leading-none">{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export { CATEGORIES };
