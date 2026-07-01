const User = require("../models/User");

/**
 * Middleware xác thực apiKey từ query string
 * Kiểm tra apiKey có tồn tại và hợp lệ trong DB không
 */
const authenticate = async (req, res, next) => {
  const { apiKey } = req.query;

  if (!apiKey) {
    return res.status(401).json({ message: "Thiếu apiKey. Vui lòng đăng nhập để lấy apiKey." });
  }

  try {
    // Tìm user có apiKey khớp trong DB
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(401).json({ message: "apiKey không hợp lệ hoặc đã hết hạn." });
    }

    // Gắn thông tin user vào request để dùng ở controller
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Lỗi xác thực apiKey.", error: error.message });
  }
};

module.exports = { authenticate };
