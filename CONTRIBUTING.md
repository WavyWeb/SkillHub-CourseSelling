# 🛠️ Contributing to SkillHub-CourseSelling

We welcome contributions! Follow the guide below to set up your development environment and contribute effectively.

---

## Pre-requisites

Ensure the following are installed on your system:

- **MongoDB** (or a MongoDB Atlas connection URL)
- **Node.js** and **npm**

---

## Project Setup

1. **Fork the repository**  
   Click the `Fork` button on the top right of this GitHub page.

2. **Clone your forked repository**

   ```bash
   git clone https://github.com/[your-username]/SkillHub-CourseSelling.git
   cd SkillHub-CourseSelling
   ```

3. **Install backend dependencies**

   ```bash
   npm install
   ```

4. **Install frontend dependencies**

   ```bash
   cd Front
   npm install
   ```

5. **Create a `.env` file in the backend folder** and add:

   ```env
   MONGO_URL=
   JWT_ADMIN_PASSWORD=
   JWT_USER_PASSWORD=
   ```

---

## Working on a New Feature or Bug

6. **Create a new branch**

   ```bash
   git checkout -b your-feature-name
   ```

7. **Make your changes**  
   Make sure everything works locally.

8. **Commit your changes**

   ```bash
   git add .
   git commit -m "Add: your meaningful commit message"
   ```

9. **Push your changes to your fork**

   ```bash
   git push origin your-feature-name
   ```

10. **Create a Pull Request**

   - Go to your forked repository on GitHub.
   - Click **"Compare & pull request"**.
   - Write a clear description of what you’ve done.
   - Click **"Create pull request"**.

---

## 💡 Tips

- Keep commits small and focused.
- Use meaningful commit messages (e.g., `Fix: login bug`, `Feat: add new course card`).
- Open an issue or discussion before coding.
- Run linters or tests before pushing (if configured).

---

Thank you for contributing! 🎉
