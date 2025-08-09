import React from "react";
import { Course } from "../types";
import { X, CheckCircle2 } from "lucide-react";

type Props = {
  course: Course | null;
  onClose: () => void;
};

const PurchaseSuccessModal: React.FC<Props> = ({ course, onClose }) => {
  if (!course) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* Modal Card with subtle animation */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-sm w-full p-8 relative text-center animate-in fade-in-0 zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <CheckCircle2
            className="h-10 w-10 text-green-600 dark:text-green-400"
            strokeWidth={2.5}
          />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Purchase Successful! 🎉
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">You have successfully enrolled in:</p>

        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {course.title}
        </p>

        {/* Simplified Call-to-Action Button */}
        <button
          onClick={onClose} // This button now just closes the modal
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow transform hover:-translate-y-0.5"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;
