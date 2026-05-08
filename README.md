# **TaskForge - AI-Powered Task Management System**

A full-stack **AI-powered Task Management Platform** built using the MERN stack to help teams assign, track, and manage work efficiently with automation, analytics, secure authentication, and intelligent productivity assistance.

TaskForge goes beyond a traditional task manager by integrating **AI guidance**, **workflow automation**, and **modern team collaboration tools** into a single productivity ecosystem.

---

## ✨ Key Features

* User Authentication (Login / Signup)
* OTP Email Verification (Register & Login)
* Role-based access (Admin & User)
* Google OAuth Login
* Task creation & assignment system
* Task priority & deadline tracking
* Kanban Board (Drag & Drop Tasks)
* AI Productivity Chatbot Assistant
* Email notifications & reminders
* File/Image uploads
* Dashboard analytics & charts
* Dark / Light Mode Toggle
* Responsive modern UI

---

## 🚀 Latest Enhancements

### 🔐 Authentication & Security

* OTP-based Email Verification during signup & login
* Secure authentication using JWT tokens
* Admin invite token validation
* OTP expiry, resend cooldown & attempt protection
* Protected API routes & role authorization

---

### 🤖 AI Productivity Assistant (Forge AI)

* AI chatbot integrated inside User Dashboard
* Analyzes:

  * Pending tasks
  * Priority labels
  * Deadlines
  * Workload distribution
* Helps users:

  * Decide what to work on first
  * Plan daily workflow
  * Identify urgent tasks
* Streaming AI responses supported
* Acts as a personal productivity coach

---

### 📧 Smart Email Notifications & Automation

* Automatic email triggered when:

  * Admin assigns task to user
  * Important workflow actions occur
* OTP email verification system
* Automated reminder emails before deadlines
* Persistent reminder tracking using database flags

---

### 📋 Kanban Board Workflow

* Visual task workflow management
* Drag & Drop tasks between columns:

  * Todo
  * In Progress
  * Completed
* Real-time database synchronization
* Trello/Jira-like user experience

---

### 🎨 UI/UX Improvements

* Dark Mode / Light Mode Toggle
* Clean dashboard layout
* Mobile responsive design
* Improved accessibility & usability
* Modern productivity-focused interface

---

## 🛠 Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Context API
* Axios API Integration
* @dnd-kit (Drag & Drop)

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST API Architecture

### Database

* MongoDB Atlas
* Mongoose ODM

### AI & Automation

* OpenAI API (Forge AI Assistant)
* Streaming AI Responses
* Nodemailer (Email Notifications & OTP System)

### Authentication

* JWT Authentication
* OTP Verification
* Google OAuth Login

---

## 📁 Project Structure

```
TASK_MANAGER_PROJECT/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validateMiddleware.js
│   │
│   ├── models/
│   │   ├── OtpToken.js
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── emailService.js
│   │   ├── otpService.js
│   │   └── reminderService.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── appError.js
│   │   └── asyncHandler.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/Task-Manager/
│   │
│   ├── public/
│   │
│   ├── src/
│   │
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── auth-img.png
│   │   │       ├── hero.png
│   │   │       └── react.svg
│   │
│   │   ├── components/
│   │   │
│   │   │   ├── Cards/
│   │   │   │   ├── InfoCard.jsx
│   │   │   │   └── TaskCard.jsx
│   │   │   │
│   │   │   ├── Charts/
│   │   │   │   ├── CustomBarChart.jsx
│   │   │   │   ├── CustomLegend.jsx
│   │   │   │   ├── CustomPieChart.jsx
│   │   │   │   └── CustomTooltip.jsx
│   │   │   │
│   │   │   ├── Inputs/
│   │   │   │   ├── AddAttachmentsInput.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── ProfilePhotoSelector.jsx
│   │   │   │   ├── SelectDropdown.jsx
│   │   │   │   ├── SelectUsers.jsx
│   │   │   │   └── TodoListInput.jsx
│   │   │   │
│   │   │   ├── layouts/
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   │
│   │   │   ├── Navbar.jsx
│   │   │   ├── SideMenu.jsx
│   │   │   ├── AvatarGroup.jsx
│   │   │   ├── ForgeAssistant.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── TaskListTable.jsx
│   │   │   ├── TaskStatusTabs.jsx
│   │   │   └── ThemeToggle.jsx
│   │
│   │   ├── context/
│   │   │   └── userContext.jsx
│   │
│   │   ├── hooks/
│   │   │   └── useUserAuth.jsx
│   │
│   │   ├── pages/
│   │   │
│   │   │   ├── Admin/
│   │   │   │   ├── CreateTask.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ManageTasks.jsx
│   │   │   │   └── ManageUsers.jsx
│   │   │   │
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── SignUp.jsx
│   │   │   │
│   │   │   └── User/
│   │   │       ├── MyTasks.jsx
│   │   │       ├── UserDashboard.jsx
│   │   │       └── ViewTaskDetails.jsx
│   │
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx
│   │
│   │   ├── utils/
│   │   │   ├── apiPaths.js
│   │   │   ├── axiosInstance.js
│   │   │   ├── data.js
│   │   │   ├── helper.js
│   │   │   └── uploadImage.js
│   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
└── └── package-lock.json
```

