import { create } from 'zustand';
import { table } from '@devvai/devv-code-backend';

interface ForumThread {
  _uid: string;
  _id: string;
  course_id: string;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
  reply_count: number;
  last_activity: string;
}

interface ForumReply {
  _uid: string;
  _id: string;
  thread_id: string;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
}

interface ForumState {
  threads: ForumThread[];
  replies: { [threadId: string]: ForumReply[] };
  isLoading: boolean;
  createThread: (courseId: string, title: string, content: string, authorName: string, authorEmail: string, uid: string) => Promise<void>;
  createReply: (threadId: string, content: string, authorName: string, authorEmail: string, uid: string) => Promise<void>;
  loadThreads: (courseId: string) => Promise<void>;
  loadReplies: (threadId: string) => Promise<void>;
}

const THREADS_TABLE_ID = 'f0juab54y3uo';
const REPLIES_TABLE_ID = 'f0juaj3ysd8g';

export const useForumStore = create<ForumState>((set, get) => ({
  threads: [],
  replies: {},
  isLoading: false,

  createThread: async (courseId: string, title: string, content: string, authorName: string, authorEmail: string, uid: string) => {
    set({ isLoading: true });
    try {
      const now = new Date().toISOString();
      await table.addItem(THREADS_TABLE_ID, {
        _uid: uid,
        course_id: courseId,
        title,
        content,
        author_name: authorName,
        author_email: authorEmail,
        created_at: now,
        reply_count: 0,
        last_activity: now,
      });
      
      // Reload threads for this course
      await get().loadThreads(courseId);
    } finally {
      set({ isLoading: false });
    }
  },

  createReply: async (threadId: string, content: string, authorName: string, authorEmail: string, uid: string) => {
    set({ isLoading: true });
    try {
      const now = new Date().toISOString();
      await table.addItem(REPLIES_TABLE_ID, {
        _uid: uid,
        thread_id: threadId,
        content,
        author_name: authorName,
        author_email: authorEmail,
        created_at: now,
      });

      // Update thread's reply count and last activity
      const threads = get().threads;
      const thread = threads.find(t => t._id === threadId);
      if (thread) {
        await table.updateItem(THREADS_TABLE_ID, {
          _uid: thread._uid,
          _id: threadId,
          reply_count: thread.reply_count + 1,
          last_activity: now,
        });
      }

      // Reload replies for this thread
      await get().loadReplies(threadId);
      
      // Update local thread data
      const updatedThreads = threads.map(t => 
        t._id === threadId 
          ? { ...t, reply_count: t.reply_count + 1, last_activity: now }
          : t
      );
      set({ threads: updatedThreads });
    } finally {
      set({ isLoading: false });
    }
  },

  loadThreads: async (courseId: string) => {
    set({ isLoading: true });
    try {
      const response = await table.getItems(THREADS_TABLE_ID, {
        query: {
          course_id: courseId,
        },
        sort: 'last_activity',
        order: 'desc',
        limit: 50,
      });
      
      set({ threads: response.items as ForumThread[] });
    } catch (error) {
      console.error('Error loading threads:', error);
      set({ threads: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  loadReplies: async (threadId: string) => {
    try {
      const response = await table.getItems(REPLIES_TABLE_ID, {
        query: {
          thread_id: threadId,
        },
        sort: 'created_at',
        order: 'asc',
        limit: 100,
      });
      
      set((state) => ({
        replies: {
          ...state.replies,
          [threadId]: response.items as ForumReply[],
        },
      }));
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  },
}));
