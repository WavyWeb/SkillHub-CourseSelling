import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { X, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    categories: string[];
    instructors: string[];
    rating: number;
    priceRange: { min: number; max: number };
    duration: string[];
  };
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

const categories = [
  'Web Development',
  'Data Science',
  'Design',
  'Mobile Development',
  'DevOps',
  'Machine Learning',
  'Business',
  'Marketing'
];

const instructors = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Rodriguez',
  'David Kim',
  'Lisa Thompson',
  'Alex Martinez'
];

const durations = [
  'Under 2 hours',
  '2-6 hours',
  '6-17 hours',
  '17+ hours'
];

export function FilterPanel({ filters, onFiltersChange, onClose }: FilterPanelProps) {
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleInstructorChange = (instructor: string, checked: boolean) => {
    const newInstructors = checked 
      ? [...filters.instructors, instructor]
      : filters.instructors.filter(i => i !== instructor);
    
    onFiltersChange({
      ...filters,
      instructors: newInstructors
    });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      rating: value[0]
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: { min: value[0], max: value[1] }
    });
  };

  const handleDurationChange = (duration: string, checked: boolean) => {
    const newDurations = checked 
      ? [...filters.duration, duration]
      : filters.duration.filter(d => d !== duration);
    
    onFiltersChange({
      ...filters,
      duration: newDurations
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      instructors: [],
      rating: 0,
      priceRange: { min: 0, max: 500 },
      duration: []
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.instructors.length > 0 || 
                          filters.rating > 0 || 
                          filters.priceRange.min > 0 || 
                          filters.priceRange.max < 500 ||
                          filters.duration.length > 0;

  return (
    <div className="p-6 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3 mb-6">
        <Label className="text-sm font-medium">Category</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <Label htmlFor={category} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Rating */}
      <div className="space-y-3 mb-6">
        <Label className="text-sm font-medium">
          Minimum Rating ({filters.rating}+ stars)
        </Label>
        <Slider
          value={[filters.rating]}
          onValueChange={handleRatingChange}
          min={0}
          max={5}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Any Rating</span>
          <span>5 Stars</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price Range */}
      <div className="space-y-3 mb-6">
        <Label className="text-sm font-medium">
          Price Range (${filters.priceRange.min} - ${filters.priceRange.max})
        </Label>
        <Slider
          value={[filters.priceRange.min, filters.priceRange.max]}
          onValueChange={handlePriceRangeChange}
          min={0}
          max={500}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Free</span>
          <span>$500+</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Duration */}
      <div className="space-y-3 mb-6">
        <Label className="text-sm font-medium">Duration</Label>
        <div className="space-y-2">
          {durations.map((duration) => (
            <div key={duration} className="flex items-center space-x-2">
              <Checkbox
                id={duration}
                checked={filters.duration.includes(duration)}
                onCheckedChange={(checked) => 
                  handleDurationChange(duration, checked as boolean)
                }
              />
              <Label htmlFor={duration} className="text-sm">
                {duration}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Instructors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Instructor</Label>
        <div className="space-y-2">
          {instructors.map((instructor) => (
            <div key={instructor} className="flex items-center space-x-2">
              <Checkbox
                id={instructor}
                checked={filters.instructors.includes(instructor)}
                onCheckedChange={(checked) => 
                  handleInstructorChange(instructor, checked as boolean)
                }
              />
              <Label htmlFor={instructor} className="text-sm">
                {instructor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Applied Filters */}
      {hasActiveFilters && (
        <>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Label className="text-sm font-medium">Applied Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleCategoryChange(category, false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              {filters.instructors.map((instructor) => (
                <Badge key={instructor} variant="secondary" className="text-xs">
                  {instructor}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleInstructorChange(instructor, false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.rating}+ stars
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleRatingChange([0])}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {filters.duration.map((duration) => (
                <Badge key={duration} variant="secondary" className="text-xs">
                  {duration}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleDurationChange(duration, false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
