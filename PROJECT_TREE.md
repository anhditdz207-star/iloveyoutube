# CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT TREE)
## Personal Music Hub & Media Studio

```
personal-music-hub/
├── .gemini/
│   ├── rules/
│   │   └── workspace-rules.md     # Quy tắc làm việc workspace
│   └── rules.md
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions tự động build & deploy GitHub Pages
├── companion/                      # Dịch vụ đồng hành cục bộ (Tùy chọn cho Desktop)
│   ├── server.js                   # Node.js Express/Fastify companion service
│   ├── main.py                     # Python FastAPI companion service (hỗ trợ yt-dlp & FFmpeg)
│   ├── package.json
│   ├── requirements.txt
│   └── README.md                   # Hướng dẫn cài đặt & bảo mật dịch vụ nội bộ
├── public/
│   ├── favicon.svg                 # Biểu tượng neon purple của ứng dụng
│   └── default-artwork.svg         # Ảnh bìa mặc định khi chưa có artwork
├── src/
│   ├── components/                 # Các thành phần giao diện tái sử dụng
│   │   ├── common/
│   │   │   ├── AssetCard.tsx       # Thẻ tài nguyên media (SFX, footage, âm nhạc)
│   │   │   ├── Modal.tsx           # Hộp thoại popup đa dụng
│   │   │   ├── Notification.tsx    # Thông báo toast sinh động
│   │   │   ├── TrackCard.tsx       # Thẻ bài hát chuẩn âm nhạc với nút phát nhanh
│   │   │   └── VideoCard.tsx       # Thẻ video với thumbnail, thời lượng, xem trước
│   │   ├── layout/
│   │   │   ├── Layout.tsx          # Bố cục chính kết nối Sidebar, Topbar, Content, Player
│   │   │   ├── Navbar.tsx          # Thanh điều hướng trên cùng, tìm kiếm, profile
│   │   │   └── Sidebar.tsx         # Thanh điều hướng bên trái 11 mục chuẩn tiếng Việt
│   │   └── player/
│   │       ├── EqualizerModal.tsx  # Bộ chỉnh âm 7 băng tần Web Audio API
│   │       ├── FocusMode.tsx       # Chế độ tập trung toàn màn hình sóng nhạc neon
│   │       ├── MiniPlayer.tsx      # Trình phát thu nhỏ góc màn hình
│   │       ├── PersistentPlayer.tsx# Trình phát nhạc dưới đáy bền bỉ không gián đoạn
│   │       ├── QueuePanel.tsx      # Bảng hàng đợi phát nhạc hỗ trợ kéo thả sắp xếp
│   │       └── SleepTimerModal.tsx # Hẹn giờ dừng phát thông minh
│   ├── data/
│   │   └── curatedMedia.ts         # Kho dữ liệu mẫu chất lượng cao (nhạc lofi, chill, cinematic, SFX, footage 4K)
│   ├── pages/                      # 11 trang giao diện chính
│   │   ├── AssetLibraryPage.tsx    # Kho tài nguyên dựng phim (8 danh mục, IndexedDB, license inspector)
│   │   ├── DiscoverPage.tsx        # Khám phá xu hướng âm nhạc, nghệ sĩ & phong cách mới
│   │   ├── DownloaderPage.tsx      # Trình tải media thông minh & hàng đợi tải
│   │   ├── FavoritesPage.tsx       # Bài hát & tài nguyên yêu thích
│   │   ├── HistoryPage.tsx         # Lịch sử nghe nhạc & thống kê thời lượng
│   │   ├── HomePage.tsx            # Trang chủ ưu tiên âm nhạc (Tiếp tục nghe, Dành cho bạn, Radio...)
│   │   ├── LibraryPage.tsx         # Thư viện cá nhân tổng hợp
│   │   ├── MusicPage.tsx           # Chuyên trang âm nhạc (80% trải nghiệm nghe nhạc)
│   │   ├── PlaylistsPage.tsx       # Quản lý Playlist cá nhân (Tạo, sửa, xóa, phát tất cả)
│   │   ├── SettingsPage.tsx        # Cài đặt giao diện tím neon, hồ sơ, sao lưu JSON
│   │   └── VideoPage.tsx           # Chuyên trang video (20% video watching)
│   ├── services/                   # Logic nghiệp vụ & dịch vụ trình duyệt
│   │   ├── audioEngine.ts          # Bộ máy xử lý âm thanh Web Audio API & Equalizer BiquadFilter
│   │   ├── contentProviders.ts     # Bộ điều phối nguồn cấp nội dung modular
│   │   ├── downloadManager.ts      # Trình quản lý hàng đợi tải & lưu file về máy
│   │   ├── localCompanionClient.ts # Kết nối an toàn tới companion nội bộ
│   │   └── mediaSession.ts         # Tích hợp Navigator.mediaSession (phím media trên bàn phím, màn hình khóa)
│   ├── storage/                    # Lưu trữ cục bộ bảo mật (Local-First)
│   │   ├── indexedDb.ts            # IndexedDB: Kho tài nguyên, Playlist, Lịch sử, Bộ nhớ đệm
│   │   └── localStorage.ts         # Cấu hình cá nhân, Tùy chọn giao diện, Volume
│   ├── types/                      # Định nghĩa kiểu dữ liệu TypeScript
│   │   ├── media.ts                # Định nghĩa tài nguyên media, bản quyền, hàng đợi tải
│   │   ├── music.ts                # Định nghĩa Track, Album, Artist, Playlist, PlayerState
│   │   └── settings.ts             # Định nghĩa cấu hình người dùng & tùy chọn
│   ├── App.tsx                     # Bộ điều phối ứng dụng, PlayerProvider, Router logic
│   ├── index.css                   # Định kiểu Tailwind v4, bảng màu Neon Purple, Scrollbar tùy chỉnh
│   └── main.tsx                    # Điểm khởi chạy React DOM
├── index.html                      # Tệp HTML gốc với tiêu đề và meta tag chuẩn SEO/PWA
├── MEDIA_SOURCES.md                # Tài liệu về nguồn media, API & quy định bản quyền
├── package.json                    # Khai báo thư viện & dependencies
├── PROJECT_TREE.md                 # Cấu trúc toàn bộ thư mục dự án
├── README.md                       # Hướng dẫn chi tiết sử dụng & cài đặt
├── TASK_CHECKLIST.md               # Danh mục tiến độ công việc từng giai đoạn
├── tsconfig.app.json               # Cấu hình TypeScript cho ứng dụng
├── tsconfig.json                   # Cấu hình TypeScript gốc
└── vite.config.ts                  # Cấu hình Vite (Tailwind plugin, Alias @, GitHub Pages base path)
```
