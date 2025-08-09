import React, { useEffect, useState } from 'react';
import { courseAPI } from '../../services/api';
import { Course } from '../../types';
import CourseCard from '../../components/CourseCard';
import CreateCourseModal from '../../components/CreateCourseModal';
import { Plus, BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAdminCourses();
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      await courseAPI.createCourse(courseData);
      setShowCreateModal(false);
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handleUpdateCourse = async (courseData: any) => {
    if (!editingCourse) return;

    try {
      await courseAPI.updateCourse({
        ...courseData,
        courseId: editingCourse._id,
      });
      setEditingCourse(null);
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update course');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCreateModal(true);
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Courses',
      value: courses.length.toString(),
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: '1,234', // This would come from your backend
      color: 'bg-green-500',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${courses.reduce((sum, course) => sum + course.price, 0).toLocaleString()}`,
      color: 'bg-purple-500',
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: '+12%',
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-700 h-8 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="bg-gray-300 dark:bg-gray-700 h-12 w-12 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-6 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your courses and track performance</p>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              setShowCreateModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Course</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Courses</h2>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first course to start teaching</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEdit={handleEditCourse}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Course Modal */}
        {showCreateModal && (
          <CreateCourseModal
            course={editingCourse}
            onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            onClose={() => {
              setShowCreateModal(false);
              setEditingCourse(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
