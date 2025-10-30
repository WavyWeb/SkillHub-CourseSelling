import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { SortSelect } from '@/components/SortSelect';
import { CourseGrid } from '@/components/CourseGrid';
import { useCourseSearch } from '@/hooks/useCourseSearch';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthDialog } from '@/components/AuthDialog';
import { useAuthStore } from '@/store/auth-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { useState } from 'react';

function CoursesPage() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const {
    courses,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    totalCourses,
    filteredCount,
    isLoading
  } = useCourseSearch();

  // Handle URL search parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams, setSearchQuery]);

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      instructors: [],
      rating: 0,
      priceRange: { min: 0, max: 500 },
      duration: []
    });
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || 
                          filters.categories.length > 0 || 
                          filters.instructors.length > 0 || 
                          filters.rating > 0 || 
                          filters.priceRange.min > 0 || 
                          filters.priceRange.max < 500 ||
                          filters.duration.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  SkillHub
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">All Courses</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild size="sm">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => logout()} size="sm">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setShowAuthDialog(true)}>
                  Login
                </Button>
              )}
              <SortSelect value={sortBy} onValueChange={setSortBy} />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Showing {filteredCount} of {totalCourses} courses
            </span>
            
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all filters
              </Button>
            )}
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.categories.length} Categories
                </Badge>
              )}
              {filters.instructors.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.instructors.length} Instructors
                </Badge>
              )}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.rating}+ Stars
                </Badge>
              )}
              {filters.duration.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.duration.length} Duration
                </Badge>
              )}
              {(filters.priceRange.min > 0 || filters.priceRange.max < 500) && (
                <Badge variant="secondary" className="text-xs">
                  ${filters.priceRange.min}-${filters.priceRange.max}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Course Grid */}
        <CourseGrid courses={courses} loading={isLoading} />

        {/* Load More Button (if needed for pagination) */}
        {filteredCount > 0 && filteredCount >= 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Courses
            </Button>
          </div>
        )}
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}

export default CoursesPage;
