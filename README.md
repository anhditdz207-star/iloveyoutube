# I LOVE YOUTUBE
### Nền tảng Âm nhạc, Video & Studio Quản lý Tài nguyên Dựng phim Cá nhân Đỉnh cao

Chào mừng bạn đến với **I LOVE YOUTUBE** — ứng dụng nghe nhạc và xem video YouTube chuẩn giao diện hiện đại kết hợp Studio quản lý tài nguyên dựng phim cá nhân.

---

## 🌟 ĐẶC ĐIỂM & TÍNH NĂNG NỔI BẬT

### 1. Logo & Nhận Diện "I LOVE YOUTUBE"
- **Logo trái tim đỏ gập Origami:** Biểu tượng tình yêu với YouTube kết hợp nút phát video sắc nét.
- **Tông màu chuẩn YouTube:** Nền tối xám nhạt tự nhiên (`#0F0F0F` / `#1F1F1F`), không chói lóa, không neon màu mè, độ tương phản cao, dịu mắt khi làm việc lâu.
- **Chế độ Sáng (Light Theme):** Hỗ trợ bật/tắt bằng **dây kéo bóng đèn tương tác** lò xo đàn hồi có âm thanh "tách" vui tai.
- **Đăng nhập Google (Google Sign-In):** Hỗ trợ đăng nhập tài khoản Google để lưu lịch sử xem/nghe, danh sách yêu thích và playlist riêng biệt theo người dùng.

### 2. Bộ Máy Phát Nhạc YouTube Thực Tế (Real YouTube IFrame Player Engine)
- **Không còn là mô phỏng:** Tích hợp trực tiếp **YouTube IFrame Player API** chính thức từ Google.
- **Phát nhạc & video thật 100%:** Nghe các bài hát thịnh hành (Sơn Tùng M-TP, Lofi Girl 24/7, Vũ., Da LAB, Pop US-UK) với âm thanh và hình ảnh thực từ YouTube.
- **Dán link YouTube bất kỳ:** Hỗ trợ nút **"Dán link YouTube"** trên thanh tìm kiếm để nghe ngay bất kỳ video, bài hát hay podcast nào trên YouTube.
- **Chuyển đổi Linh hoạt:** Xem video dạng rạp (Theater / Full screen), thu nhỏ góc màn hình dạng Picture-in-Picture hoặc chuyển sang chế độ **"Chỉ nghe nhạc (Audio-Only)"**.

### 3. Giao diện Đơn giản, Gom Nhóm Gọn Gàng
- Bố cục thẻ video chuẩn YouTube (tỷ lệ 16:9, thời lượng video ở góc phải, avatar kênh, tên bài hát, số lượt xem).
- **Gom nhóm thông minh trên Sidebar:** Các công cụ ít dùng hơn (Trình tải Media, Kho tài nguyên dựng phim, Cài đặt) được xếp gọn vào mục **"Công cụ Studio & Dựng phim ▼"**, bấm vào để mở rộng giúp thanh điều hướng cực kỳ gọn gàng.
- Thanh chip danh mục YouTube: *Tất cả, V-Pop, Lofi Chill, Indie & Acoustic, Âm nhạc US-UK, Tập trung học tập*.

### 4. Media Studio — Trình Tải & Kho Tài Nguyên Dựng Phim
- Tải nhạc nền (BGM), hiệu ứng âm thanh (SFX) foley, video footage 4K từ các nguồn miễn phí bản quyền (Pixabay, Pexels, Mixkit, Freesound, Wikimedia).
- Kho tài nguyên cục bộ lưu trữ an toàn bằng **IndexedDB**.
- Trình kiểm tra giấy phép bản quyền và tạo dòng ghi công (Attribution) tự động.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

```bash
# Di chuyển vào thư mục dự án
cd "C:\Users\ngang\Downloads\personal-music-hub"

# Chạy server phát triển Vite
npm run dev
```
Trình duyệt sẽ mở tại địa chỉ: `http://localhost:5173/`

---

## 🌐 XUẤT BẢN LÊN GITHUB PAGES
Dự án đã được cấu hình đường dẫn tương đối (`base: './'`) trong `vite.config.ts`, build production hoàn hảo không lỗi và có sẵn workflow GitHub Actions tự động tại `.github/workflows/deploy.yml`.
