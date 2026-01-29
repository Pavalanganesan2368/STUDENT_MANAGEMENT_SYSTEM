const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: "https://student-management-system-frontend-357j.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// Body parser
app.use(express.json());
app.use(cookieParser());

// Routes (to be imported)
app.use("/auth", require("./routes/authRoutes"));
app.use("/students", require("./routes/studentRoutes"));

const path = require("path");

const PORT = process.env.PORT || 5000;

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set build folder
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) =>
    res.sendFile(
      path.resolve(__dirname, "..", "frontend", "dist", "index.html"),
    ),
  );
} else {
  // Root route for development
  app.get("/", (req, res) => {
    res.send("Student Management System API is running...");
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
