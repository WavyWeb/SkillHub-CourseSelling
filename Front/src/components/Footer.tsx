import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaGlobe } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-10 py-6 px-4 text-gray-600">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          © {new Date().getFullYear()} CourseHub
        </h3>
        <p className="text-sm mb-4">All rights reserved.</p>

        <div className="flex justify-center space-x-6 text-xl">
          <a
            href="https://github.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://instagram.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600"
          >
            <FaInstagram />
          </a>
          <a
            href="https://yourwebsite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-600"
          >
            <FaGlobe />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
