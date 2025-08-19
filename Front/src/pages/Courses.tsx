import React, { useEffect, useState } from "react";
import axios from "axios";
import { courseAPI } from "../services/api";
import { Course } from "../types";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import { Search, Filter } from "lucide-react";
import PurchaseSuccessModal from "../components/PurchasedModal";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const { isAuthenticated, isAdmin } = useAuth();
  const [purchasedCourse, setPurchasedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getPreview();
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "free":
          filtered = filtered.filter((course) => course.price === 0);
          break;
        case "under50":
          filtered = filtered.filter(
            (course) => course.price > 0 && course.price < 50
          );
          break;
        case "under100":
          filtered = filtered.filter(
            (course) => course.price >= 50 && course.price < 100
          );
          break;
        case "over100":
          filtered = filtered.filter((course) => course.price >= 100);
          break;
      }
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, priceFilter]);

  //Add razorpay logic in handlePurchase function
  const handlePurchase = async (courseId: string) => {
    if (!isAuthenticated) {
      alert("Please login to purchase courses");
      return;
    }

    try {
      const course = courses.find((c) => c._id === courseId);
      if (!course) throw new Error("Course not found");

      // 1. Create order
      const { data } = await axios.post(
        "http://localhost:5002/api/v1/payment/create-order",
        {
          amount: course.price * 100, //in paise
          courseId: course._id,
        }
      );

      // 2. Razorpay options
      const options = {
        key: "rzp_test_R5Dz7E9ZA9ddqZ",
        amount: data.amount,
        currency: data.currency,
        name: "SkillHub",
        description: course.title,
        order_id: data.id,
        handler: async (response: any) => {
          try {
            // 3. Verify payment
            const verifyRes = await axios.post(
              "http://localhost:5002/api/v1/payment/verify",
              response
            );

            if (verifyRes.data.success) {
              setPurchasedCourse(course);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Verification request failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-6 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-4"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-4">
            All Courses
          </h1>
          <p className="text-xl dark:text-gray-300 text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive collection of courses designed to help
            you master new skills
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-900 dark:text-white min-w-[150px]"
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="under50">Under $50</option>
                <option value="under100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onPurchase={!isAdmin ? handlePurchase : undefined}
                showActions={!isAdmin}
              />
            ))}
          </div>
        )}
      </div>
      {purchasedCourse && (
        <PurchaseSuccessModal
          course={purchasedCourse}
          onClose={() => setPurchasedCourse(null)}
        />
      )}
    </div>
  );
};

export default Courses;
