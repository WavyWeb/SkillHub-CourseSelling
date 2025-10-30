import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/store/auth-store';
import { table } from '@devvai/devv-code-backend';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Clock, Star, Trophy, TrendingUp, User, LogOut, ArrowLeft } from 'lucide-react';

interface UserProgress {
  _id: string;
  course_id: string;
  course_title: string;
  progress_percentage: number;
  lessons_completed: number;
  total_lessons: number;
  time_spent: number;
  last_accessed: string;
  enrolled_at: string;
  completed_at?: string;
  certificate_earned: string;
}

interface CourseReview {
  _id: string;
  course_id: string;
  course_title: string;
  rating: number;
  review_text: string;
  created_at: string;
  helpful_votes: number;
  verified_purchase: string;
}

function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [userReviews, setUserReviews] = useState<CourseReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load user progress
      const progressResponse = await table.getItems('f0jvejr2l62o', {
        query: { _uid: user.uid },
        limit: 50
      });
      setUserProgress(progressResponse.items as UserProgress[]);

      // Load user reviews
      const reviewsResponse = await table.getItems('f0jveurhyvb4', {
        query: { _uid: user.uid },
        limit: 20
      });
      setUserReviews(reviewsResponse.items as CourseReview[]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: 'Failed to load dashboard',
        description: 'Please try refreshing the page',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const completedCourses = userProgress.filter(p => p.completed_at).length;
  const inProgressCourses = userProgress.filter(p => !p.completed_at).length;
  const totalTimeSpent = userProgress.reduce((sum, p) => sum + p.time_spent, 0);
  const averageProgress = userProgress.length > 0 
    ? userProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / userProgress.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <Link to="/" className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-primary">SkillHub</h1>
                <span className="text-muted-foreground hidden sm:block">Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
              <Button variant="outline" onClick={() => logout()} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || user?.email}!</h1>
          <p className="text-muted-foreground">
            Track your learning progress and continue your educational journey.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                +{completedCourses} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCourses}</div>
              <p className="text-xs text-muted-foreground">
                Keep learning!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</div>
              <p className="text-xs text-muted-foreground">
                Total learning time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">My Courses</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Course Progress</h2>
              <Button asChild>
                <Link to="/courses">Find New Courses</Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading your courses...</p>
              </div>
            ) : userProgress.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userProgress.map((progress) => (
                  <Card key={progress._id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg line-clamp-2">
                          {progress.course_title}
                        </CardTitle>
                        {progress.completed_at && (
                          <Badge variant="secondary" className="ml-2">
                            <Trophy className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        Enrolled on {new Date(progress.enrolled_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{progress.progress_percentage}%</span>
                          </div>
                          <Progress value={progress.progress_percentage} className="w-full" />
                        </div>
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{progress.lessons_completed} / {progress.total_lessons} lessons</span>
                          <span>{Math.round(progress.time_spent / 60)} hours</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Last accessed: {new Date(progress.last_accessed).toLocaleDateString()}
                          </span>
                          <Button size="sm" asChild>
                            <Link to={`/course/${progress.course_id}`}>
                              {progress.completed_at ? 'Review' : 'Continue'}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h2 className="text-2xl font-bold">My Reviews</h2>
            
            {userReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Complete a course and share your experience with others
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <Card key={review._id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{review.course_title}</CardTitle>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <CardDescription>
                        Reviewed on {new Date(review.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{review.review_text}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{review.helpful_votes} people found this helpful</span>
                        {review.verified_purchase === 'true' && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <h2 className="text-2xl font-bold">Certificates</h2>
            
            {completedCourses === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
                  <p className="text-muted-foreground">
                    Complete courses to earn certificates and showcase your skills
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProgress
                  .filter(p => p.completed_at && p.certificate_earned === 'true')
                  .map((progress) => (
                    <Card key={progress._id} className="border-2 border-primary/20">
                      <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <CardTitle className="text-center text-lg">
                          Certificate of Completion
                        </CardTitle>
                        <CardDescription className="text-center">
                          {progress.course_title}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          Completed on {new Date(progress.completed_at!).toLocaleDateString()}
                        </p>
                        <Button variant="outline" size="sm">
                          Download Certificate
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;
