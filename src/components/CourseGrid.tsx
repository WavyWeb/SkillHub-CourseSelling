import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import { ClientCourse } from '@/types/course';

interface CourseGridProps {
  courses: ClientCourse[];
  loading?: boolean;
}

export function CourseGrid({ courses, loading = false }: CourseGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-muted animate-pulse" />
            <CardHeader>
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="h-3 bg-muted animate-pulse rounded w-16" />
                <div className="h-3 bg-muted animate-pulse rounded w-16" />
                <div className="h-3 bg-muted animate-pulse rounded w-16" />
              </div>
              <div className="h-9 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No courses found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Try adjusting your search terms or filters to find more courses.
        </p>
        <Button variant="outline">
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/20 backdrop-blur-sm text-white border-0">
                {course.category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-black hover:bg-white">
                ${course.price}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge variant="outline" className="bg-white/90 text-black border-0">
                {course.level}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
            <div className="text-sm text-muted-foreground">
              by <span className="font-medium text-foreground">{course.instructor}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to={`/course/${course.id}`}>
                View Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
