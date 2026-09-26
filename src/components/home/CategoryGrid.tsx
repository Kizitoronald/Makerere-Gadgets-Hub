import React from 'react';
import { Category } from '../../types';
import { 
  Zap, 
  Headphones, 
  Radio, 
  Volume2, 
  Power, 
  Flame, 
  BatteryCharging, 
  Watch, 
  Smartphone, 
  Laptop, 
  Home, 
  Grid 
} from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Volume2': return <Volume2 className="w-5 h-5" />;
      case 'Power': return <Power className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'BatteryCharging': return <BatteryCharging className="w-5 h-5" />;
      case 'Watch': return <Watch className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      default: return <Grid className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Browse by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Student-priced electronics for study, hostel cooking, audio & charging
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 mt-2 sm:mt-0 underline underline-offset-4"
            >
              Clear filter ({selectedCategory})
            </button>
          )}
        </div>

        {/* 12 Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map(category => {
            const isSelected = selectedCategory.toLowerCase() === category.name.toLowerCase();
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : category.name)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-sky-400'
                    : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-white text-slate-700 group-hover:text-sky-600 shadow-xs'
                  }`}
                >
                  {getCategoryIcon(category.iconName)}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold line-clamp-1">
                    {category.name}
                  </h3>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {category.itemCount || 0} items
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
