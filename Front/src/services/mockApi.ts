import { Course } from '../types';

// Mock data for courses
const mockCourses: Course[] = [
  {
    _id: '1',
    title: 'Complete React Development Course',
    description: 'Master React from basics to advanced concepts including hooks, context, and modern patterns. Build real-world applications with hands-on projects.',
    price: 99.99,
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: 'admin1'
  },
  {
    _id: '2',
    title: 'Advanced JavaScript Mastery',
    description: 'Deep dive into JavaScript fundamentals, ES6+, async programming, and modern development practices. Perfect for intermediate developers.',
    price: 79.99,
    imageUrl: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: 'admin1'
  },
  {
    _id: '3',
    title: 'Full Stack Web Development',
    description: 'Learn to build complete web applications from frontend to backend. Covers React, Node.js, databases, and deployment strategies.',
    price: 149.99,
    imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: 'admin1'
  },
  {
    _id: '4',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis, visualization, and machine learning. Includes pandas, numpy, and scikit-learn.',
    price: 119.99,
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: 'admin1'
  },
  {
    _id: '5',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Create beautiful, functional designs that users love.',
    price: 89.99,
    imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: 'admin1'
  },
  {
    _id: '6',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Deploy to both iOS and Android app stores.',
    price: 129.99,
    imageUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: 'admin1'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockCourseAPI = {
  // Public
  getPreview: async () => {
    await delay(800); // Simulate network delay
    return {
      data: {
        courses: mockCourses
      }
    };
  },
  
  // User
  purchaseCourse: async (courseId: string) => {
    await delay(500);
    // Store purchase in localStorage for demo
    const purchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');
    if (!purchases.includes(courseId)) {
      purchases.push(courseId);
      localStorage.setItem('userPurchases', JSON.stringify(purchases));
    }
    return {
      data: {
        message: 'Course purchased successfully'
      }
    };
  },
  
  getUserPurchases: async () => {
    await delay(500);
    const purchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');
    const coursesData = mockCourses.filter(course => purchases.includes(course._id));
    return {
      data: {
        purchases: purchases.map((courseId: string) => ({ courseId })),
        coursesData
      }
    };
  },
  
  // Admin
  createCourse: async (data: { title: string; description: string; price: number; imageUrl: string }) => {
    await delay(500);
    const newCourse: Course = {
      _id: Date.now().toString(),
      ...data,
      creatorId: 'admin1'
    };
    // In a real app, this would be stored in a database
    return {
      data: {
        message: 'Course created successfully',
        course: newCourse
      }
    };
  },
  
  updateCourse: async (data: { title: string; description: string; price: number; imageUrl: string; courseId: string }) => {
    await delay(500);
    return {
      data: {
        message: 'Course updated successfully'
      }
    };
  },
  
  getAdminCourses: async () => {
    await delay(500);
    return {
      data: {
        courses: mockCourses
      }
    };
  }
};

// Mock auth API
export const mockAuthAPI = {
  // User auth
  userSignup: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    await delay(800);
    const token = 'mock-user-token-' + Date.now();
    return {
      data: {
        message: 'User created successfully',
        token,
        user: {
          id: 'user1',
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user'
        }
      }
    };
  },
  
  userSignin: async (data: { email: string; password: string }) => {
    await delay(800);
    const token = 'mock-user-token-' + Date.now();
    return {
      data: {
        message: 'Signin successful',
        token,
        user: {
          id: 'user1',
          email: data.email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        }
      }
    };
  },

  // Admin auth
  adminSignup: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    await delay(800);
    const token = 'mock-admin-token-' + Date.now();
    return {
      data: {
        message: 'Admin created successfully',
        token,
        user: {
          id: 'admin1',
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'admin'
        }
      }
    };
  },
  
  adminSignin: async (data: { email: string; password: string }) => {
    await delay(800);
    const token = 'mock-admin-token-' + Date.now();
    return {
      data: {
        message: 'Admin signin successful',
        token,
        user: {
          id: 'admin1',
          email: data.email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        }
      }
    };
  }
};