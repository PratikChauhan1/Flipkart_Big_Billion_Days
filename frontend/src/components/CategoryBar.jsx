import React from 'react';
import { Smartphone, Laptop, Shirt, Tv, Home, ShoppingBag, Sparkles } from 'lucide-react';

const categories = [
  { id: 'All', name: 'All Categories', icon: Sparkles },
  { id: 'Mobiles', name: 'Mobiles', icon: Smartphone },
  { id: 'Electronics', name: 'Electronics', icon: Laptop },
  { id: 'Fashion', name: 'Fashion', icon: Shirt },
  { id: 'Appliances', name: 'Appliances', icon: Tv },
  { id: 'Home', name: 'Home & Kitchen', icon: Home },
  { id: 'Grocery', name: 'Grocery', icon: ShoppingBag }
];

export default function CategoryBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between sm:justify-center sm:gap-12 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-sm transition whitespace-nowrap group ${
                isSelected 
                  ? 'text-flipkart-blue font-bold border-b-2 border-flipkart-blue' 
                  : 'text-gray-700 hover:text-flipkart-blue'
              }`}
            >
              <div className={`p-2 rounded-full transition ${
                isSelected ? 'bg-blue-50 text-flipkart-blue' : 'group-hover:bg-gray-100'
              }`}>
                <Icon size={20} />
              </div>
              <span className="text-xs tracking-tight">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
