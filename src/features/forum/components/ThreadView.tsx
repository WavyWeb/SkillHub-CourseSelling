import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useForumStore } from '@/store/forum-store';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageSquare, Clock, User, Send } from 'lucide-react';

interface ThreadViewProps {
  threadId: string;
  onBack: () => void;
}

export function ThreadView({ threadId, onBack }: ThreadViewProps) {
  const [replyContent, setReplyContent] = useState('');
  const { threads, replies, isLoading, loadReplies, createReply } = useForumStore();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const thread = threads.find(t => t._id === threadId);
  const threadReplies = replies[threadId] || [];

  useEffect(() => {
    if (threadId) {
      loadReplies(threadId);
    }
  }, [threadId, loadReplies]);

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast({
        title: 'Reply required',
        description: 'Please enter your reply',
        variant: 'destructive',
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: 'Login required',
        description: 'Please login to post a reply',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createReply(threadId, replyContent.trim(), user.name, user.email, user.uid);
      setReplyContent('');
      toast({
        title: 'Reply posted',
        description: 'Your reply has been added to the discussion',
      });
    } catch (error) {
      toast({
        title: 'Failed to post reply',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!thread) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to discussions
        </Button>
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thread not found</h3>
          <p className="text-muted-foreground">This discussion thread does not exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to discussions
      </Button>

      {/* Thread Header */}
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{thread.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {thread.author_name}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(thread.created_at)}
            </div>
            {thread.reply_count > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{thread.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Replies</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : threadReplies.length > 0 ? (
          <div className="space-y-4">
            {threadReplies.map((reply) => (
              <Card key={reply._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{reply.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(reply.created_at)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="whitespace-pre-wrap">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
          </Card>
        )}
      </div>

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Add Reply</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <>
              <Textarea
                placeholder="Share your thoughts or ask a question..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleReply}
                  disabled={isLoading || !replyContent.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Reply
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">Please login to join the discussion</p>
              <Button variant="outline">Login to Reply</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
