require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
 
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { startReminderJob } = require("./services/reminderService");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

//Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(helmet());
app.use(morgan("dev"));

//Connect Database
connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/api",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 300,
    })
);

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(notFound);
app.use(errorHandler);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startReminderJob();
});