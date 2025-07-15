export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  creatorId: string;
}

export interface Purchase {
  _id: string;
  userId: string;
  courseId: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  courses?: Course[];
  courseId?: string;
}