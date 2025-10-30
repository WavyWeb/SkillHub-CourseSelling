import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthDialog } from '@/components/AuthDialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/store/auth-store';
import { BookOpen, Users, Star, Clock, User, LogOut } from 'lucide-react';
import { useState } from 'react';

// Mock course data
const featuredCourses = [
  {
    id: 'course-1',
    title: 'Complete React Development Course',
    description: 'Master React from basics to advanced concepts with hands-on projects',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    students: 12547,
    duration: '42 hours',
    price: 99,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
  },
  {
    id: 'course-2',
    title: 'Python for Data Science',
    description: 'Learn Python programming and data analysis with real-world projects',
    instructor: 'Michael Chen',
    rating: 4.7,
    students: 8932,
    duration: '35 hours',
    price: 89,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop'
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Masterclass',
    description: 'Create beautiful and user-friendly interfaces from scratch',
    instructor: 'Emily Rodriguez',
    rating: 4.9,
    students: 15632,
    duration: '28 hours',
    price: 79,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop'
  }
];

function HomePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-primary">SkillHub</h1>
                <span className="text-muted-foreground hidden sm:block">Learn. Grow. Succeed.</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link to="/courses">All Courses</Link>
              </Button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => logout()} size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthDialog(true)}>Get Started</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Career with 
              <span className="text-primary"> Expert-Led Courses</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners mastering in-demand skills through interactive courses, 
              community discussions, and hands-on projects.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button asChild size="lg" className="px-8">
                <Link to="/courses">Browse Courses</Link>
              </Button>
              {!isAuthenticated && (
                <Button variant="outline" size="lg" onClick={() => setShowAuthDialog(true)}>
                  Get Started Free
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">What would you like to learn?</h2>
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for courses, skills, or topics..."
                  className="w-full pl-12 pr-4 py-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button size="lg" asChild className="px-6">
                <Link to="/courses">Search</Link>
              </Button>
            </div>
          </div>
          
          {/* Popular Search Tags */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['React', 'Python', 'Data Science', 'UI/UX Design', 'JavaScript', 'Machine Learning'].map((tag) => (
                <Button key={tag} variant="outline" size="sm" asChild>
                  <Link to={`/courses?search=${encodeURIComponent(tag)}`}>{tag}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
          <p className="text-muted-foreground text-lg">
            Start your learning journey with our most popular courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-black hover:bg-white">
                    ${course.price}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
                <div className="text-sm text-muted-foreground">
                  by {course.instructor}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
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
      </div>

      {/* Features */}
      <div className="bg-card border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SkillHub?</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for effective online learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert-Led Content</h3>
              <p className="text-muted-foreground">
                Learn from industry professionals with real-world experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Discussion</h3>
              <p className="text-muted-foreground">
                Connect with peers and get help through course forums
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certificates</h3>
              <p className="text-muted-foreground">
                Earn certificates to showcase your new skills to employers
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}

export default HomePage; 
