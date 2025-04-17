
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  timeRange: number[];
  budget: number[];
  type: string;
  searchQuery?: string;
  sortBy?: 'rating' | 'cost' | 'duration';
  sortDirection?: 'asc' | 'desc';
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    timeRange: [2], // Days
    budget: [500], // Rupees
    type: 'all',
    searchQuery: '',
    sortBy: 'rating',
    sortDirection: 'desc'
  });

  const [searchInput, setSearchInput] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const adventureTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'outdoors', label: 'Outdoors' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'food', label: 'Food & Drink' },
    { id: 'entertainment', label: 'Entertainment' },
  ];

  const sortOptions = [
    { id: 'rating-desc', label: 'Top Rated' },
    { id: 'cost-asc', label: 'Price: Low to High' },
    { id: 'cost-desc', label: 'Price: High to Low' },
    { id: 'duration-asc', label: 'Duration: Shortest' },
    { id: 'duration-desc', label: 'Duration: Longest' },
  ];

  const handleTimeChange = (value: number[]) => {
    const newFilters = { ...filters, timeRange: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBudgetChange = (value: number[]) => {
    const newFilters = { ...filters, budget: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTypeChange = (type: string) => {
    const newFilters = { ...filters, type };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to delay the search
    const timeout = setTimeout(() => {
      const newFilters = { ...filters, searchQuery: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const clearSearch = () => {
    setSearchInput('');
    const newFilters = { ...filters, searchQuery: '' };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortOption: string) => {
    const [sortBy, sortDirection] = sortOption.split('-') as [FilterValues['sortBy'], FilterValues['sortDirection']];
    const newFilters = { ...filters, sortBy, sortDirection };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search adventures..."
          value={searchInput}
          onChange={handleSearchInputChange}
          className="pl-10 pr-10"
        />
        {searchInput && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Time Available</h3>
        <div className="px-2">
          <Slider
            defaultValue={filters.timeRange}
            max={7}
            min={1}
            step={1}
            onValueChange={handleTimeChange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1 day</span>
            <span>{filters.timeRange[0]} {filters.timeRange[0] === 1 ? 'day' : 'days'}</span>
            <span>7 days</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Budget</h3>
        <div className="px-2">
          <Slider
            defaultValue={filters.budget}
            max={50000}
            min={0}
            step={1000}
            onValueChange={handleBudgetChange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹0</span>
            <span>₹{filters.budget[0]}</span>
            <span>₹50,000+</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adventure Type</h3>
        <div className="flex flex-wrap gap-2">
          {adventureTypes.map((type) => (
            <Button
              key={type.id}
              variant={filters.type === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeChange(type.id)}
              className={`rounded-full ${
                filters.type === type.id 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'border-primary/20 text-primary hover:bg-primary/5'
              }`}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sort By</h3>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.id}
              variant={`${filters.sortBy}-${filters.sortDirection}` === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange(option.id)}
              className={`rounded-full ${
                `${filters.sortBy}-${filters.sortDirection}` === option.id
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'border-primary/20 text-primary hover:bg-primary/5'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
