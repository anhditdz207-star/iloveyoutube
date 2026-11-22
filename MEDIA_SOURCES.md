# DANH MỤC NGUỒN TÀI NGUYÊN MEDIA & QUY ĐỊNH BẢN QUYỀN
## Media Sources, API Permissions & License Guide

Tài liệu này quy định và hướng dẫn các nguồn tài nguyên media (âm nhạc, hiệu ứng âm thanh SFX, video footage, stock clips, hình ảnh) được tích hợp trong **Personal Music Hub & Media Studio**.

---

## 1. NGUYÊN TẮC PHÁP LÝ & BẢN QUYỀN CỐT LÕI

1. **Tuân thủ bản quyền & Quyền tác giả:**
   - Chỉ tích hợp và hỗ trợ tải xuống từ các nguồn hợp pháp cho phép tải công khai (Royalty-Free, Public Domain, Creative Commons hoặc Giấy phép riêng cho phép tải).
   - Tuyệt đối KHÔNG vượt qua DRM (Digital Rights Management), KHÔNG bẻ khóa nội dung bảo vệ hoặc paywall.
   - Tuyệt đối KHÔNG trích xuất (rip/extract) âm thanh hoặc video từ YouTube hoặc các dịch vụ cấm tải vi phạm Điều khoản Dịch vụ (ToS).
   - Đối với nội dung YouTube: Chỉ phát compliant qua YouTube IFrame Player API theo đúng chuẩn chính thức của Google/YouTube.

2. **Minh bạch thông tin Giấy phép (License Transparency):**
   - Mọi tài nguyên lưu trong Kho tài nguyên (Media Asset Library) đều lưu trữ kèm: Tên tác giả, Tên giấy phép, URL gốc, Ngày tải, Yêu cầu ghi công (Attribution Requirement) và Mục đích sử dụng (Thương mại / Phi thương mại).
   - Hệ thống cảnh báo tự động hiển thị nếu tài nguyên chưa có thông tin bản quyền xác thực.

---

## 2. DANH SÁCH CÁC NGUỒN TÀI NGUYÊN HỖ TRỢ

### 2.1. Pixabay (Âm nhạc, SFX, Video Footage, Hình ảnh)
- **Website:** https://pixabay.com/
- **Loại tài nguyên:** Nhạc nền (BGM), Sound Effects (SFX), Stock Videos (4K/HD), Ảnh minh họa.
- **Giấy phép:** *Pixabay Content License*
- **Quyền hạn:** Miễn phí sử dụng cho cả mục đích thương mại và phi thương mại. Được phép tải về và biên tập trong các dự án video cá nhân & thương mại.
- **Yêu cầu ghi công (Attribution):** Không bắt buộc nhưng được khuyến khích (ví dụ: `Sound/Music from Pixabay`).
- **Cơ chế tải:** Cung cấp link tải trực tiếp MP3, MP4 độ phân giải cao.

### 2.2. Pexels (Stock Video Footage & Photos)
- **Website:** https://pexels.com/
- **Loại tài nguyên:** Video thiên nhiên, cinematic, slow-motion, timelapse, background.
- **Giấy phép:** *Pexels License*
- **Quyền hạn:** Miễn phí sử dụng cho dự án video, YouTube, mạng xã hội, thương mại.
- **Yêu cầu ghi công:** Không bắt buộc nhưng được hoan nghênh.
- **Cơ chế tải:** Tải trực tiếp file MP4 gốc theo nhiều tùy chọn kích thước (Full HD, 4K, Mobile).

### 2.3. Mixkit (Music, Sound Effects & Stock Video)
- **Website:** https://mixkit.co/
- **Loại tài nguyên:** Track nhạc dựng phim đa thể loại, tiếng động foley, transition sound, footage ngắn.
- **Giấy phép:** *Mixkit Free License*
- **Quyền hạn:** Sử dụng tự do trong video YouTube, podcast, phim ngắn thương mại.
- **Cơ chế tải:** File âm thanh MP3/WAV chất lượng cao, file video MP4.

### 2.4. Freesound (Thư viện Âm thanh & Tiếng động Foley)
- **Website:** https://freesound.org/
- **Loại tài nguyên:** Hàng trăm nghìn hiệu ứng âm thanh cộng đồng đóng góp.
- **Giấy phép:** CC0 (Public Domain), CC-BY (Ghi công), CC-BY-NC (Phi thương mại).
- **Yêu cầu:** Nếu là CC-BY, hệ thống tự động sinh dòng ghi công chuẩn:
  `"[Tên hiệu ứng]" by [Tác giả] under CC-BY (https://freesound.org)`
- **Cơ chế tải:** Cung cấp preview MP3 chất lượng cao và file gốc WAV/FLAC.

### 2.5. Wikimedia Commons & Internet Archive
- **Website:** https://commons.wikimedia.org/ & https://archive.org/
- **Loại tài nguyên:** Bản ghi âm lịch sử, âm thanh thiên nhiên, tài liệu công cộng (Public Domain).
- **Giấy phép:** Public Domain / CC0 / CC-BY-SA.
- **Cơ chế tải:** Link trực tiếp OGG, MP3, FLAC, WebM, MP4.

### 2.6. Tệp tin cục bộ của người dùng (User-Owned Media)
- **Loại tài nguyên:** Nhạc, hiệu ứng, footage do chính người dùng tự quay, tự thu hoặc tự sở hữu.
- **Cơ chế:** Nhập trực tiếp qua trình duyệt vào cơ sở dữ liệu IndexedDB cục bộ, bảo mật 100% trên máy cá nhân, không tải lên bất kỳ máy chủ bên thứ ba nào.

---

## 3. CƠ CHẾ TẢI XUỐNG & GIỚI HẠN GITHUB PAGES

- **GitHub Pages:** Là môi trường lưu trữ web tĩnh (Static Web Hosting). Không thể chạy các lệnh backend server như `ffmpeg` hoặc `yt-dlp` trực tiếp trên GitHub Pages.
- **Cơ chế Tải Trực tiếp (Browser Direct Download):**
  - Sử dụng thẻ `<a>` với thuộc tính `download` hoặc luồng `fetch()` chuyển thành `Blob URL` để lưu trực tiếp vào thư mục Downloads của người dùng.
- **Dịch vụ Đồng hành Nội bộ (Optional Local Companion):**
  - Là tiện ích tùy chọn chạy trên máy tính của người dùng (`localhost:3111`) bằng Node.js hoặc Python FastAPI.
  - Phục vụ việc xử lý FFmpeg (chuyển đổi định dạng MP3/WAV/MP4) và tải các tài nguyên cho phép một cách tự động khi người dùng kích hoạt cục bộ.
