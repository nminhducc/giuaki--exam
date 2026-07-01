const Post = require("../models/Post");

// =====================================
// POST /posts?apiKey=...
// =====================================
const createPost = async (req, res) => {
  const { userId, content } = req.body;

  // Validate bắt buộc
  if (!userId || !content) {
    return res.status(400).json({
      message: "userId và content là bắt buộc.",
    });
  }

  // Authorization: Kiểm tra xem userId trong body có trùng khớp với userId của apiKey hay không
  if (req.user._id.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "Bạn không có quyền tạo bài post cho người dùng khác.",
    });
  }

  try {
    const now = new Date();
    const newPost = new Post({
      userId,
      content,
      createdAt: now,
      updatedAt: now,
    });
    await newPost.save();

    return res.status(201).json({
      message: "Tạo bài post thành công.",
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi tạo bài post.",
      error: error.message,
    });
  }
};

// =====================================
// PUT /posts/:id?apiKey=...
// =====================================
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    // Kiểm tra bài post tồn tại không
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Không tìm thấy bài post với id này.",
      });
    }

    // Authorization: Chỉ cho phép người tạo bài post cập nhật bài post của chính họ
    if (post.userId !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền chỉnh sửa bài post của người khác.",
      });
    }

    // Cập nhật nội dung nếu có truyền
    if (content !== undefined) {
      post.content = content;
    }
    post.updatedAt = new Date();
    await post.save();

    return res.status(200).json({
      message: "Cập nhật bài post thành công.",
      post,
    });
  } catch (error) {
    // Xử lý lỗi khi id không đúng định dạng ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "id bài post không hợp lệ.",
      });
    }
    return res.status(500).json({
      message: "Lỗi server khi cập nhật bài post.",
      error: error.message,
    });
  }
};

module.exports = { createPost, updatePost };
