require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Controllers
const { register, login } = require("./controllers/userController");
const { createPost, updatePost } = require("./controllers/postController");

// Middleware
const { authenticate } = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================
// Kết nối MongoDB
// =====================================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/middle_exam_db";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(() => {});

// =====================================
// Middleware toàn cục
// =====================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// API Users
// =====================================

// POST /users/register - Đăng ký tài khoản (userName, email, password bắt buộc, email duy nhất, password mã hóa)
app.post("/users/register", register);

// POST /users/login - Đăng nhập (email, password), trả về apiKey mới
app.post("/users/login", login);

// =====================================
// API Posts
// =====================================

// POST /posts?apiKey=... - Tạo bài post mới (yêu cầu authenticate)
app.post("/posts", authenticate, createPost);

// PUT /posts/:id?apiKey=... - Cập nhật bài post theo id (yêu cầu authenticate)
app.put("/posts/:id", authenticate, updatePost);

// =====================================
// Khởi chạy server
// =====================================
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng: http://localhost:${PORT}`);
});