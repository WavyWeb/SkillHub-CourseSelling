import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useForumStore } from '@/store/forum-store';
import { MessageSquare, Clock, User, Plus } from 'lucide-react';

interface ThreadListProps {
  courseId: string;
  onCreateThread: () => void;
  onSelectThread: (threadId: string) => void;
}

export function ThreadList({ courseId, onCreateThread, onSelectThread }: ThreadListProps) {
  const { threads, isLoading, loadThreads } = useForumStore();

  useEffect(() => {
    loadThreads(courseId);
  }, [courseId, loadThreads]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Discussion</h2>
          <p className="text-muted-foreground">
            Ask questions and share insights with fellow learners
          </p>
        </div>
        <Button onClick={onCreateThread} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Thread
        </Button>
      </div>

      {threads.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to start a conversation about this course!
          </p>
          <Button onClick={onCreateThread}>
            <Plus className="w-4 h-4 mr-2" />
            Start Discussion
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Card 
              key={thread._id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectThread(thread._id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{thread.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {thread.author_name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(thread.last_activity)}
                  </div>
                  {thread.reply_count > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {thread.reply_count}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground line-clamp-2">{thread.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
