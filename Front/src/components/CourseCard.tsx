import React from 'react';
import { Course } from '../types';
import { Clock, Users, Star } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onPurchase?: (courseId: string) => void;
  onEdit?: (course: Course) => void;
  showActions?: boolean;
  isPurchased?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onPurchase, 
  onEdit, 
  showActions = true,
  isPurchased = false 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img
          src={course.imageUrl || 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
            ${course.price}
          </span>
        </div>
        {isPurchased && (
          <div className="absolute top-4 left-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Purchased
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>8 hours</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>1.2k students</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        
        {showActions && (
          <div className="mt-auto flex space-x-2">
            {onPurchase && !isPurchased && (
              <button
                onClick={() => onPurchase(course._id)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                Purchase Course
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={() => onEdit(course)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Edit Course
              </button>
            )}
            
            {isPurchased && (
              <button className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium cursor-default">
                Access Course
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
