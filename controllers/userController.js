const bcrypt = require("bcryptjs");
const User = require("../models/User");

// =====================================
// POST /users/register
// =====================================
const register = async (req, res) => {
  const { userName, email, password } = req.body;

  // Validate bắt buộc
  if (!userName || !email || !password) {
    return res.status(400).json({
      message: "userName, email và password là bắt buộc.",
    });
  }

  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email đã được sử dụng. Vui lòng dùng email khác.",
      });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới với mật khẩu đã mã hoá
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({
      message: "Đăng ký thành công.",
      user: {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (error) {
    
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email đã được sử dụng. Vui lòng dùng email khác.",
      });
    }
    return res.status(500).json({
      message: "Lỗi server khi đăng ký.",
      error: error.message,
    });
  }
};

// =====================================
// POST /users/login
// =====================================
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate bắt buộc
  if (!email || !password) {
    return res.status(400).json({
      message: "email và password là bắt buộc.",
    });
  }

  try {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác.",
      });
    }

    // So sánh mật khẩu đã mã hoá
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác.",
      });
    }

    // Format: mern-$userId$-$email$-$randomstring$
    const randomString = generateRandomString();
    const apiKey = `mern-$${user._id}$-$${user.email}$-$${randomString}$`;

    user.apiKey = apiKey;
    await user.save();

    return res.status(200).json({
      message: "Đăng nhập thành công.",
      apiKey,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi đăng nhập.",
      error: error.message,
    });
  }
};

// =====================================
// Helper: tạo random string
// =====================================
function generateRandomString() {
  // Tạo chuỗi ngẫu nhiên dạng: xxxx-xxxx-xxx-xxxx-xxxxxxxxx
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4()}${s4()}-${s4()}-${s4().substring(0, 3)}-${s4()}-${s4()}${s4()}`;
}

module.exports = { register, login };
