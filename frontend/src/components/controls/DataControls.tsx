'use client';

import React, { useState } from 'react';
import { PlayerCategory, FilterType } from '@/lib/api';

interface DataControlsProps {
  selectedCategory: PlayerCategory;
  onCategoryChange: (category: PlayerCategory) => void;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const DataControls: React.FC<DataControlsProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedFilter,
  onFilterChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filters: FilterType[] = ['This Season', 'Vs. Opponent', 'At Venue'];
  const categories: PlayerCategory[] = ['Batsmen', 'Bowlers', 'All Rounders'];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filter Dropdown */}
      <div className="dropdown-container relative w-full md:w-[300px] mx-auto md:mx-0">
        <button
          className="w-full bg-card text-text-primary py-4 px-6 rounded-xl flex items-center justify-between hover:bg-accent-primary/10 transition-colors shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <span className="text-lg md:text-xl font-semibold">{selectedFilter}</span>
          <svg 
            className={`w-5 h-5 md:w-6 md:h-6 text-accent-primary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute mt-2 w-full bg-card rounded-xl shadow-xl py-2 z-20 animate-fadeIn">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`w-full px-6 py-4 md:py-3 text-left hover:bg-accent-primary/10 transition-colors ${
                  selectedFilter === filter ? 'text-accent-primary' : 'text-text-primary'
                } text-base md:text-lg`}
                onClick={() => {
                  onFilterChange(filter);
                  setIsDropdownOpen(false);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Player Type Tabs */}
      <div className="grid grid-cols-3 gap-2 md:flex md:gap-4 bg-card rounded-xl p-1.5 shadow-lg">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-3 px-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-accent-primary text-text-primary shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-accent-primary/10'
            } flex items-center justify-center text-center`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataControls; 