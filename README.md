## TaskForge - Task Management System

A full-stack task management application designed to help teams collaborate, track progress, and manage tasks efficiently.

---

### Features:

* User Authentication (Login / Signup)
* Role-based access (Admin & User)
* Task creation & assignment
* Task status tracking
* File/Image uploads
* Dashboard with charts & analytics
* Responsive UI with modern components

---

### Tech Stack:

* Frontend: React.js(Vite), Tailwind CSS    
* Backend: Node.js, Express.js
* Database: MongoDB Atlas
* Others: Mongoose (ODM), JWT Authentication

---

### Project Structure:

```
TASK_MANAGER/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │
│   │   ├── components/
│   │   │   ├── Cards/
│   │   │   ├── Charts/
│   │   │   ├── Inputs/
│   │   │   ├── layouts/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SideMenu.jsx
│   │   │   ├── AvatarGroup.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── TaskListTable.jsx
│   │   │   └── TaskStatusTabs.jsx
│   │   │
│   │   ├── context/
│   │   │   └── userContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useUserAuth.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   └── User/
│   │   │
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── apiPaths.js
│   │   │   ├── axiosInstance.js
│   │   │   ├── helper.js
│   │   │   └── uploadImage.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
```

---

### API Routes:

#### Auth Routes-

* POST `/api/auth/register` → Register user
* POST `/api/auth/login` → Login user

---

#### User Routes-

* GET `/api/users` → Get all users
* GET `/api/users/:id` → Get user details

---

#### Task Routes-

* POST `/api/tasks` → Create task
* GET `/api/tasks` → Get all tasks
* PUT `/api/tasks/:id` → Update task
* DELETE `/api/tasks/:id` → Delete task

---

#### Report Routes-

* GET `/api/reports` → Get analytics/report data

---

### Installation & Setup:

1. Clone the repository-
   
   ```
   git clone <repo-url>
   cd TASK_MANAGER
   ```
      
2. Install dependencies-

   ```
   nvm install 22
   nvm use 22
   ```
   
3. Backend Setup-

   ```
   cd backend
   npm init -y
   npm install
   ```

   Create `.env` file: -
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ADMIN_INVITE_TOKEN=your_admin_token
   ```

   Run backend: -
   ```
   npm start
   ```
   
4. Frontend Setup-

   ```
   cd frontend
   cd Task-Manager
   npm create vite@latest
   npm install
   ```

   Run Frontend: -

   ```
   npm run dev
   ```
   
6. Open in browser-

   ```
   http://localhost:5173
   ```

---

### How It Works:

* Backend provides REST APIs using Express.js
* MongoDB stores users & tasks
* Middleware handles authentication & file uploads
* Frontend (React) consumes APIs using Axios
* Context API manages global user state
* Charts display analytics data visually
---

### Learning Outcomes:

* Built a complete MERN stack project
* Learned authentication & authorization
* Understood scalable folder structure
* Improved API handling & state management
* Worked with charts & dashboards

---

### Acknowledgement:

This project was built as part of learning full-stack development and improving real-world project structuring skills.
