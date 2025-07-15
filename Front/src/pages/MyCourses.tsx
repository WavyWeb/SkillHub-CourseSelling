import React, { useEffect, useState } from 'react';
import { courseAPI } from '../services/api';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { BookOpen } from 'lucide-react';

const MyCourses: React.FC = () => {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await courseAPI.getUserPurchases();
        setPurchasedCourses(response.data.coursesData);
      } catch (error) {
        console.error('Error fetching purchased courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-6 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded mb-4"></div>
                <div className="bg-gray-300 h-10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Courses</h1>
          <p className="text-xl text-gray-600">
            Continue learning with your purchased courses
          </p>
        </div>

        {/* Courses Grid */}
        {purchasedCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by purchasing your first course</p>
            <a
              href="/courses"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Browse Courses
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchasedCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isPurchased={true}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;