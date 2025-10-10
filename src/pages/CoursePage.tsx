import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ThreadList } from '@/features/forum/components/ThreadList';
import { ThreadView } from '@/features/forum/components/ThreadView';
import { CreateThreadDialog } from '@/features/forum/components/CreateThreadDialog';
import { AuthDialog } from '@/components/AuthDialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/store/auth-store';
import { table } from '@devvai/devv-code-backend';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  MessageSquare,
  Award,
  User,
  ArrowLeft,
  LogOut,
  ShoppingCart,
  CheckCircle
} from 'lucide-react';

// Mock course data - in real app this would come from API
const mockCourse = {
  id: 'course-1',
  title: 'Complete React Development Course',
  description: 'Master React from basics to advanced concepts with hands-on projects and real-world applications.',
  instructor: 'Sarah Johnson',
  rating: 4.8,
  students: 12547,
  duration: '42 hours',
  price: 99,
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
  lessons: [
    { id: 1, title: 'Introduction to React', duration: '45 min', completed: false },
    { id: 2, title: 'Components and JSX', duration: '1.2 hours', completed: false },
    { id: 3, title: 'Props and State', duration: '1.5 hours', completed: false },
    { id: 4, title: 'Event Handling', duration: '50 min', completed: false },
    { id: 5, title: 'Hooks Deep Dive', duration: '2 hours', completed: false },
  ]
};

export default function CoursePage() {
  const { courseId } = useParams();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user, checkAuthStatus, logout } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
    if (isAuthenticated && user) {
      loadUserProgress();
    }
  }, [checkAuthStatus, isAuthenticated, user]);

  const loadUserProgress = async () => {
    if (!user || !courseId) return;

    try {
      const response = await table.getItems('f0jvejr2l62o', {
        query: {
          _uid: user.uid,
          course_id: courseId
        },
        limit: 1
      });

      if (response.items.length > 0) {
        setUserProgress(response.items[0]);
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (!user || !courseId) return;

    setIsLoading(true);
    try {
      const enrollmentData = {
        _uid: user.uid,
        course_id: courseId,
        course_title: course.title,
        progress_percentage: 0,
        lessons_completed: 0,
        total_lessons: course.lessons.length,
        time_spent: 0,
        quiz_scores: '[]',
        last_accessed: new Date().toISOString(),
        enrolled_at: new Date().toISOString(),
        certificate_earned: 'false'
      };

      await table.addItem('f0jvejr2l62o', enrollmentData);
      setIsEnrolled(true);
      await loadUserProgress();

      toast({
        title: 'Enrolled successfully!',
        description: 'You can now start learning this course.',
      });
    } catch (error) {
      console.error('Enrollment failed:', error);
      toast({
        title: 'Enrollment failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    setShowCreateThread(true);
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleBackToList = () => {
    setSelectedThreadId(null);
  };

  const course = mockCourse; // In real app, fetch by courseId

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/courses">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <Link to="/" className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-primary">SkillHub</h1>
                <span className="text-muted-foreground hidden sm:block">Course Platform</span>
              </Link>
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
                <Button onClick={() => setShowAuthDialog(true)}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16 p-0">
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {course.instructor}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Course Content Tabs */}
            <Tabs defaultValue="lessons" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lessons" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Lessons
                </TabsTrigger>
                <TabsTrigger value="discussion" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </TabsTrigger>
                <TabsTrigger value="certificate" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificate
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="discussion">
                {selectedThreadId ? (
                  <ThreadView 
                    threadId={selectedThreadId} 
                    onBack={handleBackToList}
                  />
                ) : (
                  <ThreadList
                    courseId={course.id}
                    onCreateThread={handleCreateThread}
                    onSelectThread={handleSelectThread}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="certificate">
                <Card className="p-8 text-center">
                  <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Course Certificate</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete all lessons to earn your certificate of completion
                  </p>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="text-2xl font-bold">
                      {isEnrolled && userProgress ? `${userProgress.progress_percentage}%` : '0%'}
                    </div>
                    <Progress 
                      value={isEnrolled && userProgress ? userProgress.progress_percentage : 0} 
                      className="w-full mt-2"
                    />
                  </div>
                  {isEnrolled ? (
                    userProgress?.completed_at ? (
                      <Button asChild>
                        <a href="#" download>Download Certificate</a>
                      </Button>
                    ) : (
                      <Button disabled>
                        Complete course to unlock certificate
                      </Button>
                    )
                  ) : (
                    <Button disabled>Enroll to track progress</Button>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="text-3xl font-bold">${course.price}</div>
                <Badge variant="secondary" className="w-fit">
                  One-time payment
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnrolled ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Enrolled</span>
                    </div>
                    <Button className="w-full" size="lg" asChild>
                      <Link to="/dashboard">Continue Learning</Link>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEnrollment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Enrolling...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Enroll Now
                      </>
                    )}
                  </Button>
                )}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{course.duration} of content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span>Discussion forum</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{course.instructor}</div>
                    <div className="text-sm text-muted-foreground">Senior Developer</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Experienced developer with 8+ years in React and modern web development. 
                  Passionate about teaching and helping students master frontend technologies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateThreadDialog
        open={showCreateThread}
        onOpenChange={setShowCreateThread}
        courseId={course.id}
      />

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
}
