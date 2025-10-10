import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FilterPanel } from './FilterPanel';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: any) => void;
  searchQuery: string;
  filters: any;
}

export function SearchBar({ onSearch, onFiltersChange, searchQuery, filters }: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const hasActiveFilters = Object.values(filters).some((filter: any) => 
    Array.isArray(filter) ? filter.length > 0 : filter !== ''
  ) || filters.priceRange.min > 0 || filters.priceRange.max < 500;

  return (
    <div className="flex items-center gap-3 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search courses, instructors, or topics..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 h-12 text-base"
        />
      </div>
      
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="lg"
            className={`px-4 h-12 ${hasActiveFilters ? 'border-primary bg-primary/5' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                •
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <FilterPanel 
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClose={() => setIsFilterOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