---

## 🔗 API Routes

### 🔐 Auth Routes

* `POST /api/auth/register` → Register user
* `POST /api/auth/login` → Login user
* `POST /api/auth/google` → Google OAuth Login
* `POST /api/auth/verify-otp` → Verify email OTP

---

### 👥 User Routes

* `GET /api/users` → Get all users
* `GET /api/users/:id` → Get user details

---

### ✅ Task Routes

* `POST /api/tasks` → Create task
* `GET /api/tasks` → Get all tasks
* `PUT /api/tasks/:id` → Update task
* `DELETE /api/tasks/:id` → Delete task
* `PUT /api/tasks/:id/status` → Update task status

---

### 📊 Report Routes

* `GET /api/reports` → Get analytics/report data

---

### 🤖 AI Routes

* `POST /api/ai/ask` → AI productivity assistant
* `POST /api/ai/stream` → Streaming AI response

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone <repo-url>
cd TASK_MANAGER
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
NODE_ENV=development
CLIENT_URL=your_client_url

PORT=5000
MONGO_URI=your_mongodb_srv_uri
JWT_SECRET=your_secret_key
ADMIN_INVITE_TOKEN=your_admin_token

SMTP_HOST=your_choice
SMTP_PORT=your_choice
SMTP_SECURE=false
SMTP_USER=your_google_gmail
SMTP_PASS=smtp_password
EMAIL_FROM=your_choice

OTP_EXPIRY_MINUTES=10
OTP_RESEND_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5

GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_CLIENT_ID=your_vite_google_client_id

OPENAI_API_KEY=your_api_key
OPENAI_MODEL=depends_on_your_choice

VITE_API_BASE_URL=http://localhost:5000
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend/Task-Manager
npm install
npm run dev
```

---

### 4️⃣ Open in Browser

```
http://localhost:5173
```

---

## 🔄 How It Works

* Express backend exposes REST APIs
* MongoDB Atlas stores users, tasks & reminders
* Middleware manages authentication & uploads
* React frontend consumes APIs via Axios
* Context API handles global authentication state
* Kanban board enables visual workflow tracking
* AI assistant analyzes tasks and provides ranked productivity suggestions
* Email service handles OTP verification, assignment alerts & reminders

---

## 📚 Learning Outcomes

* Built production-ready MERN Stack architecture
* Implemented secure authentication flows
* Integrated AI into real workflow systems
* Developed automated email notification services
* Created drag-and-drop Kanban workflow
* Designed scalable folder architecture
* Practiced real-world system design concepts

---

## 🔮 Future Enhancements

* Team collaboration chat
* Calendar & sprint planning integration
* AI productivity analytics scoring
* Mobile PWA version
* Advanced reporting dashboard

---

## 🙌 Acknowledgement

TaskForge was developed as a practical exploration of **full-stack engineering**, **system design**, and **AI-powered productivity platforms**, transforming a traditional task manager into an intelligent workflow assistant.

---
