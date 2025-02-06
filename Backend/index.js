import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";
import path from "path";
import { fileURLToPath } from "url";
import appRootPath from "app-root-path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

mongoose
  .connect(
    "mongodb+srv://tarun001:Hello321@cluster0.palaq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
const static_path = path.join(appRootPath.path, "../Frontend/dist");
console.log(static_path);
app.use(express.static(static_path));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route setup
app.use("/api/auth", authRouter); // Using the auth routes
app.use("/api/note", noteRouter); //Using the note route

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
