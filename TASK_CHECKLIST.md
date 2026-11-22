# DANH SÁCH CÔNG VIỆC & TIẾN ĐỘ DỰ ÁN (TASK CHECKLIST)
## Personal Music Hub & Media Studio

- [x] **Khởi tạo dự án & Môi trường**
  - [x] Tạo dự án Vite + React + TypeScript tại `C:\Users\ngang\Downloads\personal-music-hub`
  - [x] Cài đặt dependencies: Tailwind CSS v4, Lucide Icons, IDB (IndexedDB wrapper)
  - [x] Thiết lập cấu trúc thư mục module hóa sạch sẽ

- [x] **GIAI ĐOẠN 1: FOUNDATION, GIAO DIỆN SÁNG / TỐI & DÂY KÉO BÓNG ĐÈN**
  - [x] Bổ sung **Chế độ Sáng (Light Theme)** tinh tế, sáng sủa, thanh lịch
  - [x] Tinh chỉnh Chế độ Tối (Dark Theme): loại bỏ hiệu ứng neon chói gắt, giảm bớt sự rườm rà, chuẩn phong cách thiết kế chuyên nghiệp của con người
  - [x] Thêm **Hiệu ứng Kéo dây bóng đèn (Interactive Lamp Cord Pull)**: kéo dây lò xo đàn hồi có âm thanh "tách" để bật/tắt đèn chuyển đổi giữa Sáng và Tối
  - [x] Topbar: Tìm kiếm thông minh, dây kéo đèn, Avatar & Profile cá nhân
  - [x] Sidebar: 11 mục điều hướng tiếng Việt chuẩn, gọn gàng, không bị rối mắt
  - [x] Trang chủ: Bố cục thoáng đãng, các khối thẻ phân tầng rõ ràng
  - [x] Responsive hoàn chỉnh trên Desktop, Tablet và Mobile
  - [x] Cấu hình GitHub Pages (`vite.config.ts` base path `./`, workflow GitHub Actions tự động tại `.github/workflows/deploy.yml`)

- [x] **GIAI ĐOẠN 2: HỆ THỐNG ÂM NHẠC & TRÌNH PHÁT BỀN VỮNG**
  - [x] Trình phát nhạc dưới đáy (Persistent Bottom Player) duy trì liên tục qua các trang
  - [x] Đầy đủ chức năng: Play/Pause, Next/Prev, Seekbar, Thời gian, Volume, Shuffle, Repeat (1 bài/tất cả), Playback speed (0.5x - 2x)
  - [x] Chế độ "Nghe liên tục" (Continuous Listening Mode): tự động chuyển bài thông minh, Media Session API
  - [x] Chế độ "Chỉ nghe nhạc" (Audio-Only Mode): tối ưu hóa hiển thị, tiết kiệm tài nguyên
  - [x] Bảng hàng đợi phát nhạc (Queue panel) với di chuyển sắp xếp thứ tự và Smart Queue suggestions
  - [x] Quản lý Thư viện nhạc cá nhân: Bài hát yêu thích, Playlist tùy chỉnh, Lịch sử nghe
  - [x] Phím tắt bàn phím (Space, Arrow keys, Mute, Next, Prev, Like)

- [x] **GIAI ĐOẠN 3: MEDIA STUDIO — TRÌNH TẢI & KHO TÀI NGUYÊN DỰNG PHIM**
  - [x] Giao diện Trình tải media (Media Downloader): Nhập URL/Từ khóa, tự động nhận diện định dạng, thumbnail, bản quyền
  - [x] Tích hợp nguồn tài nguyên miễn phí bản quyền: Pixabay, Pexels, Mixkit, Freesound, Wikimedia Commons, Internet Archive
  - [x] Hàng đợi tải xuống (Download Queue): Thêm, hủy, thử lại, hiển thị tiến độ và lịch sử tải
  - [x] Kho tài nguyên media (Media Asset Library) sử dụng IndexedDB:
    - 8 phân loại: Nhạc nền, Hiệu ứng âm thanh (SFX), Footage, Video cinematic, Video thiên nhiên, Background, Hình ảnh, Khác
    - Nhập file cục bộ (Drag & drop/File picker), lưu metadata, tags, ghi chú cá nhân
    - Bộ lọc, tìm kiếm theo tên, tag, bản quyền
  - [x] Module theo dõi Bản quyền & Giấy phép (License & Copyright Tracker):
    - Tự động cảnh báo tài nguyên thiếu giấy phép
    - Trình tạo thông tin ghi công (Attribution generator) chuẩn chỉnh cho video editor

- [x] **GIAI ĐOẠN 4: TIỆN ÍCH DỰNG PHIM & NÂNG CAO (SMART UTILITIES)**
  - [x] Bộ chỉnh âm Equalizer 7 băng tần chuẩn Web Audio API với các preset (Bass Boost, Pop, Rock, Classical, Acoustic, Tùy chỉnh)
  - [x] Hẹn giờ tắt nhạc (Sleep Timer): 15p, 30p, 45p, 60p, Hết bài hiện tại, Tùy chỉnh
  - [x] Hàng đợi thông minh (Smart Queue) & Radio cá nhân (Personal Radio) tự sinh danh sách bài tương đồng
  - [x] Chế độ tập trung (Focus Mode): giao diện toàn màn hình tối giản với hiệu ứng sóng nhạc và album art
  - [x] Thống kê thói quen nghe nhạc (Listening Statistics): thời lượng nghe, bài hát & nghệ sĩ nghe nhiều nhất
  - [x] Tiện ích Video Editing: Audio Waveform Preview, Video Inspector (độ phân giải, thời lượng, kích thước, codec)
  - [x] Sao lưu & Phục hồi dữ liệu cá nhân (JSON Backup & Restore)

- [x] **GIAI ĐOẠN 5: BỘ DỊCH VỤ ĐỒNG HÀNH NỘI BỘ (OPTIONAL LOCAL COMPANION)**
  - [x] Mã nguồn độc lập tại thư mục `companion/` (Node.js & Python FastAPI)
  - [x] Hỗ trợ yt-dlp & FFmpeg cho tài nguyên được phép xử lý cục bộ
  - [x] Bảo mật: Chỉ lắng nghe `127.0.0.1`, CORS whitelist, Token xác thực cục bộ

- [x] **GIAI ĐOẠN 6: KIỂM THỬ TOÀN DIỆN & HOÀN THIỆN TÀI LIỆU**
  - [x] Kiểm tra phát nhạc, chuyển trang không ngắt quãng
  - [x] Kiểm tra IndexedDB lưu trữ bài hát, playlist, tài nguyên
  - [x] Kiểm tra tính tương thích Responsive trên Desktop, Tablet, Mobile
  - [x] Kiểm tra Build production không lỗi (`dist/` tạo thành công)
  - [x] Hoàn thiện `README.md`, `PROJECT_TREE.md`, `MEDIA_SOURCES.md`, `TASK_CHECKLIST.md`
