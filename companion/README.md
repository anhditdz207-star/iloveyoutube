# DỊCH VỤ ĐỒNG HÀNH CỤC BỘ (OPTIONAL LOCAL COMPANION)
## Personal Music Hub & Media Studio Companion Service

Dịch vụ này là **TÙY CHỌN (OPTIONAL)** và KHÔNG bắt buộc đối với hoạt động bình thường của trang web tĩnh GitHub Pages.

---

## 🔒 NGUYÊN TẮC BẢO MẬT
1. **Chỉ lắng nghe địa chỉ cục bộ:** `127.0.0.1:3111` (Không bao giờ lắng nghe trên `0.0.0.0` hoặc mở ra mạng công cộng).
2. **Xác thực Token:** Mọi yêu cầu từ trình duyệt đến dịch vụ này phải mang kèm Header:
   `Authorization: Bearer local-token-secure-pmh`
3. **CORS:** Giới hạn yêu cầu trình duyệt cục bộ.

---

## 🚀 CÁCH KHỞI CHẠY

### Lựa chọn 1: Sử dụng Node.js (Khuyên dùng)
```bash
cd companion
npm start
```

### Lựa chọn 2: Sử dụng Python FastAPI
```bash
cd companion
pip install fastapi uvicorn pydantic
python main.py
```

Khi dịch vụ đang chạy, trang web tại mục **Cài đặt** sẽ hiển thị trạng thái `Đang hoạt động (Online)`.
