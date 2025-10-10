# 📚 SkillHub – Course Selling Website

[![Deployment](https://img.shields.io/badge/Live-Demo-green)](https://your-skillhub-live-demo-url.vercel.app/) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Built with MERN Stack](https://img.shields.io/badge/Built%20with-MERN%20Stack-brightgreen)](https://github.com/your-username/SkillHub-CourseSelling)  

> **SkillHub** is a comprehensive online platform for selling and buying courses, featuring robust backend management and an intuitive, responsive frontend. It provides a seamless e-learning experience for both instructors and students, accessible on any device.

---

## 📑 Table of Contents

- [✨ Features](#-features)  
- [🛠️ Technologies Used](#-technologies-used)  
- [🚀 Getting Started](#-getting-started)  
- [💡 Usage](#-usage)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  

---

## 📌 Introduction

**SkillHub** is a modern full-stack web application designed to facilitate online learning. It empowers instructors to effortlessly list and manage their courses, while providing students with a rich catalog to discover and enroll in.  

Key functionalities include:

- Secure user authentication (for both students and instructors)  
- Comprehensive course browse and search capabilities with filters and sorting  
- Detailed course pages with curriculum, instructor info, reviews, and ratings  
- Secure payment processing for course enrollments  
- Personalized dashboards for managing courses, tracking progress, and reviewing learning metrics  
- Discussion forums for each course to enable student-instructor interaction  
- Dark/Light theme toggle for improved accessibility  

With a strong emphasis on user experience and a mobile-first approach, SkillHub ensures a delightful and efficient learning journey across all screen sizes.

---

## ✨ Features

### General
- ✅ **Fully Responsive** – Optimized for seamless use on phones, tablets, and desktops.  
- 🔐 **User Authentication** – Secure signup, login, and logout for both students and instructors.  
- 🧑‍🏫 **Role-Based Access** – Distinct functionalities for students (enrolling, learning) and instructors (creating, managing courses).  

### Frontend
- 📚 **Course Catalog** – Browse courses by category or search with real-time filtering and sorting.  
- 🔍 **Detailed Course View** – Includes course description, syllabus, instructor info, reviews, and average ratings.  
- 🛒 **Shopping Cart & Checkout** – Add courses, manage selections, and securely purchase through integrated payment gateway.  
- 📊 **User Dashboards** – Personalized dashboards for:
  - **Students**: Enrolled courses, progress tracking, weekly improvement metrics  
  - **Instructors**: Course management, student engagement analytics  
- 💬 **Discussion Forum** – Dedicated forum for each course to ask questions, reply, and engage with instructors.  
- 🌙 **Dark/Light Theme Toggle** – Switch between light and dark modes; preference saved in localStorage.  

### Backend
- 👤 **User Management APIs** – Registration, login, profile updates, and role-based access control.  
- 📝 **Course Management APIs** – CRUD operations for courses with categories and filters.  
- 🚀 **Enrollment & Progress APIs** – Track lessons completed, quiz scores, and total time spent per user.  
- 🏆 **Reviews & Ratings APIs** – Submit and moderate course reviews; only approved reviews are publicly displayed.  
- 💾 **Database Integration** – MongoDB collections for users, courses, progress, reviews, and forum threads.  
- 🔒 **Security** – JWT-based authentication, input validation, and protected routes.

---

## 🛠️ Technologies Used

### Frontend
- **React.js** – Dynamic user interfaces  
- **Tailwind CSS** – Responsive modern UI styling  
- **Axios** – API requests to backend  
- **Recharts / Chart.js** – Visualizing progress dashboard  

### Backend
- **Node.js** – Server-side runtime  
- **Express.js** – RESTful API framework  
- **MongoDB & Mongoose** – Flexible data storage and modeling  
- **JSON Web Tokens (JWT)** – Secure authentication and authorization  
- **Stripe API** – Secure payment processing  
- **Socket.io (optional)** – Real-time updates for discussion forums  

---

## 🚀 Getting Started

Follow these steps to set up and run SkillHub on your local machine.

### Prerequisites

Ensure you have the following installed:

* **Node.js & npm (or yarn):**  
    * [Download Node.js](https://nodejs.org/en/download/)  
* **MongoDB Community Server:**  
    * [Download MongoDB](https://www.mongodb.com/try/download/community)  

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/SkillHub-CourseSelling.git
cd SkillHub-CourseSelling

```

#### 2. Install dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

```

#### 3. Setup environment variables
```
Create a .env file in the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

#### 4. Run the project
```
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start

```

---

### 💡 Usage

Sign up as a student or instructor

Browse courses, apply filters, and search efficiently

Enroll in courses and track your learning progress

Submit and read reviews, or moderate if you are an admin/instructor

Participate in discussion forums for each course

Toggle between dark and light mode for better accessibility

---

### 🤝 Contributing

Contributions are welcome! Please follow these steps:

Fork the repository

Create your feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'feat: add your feature')

Push to the branch (git push origin feature/your-feature)

Open a Pull Request

Please ensure your code follows the project's coding style and is well-documented.

---

### License

This project is licensed under the MIT License – see the LICENSE file for details.

---

<p align="center"> <a href="#top" style="font-size: 16px; padding: 8px 16px; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;"> ⬆️ Back to Top </a> </p> 
