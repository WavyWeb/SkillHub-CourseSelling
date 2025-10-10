export interface Course {
  _id: string;
  _uid: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  category: string;
  thumbnail: string;
  level: string;
  tags: string;
  created_at: string;
  status: string;
}

// Client-side course interface for components
export interface ClientCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  category: string;
  thumbnail: string;
  level: string;
}

// Convert database course to client course
export function toClientCourse(course: Course): ClientCourse {
  return {
    id: course._id,
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    rating: course.rating,
    students: course.students,
    duration: course.duration,
    price: course.price,
    category: course.category,
    thumbnail: course.thumbnail,
    level: course.level,
  };
}
