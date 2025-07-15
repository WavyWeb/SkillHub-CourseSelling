import axios from 'axios';
import { AuthResponse, Course, ApiResponse } from '../types';
import { mockCourseAPI, mockAuthAPI } from './mockApi';

const API_BASE_URL = 'http://localhost:5001/api/v1';

// Check if we should use mock API (when backend is not available)
const USE_MOCK_API = true; // Set to false when backend is available

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  // User auth
  userSignup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    USE_MOCK_API ? mockAuthAPI.userSignup(data) : api.post<AuthResponse>('/user/signup', data),
  
  userSignin: (data: { email: string; password: string }) =>
    USE_MOCK_API ? mockAuthAPI.userSignin(data) : api.post<AuthResponse>('/user/signin', data),

  // Admin auth
  adminSignup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    USE_MOCK_API ? mockAuthAPI.adminSignup(data) : api.post<AuthResponse>('/admin/signup', data),
  
  adminSignin: (data: { email: string; password: string }) =>
    USE_MOCK_API ? mockAuthAPI.adminSignin(data) : api.post<AuthResponse>('/admin/signin', data),
};

// Course API
export const courseAPI = {
  // Public
  getPreview: () =>
    USE_MOCK_API ? mockCourseAPI.getPreview() : api.get<{ courses: Course[] }>('/course/preview'),
  
  // User
  purchaseCourse: (courseId: string) =>
    USE_MOCK_API ? mockCourseAPI.purchaseCourse(courseId) : api.post<ApiResponse>('/course/purchase', { courseId }),
  
  getUserPurchases: () =>
    USE_MOCK_API ? mockCourseAPI.getUserPurchases() : api.get<{ purchases: any[]; coursesData: Course[] }>('/user/purchases'),
  
  // Admin
  createCourse: (data: { title: string; description: string; price: number; imageUrl: string }) =>
    USE_MOCK_API ? mockCourseAPI.createCourse(data) : api.post<ApiResponse>('/admin/course', data),
  
  updateCourse: (data: { title: string; description: string; price: number; imageUrl: string; courseId: string }) =>
    USE_MOCK_API ? mockCourseAPI.updateCourse(data) : api.put<ApiResponse>('/admin/course', data),
  
  getAdminCourses: () =>
    USE_MOCK_API ? mockCourseAPI.getAdminCourses() : api.get<{ courses: Course[] }>('/admin/course/bulk'),
};

export default api;