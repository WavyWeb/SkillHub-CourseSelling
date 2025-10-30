import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForumStore } from '@/store/forum-store';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';

interface CreateThreadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
}

export function CreateThreadDialog({ open, onOpenChange, courseId }: CreateThreadDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createThread, isLoading } = useForumStore();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Fields required',
        description: 'Please enter both title and content',
        variant: 'destructive',
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: 'Login required',
        description: 'Please login to create a thread',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createThread(courseId, title.trim(), content.trim(), user.name, user.email, user.uid);
      setTitle('');
      setContent('');
      onOpenChange(false);
      toast({
        title: 'Thread created',
        description: 'Your discussion thread has been posted',
      });
    } catch (error) {
      toast({
        title: 'Failed to create thread',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTitle('');
    setContent('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Start New Discussion
          </DialogTitle>
          <DialogDescription>
            Create a new thread to ask questions or share insights about this course
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="thread-title">Thread Title</Label>
            <Input
              id="thread-title"
              placeholder="What would you like to discuss?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thread-content">Description</Label>
            <Textarea
              id="thread-content"
              placeholder="Provide more details about your question or topic..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {content.length}/1000 characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !title.trim() || !content.trim() || !isAuthenticated}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Thread
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
