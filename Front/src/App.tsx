import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import courseAPI from "../services/courseAPI";

const Courses: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [purchasedCourse, setPurchasedCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseAPI.getAllCourses();
        setCourses(res.data);
      } catch (err) {
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  const handlePurchase = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase courses");
      return;
    }

    try {
      const course = courses.find((c) => c._id === courseId);
      if (!course) throw new Error("Course not found");

      await courseAPI.purchaseCourse(courseId);
      toast.success(`"${course.title}" added to your cart`);
      setPurchasedCourse(course); // Optional: trigger modal
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Purchase failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="flex-1 mb-4">{course.description}</p>
            <button
              onClick={() => handlePurchase(course._id)}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
