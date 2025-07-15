import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, LogOut, Settings, ShoppingBag } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CourseHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Browse Courses
            </Link>
            
            {isAuthenticated && !isAdmin && (
              <Link 
                to="/my-courses" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>My Courses</span>
              </Link>
            )}

            {isAdmin && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
              >
                <Settings className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {isAdmin ? admin?.firstName : user?.firstName}
                  </span>
                  {isAdmin && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;