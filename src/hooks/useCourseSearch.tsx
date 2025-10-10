import { useState, useMemo, useEffect } from 'react';
import { table } from '@devvai/devv-code-backend';
import { checkAndSeedCourses } from '@/utils/seedCourses';
import { Course, ClientCourse, toClientCourse } from '@/types/course';

interface Filters {
  categories: string[];
  instructors: string[];
  rating: number;
  priceRange: { min: number; max: number };
  duration: string[];
}



export function useCourseSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    instructors: [],
    rating: 0,
    priceRange: { min: 0, max: 500 },
    duration: []
  });

  // Load courses from database
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        
        // Ensure sample courses exist
        await checkAndSeedCourses();
        
        // Load all courses
        const response = await table.getItems('f0jve7e5o2kg', {
          query: { status: 'published' },
          limit: 100
        });
        
        setAllCourses(response.items as Course[]);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const getDurationHours = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const matchesDurationFilter = (course: Course, durationFilters: string[]): boolean => {
    if (durationFilters.length === 0) return true;
    
    const hours = getDurationHours(course.duration);
    
    return durationFilters.some(filter => {
      switch (filter) {
        case 'Under 2 hours':
          return hours < 2;
        case '2-6 hours':
          return hours >= 2 && hours <= 6;
        case '6-17 hours':
          return hours >= 6 && hours <= 17;
        case '17+ hours':
          return hours >= 17;
        default:
          return false;
      }
    });
  };

  const filteredAndSortedCourses = useMemo(() => {
    if (isLoading || allCourses.length === 0) {
      return [];
    }

    let filtered = allCourses.filter(course => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(course.category)) {
        return false;
      }

      // Instructor filter
      if (filters.instructors.length > 0 && !filters.instructors.includes(course.instructor)) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && course.rating < filters.rating) {
        return false;
      }

      // Price range filter
      if (course.price < filters.priceRange.min || course.price > filters.priceRange.max) {
        return false;
      }

      // Duration filter
      if (!matchesDurationFilter(course, filters.duration)) {
        return false;
      }

      return true;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.students - a.students;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration-short':
          return getDurationHours(a.duration) - getDurationHours(b.duration);
        case 'duration-long':
          return getDurationHours(b.duration) - getDurationHours(a.duration);
        case 'newest':
          return b._id.localeCompare(a._id); // Newer courses have higher IDs
        case 'relevance':
        default:
          // For relevance, prioritize exact matches in title, then rating
          if (searchQuery) {
            const aExactMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
            const bExactMatch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
            if (aExactMatch !== bExactMatch) {
              return bExactMatch ? 1 : -1;
            }
          }
          return b.rating - a.rating;
      }
    });

    // Convert to client courses for components
    return filtered.map(toClientCourse);
  }, [searchQuery, sortBy, filters]);

  return {
    courses: filteredAndSortedCourses,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    totalCourses: allCourses.length,
    filteredCount: filteredAndSortedCourses.length,
    isLoading
  };
}
