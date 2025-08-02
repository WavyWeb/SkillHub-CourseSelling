import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/courses" element={<Courses />} />
              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute requireAuth>
                    <MyCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requireAuth requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
           <ScrollToTopButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
