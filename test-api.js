const startTest = async () => {
  const baseUrl = "http://localhost:5000";
  const uniqueSuffix = Math.floor(Math.random() * 100000);
  const testUser = {
    userName: `user_${uniqueSuffix}`,
    email: `test_${uniqueSuffix}@gmail.com`,
    password: "securepassword123",
  };

  console.log("=== BẮT ĐẦU TEST HỆ THỐNG API ===\n");

  let apiKey = "";
  let userId = "";
  let postId = "";

  // -------------------------------------------------------------
  // 1. TEST ĐĂNG KÝ (/users/register)
  // -------------------------------------------------------------
  try {
    console.log(`1. Đăng ký tài khoản: ${testUser.email}...`);
    const registerRes = await fetch(`${baseUrl}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    const registerData = await registerRes.json();
    console.log(`- Status code: ${registerRes.status}`);
    console.log("- Phản hồi:", JSON.stringify(registerData, null, 2));

    if (registerRes.status === 201) {
      userId = registerData.user._id || registerData.user.id;
      console.log(`✅ Đăng ký THÀNH CÔNG! (userId: ${userId})\n`);
    } else {
      console.log("❌ Đăng ký THẤT BẠI!\n");
      return;
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối khi Đăng ký:", err.message);
    return;
  }

  // -------------------------------------------------------------
  // 2. TEST ĐĂNG NHẬP (/users/login)
  // -------------------------------------------------------------
  try {
    console.log(`2. Đăng nhập tài khoản...`);
    const loginRes = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    const loginData = await loginRes.json();
    console.log(`- Status code: ${loginRes.status}`);
    console.log("- Phản hồi:", JSON.stringify(loginData, null, 2));

    if (loginRes.status === 200) {
      apiKey = loginData.apiKey;
      console.log(`✅ Đăng nhập THÀNH CÔNG!`);
      console.log(`🔑 Nhận được apiKey: ${apiKey}\n`);
    } else {
      console.log("❌ Đăng nhập THẤT BẠI!\n");
      return;
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối khi Đăng nhập:", err.message);
    return;
  }

  // -------------------------------------------------------------
  // 3. TEST TẠO POST HỢP LỆ (/posts?apiKey=...)
  // -------------------------------------------------------------
  try {
    console.log(`3. Tạo bài viết với apiKey hợp lệ...`);
    const createPostRes = await fetch(`${baseUrl}/posts?apiKey=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        content: "Đây là bài viết đầu tiên của tôi trên MERN!",
      }),
    });
    const createPostData = await createPostRes.json();
    console.log(`- Status code: ${createPostRes.status}`);
    console.log("- Phản hồi:", JSON.stringify(createPostData, null, 2));

    if (createPostRes.status === 201) {
      postId = createPostData.post._id;
      console.log(`✅ Tạo bài viết THÀNH CÔNG!\n`);
    } else {
      console.log("❌ Tạo bài viết THẤT BẠI!\n");
      return;
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối khi Tạo post:", err.message);
    return;
  }

  // -------------------------------------------------------------
  // 4. TEST TẠO POST SAI APIKEY
  // -------------------------------------------------------------
  try {
    console.log(`4. Tạo bài viết với apiKey SAI...`);
    const wrongApiKey = "mern-$wrong$-xxxx";
    const createPostWrongRes = await fetch(`${baseUrl}/posts?apiKey=${wrongApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        content: "Nội dung này không được phép tạo.",
      }),
    });
    const createPostWrongData = await createPostWrongRes.json();
    console.log(`- Status code: ${createPostWrongRes.status}`);
    console.log("- Phản hồi:", JSON.stringify(createPostWrongData, null, 2));
    if (createPostWrongRes.status === 401) {
      console.log(`✅ Xác thực chặn thành công (Trả về 401 Unauthorized đúng thiết kế)!\n`);
    } else {
      console.log("❌ Lỗi: Server không chặn được apiKey sai!\n");
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối:", err.message);
  }

  // -------------------------------------------------------------
  // 5. TEST CẬP NHẬT POST HỢP LỆ (/posts/:id?apiKey=...)
  // -------------------------------------------------------------
  try {
    console.log(`5. Cập nhật bài viết với apiKey hợp lệ...`);
    const updatePostRes = await fetch(`${baseUrl}/posts/${postId}?apiKey=${apiKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "Nội dung bài viết sau khi được cập nhật thành công!",
      }),
    });
    const updatePostData = await updatePostRes.json();
    console.log(`- Status code: ${updatePostRes.status}`);
    console.log("- Phản hồi:", JSON.stringify(updatePostData, null, 2));

    if (updatePostRes.status === 200) {
      console.log(`✅ Cập nhật bài viết THÀNH CÔNG!\n`);
    } else {
      console.log("❌ Cập nhật bài viết THẤT BẠI!\n");
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối khi Cập nhật post:", err.message);
  }

  console.log("=== HOÀN TẤT TẤT CẢ CÁC BÀI TEST ===");
};

startTest();
