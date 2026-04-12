# Kế hoạch triển khai User Service

Tài liệu này chuyển hóa yêu cầu trong `userservice.md` thành kế hoạch triển khai theo thứ tự ưu tiên để dev backend có thể bắt đầu ngay, giảm rework và dễ chia sprint.

## 1) Kiến trúc & package
- [ ] Chuẩn hóa package: `controller`, `service`, `model`, `repository`, `config`.
- [ ] Tách service theo domain:
  - `AuthService`
  - `UserService`
  - `OtpService`
  - `GoogleAuthService`
  - `OrderEventConsumer`
- [ ] Tạo `GlobalExceptionHandler` + error response thống nhất.

## 2) Data model & repository
- [ ] Hoàn thiện entity `User`:
  - `id, username, email, phone, passwordHash, roles, fullName, address, provider, createdAt, updatedAt`
- [ ] Hoàn thiện entity `Otp`:
  - `id, loginKey, code, expiresAt, createdAt`
- [ ] Thiết lập ràng buộc dữ liệu:
  - `username` unique
  - `email` unique (nếu có)
  - `phone` unique (nếu có)
  - `otp.loginKey` unique để đảm bảo ghi đè OTP cũ
- [ ] Bổ sung method repository:
  - `findByUsername`, `findByEmail`, `findByPhone`
  - query tìm kiếm theo từ khóa `username/email/phone`

## 3) API contract
- [ ] Chốt endpoint Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login` (nhận `loginKey`)
  - `POST /api/auth/google`
- [ ] Chốt endpoint User/Admin:
  - `GET /api/users/{id}`
  - `PATCH /api/users/{id}`
  - `GET /api/admin/users`
  - `DELETE /api/admin/users/{id}`
  - `GET /api/users/search?q=...`
- [ ] Chốt endpoint OTP:
  - `POST /api/auth/otp/send`
  - `POST /api/auth/otp/verify`
- [ ] Chuẩn hóa schema lỗi: `timestamp, status, code, message, path`.

## 4) Business logic theo BRD (BR-01..BR-04)
- [ ] **BR-01 Register**:
  - Validate bắt buộc `username`, `password`
  - Kiểm tra trùng `username/email/phone`
  - Nếu thiếu role -> gán mặc định `USER`
  - Mã hóa mật khẩu bằng BCrypt
- [ ] **BR-02 Login/Auth**:
  - Login thường: dò `username -> email -> phone`
  - Login Google: verify `idToken`, auto-create account nếu chưa tồn tại
  - Tài khoản social không hỗ trợ login password
- [ ] **BR-03 OTP**:
  - OTP 6 chữ số
  - Hết hạn sau 5 phút
  - Yêu cầu OTP mới thì xóa/ghi đè OTP cũ theo `loginKey`
- [ ] **BR-04 Update profile**:
  - Cập nhật từng phần (field null thì giữ nguyên)
  - Đổi username phải check conflict

## 5) Security/Auth
- [ ] Cấu hình `SecurityConfig`:
  - Public: register/login/google/otp
  - Protected: user/admin theo role
- [ ] Tạo `JwtUtils` (generate/validate token).
- [ ] Tạo `JwtAuthenticationFilter` đọc `Authorization: Bearer ...`.
- [ ] Chuẩn hóa role format: `ROLE_USER`, `ROLE_ADMIN`.

## 6) OTP & Email
- [ ] Tích hợp `JavaMailSender` (SMTP) để gửi OTP.
- [ ] Tạo template email OTP ngắn gọn, rõ thời hạn.
- [ ] Xử lý OTP one-time-use (verify thành công thì vô hiệu hóa).

## 7) Google OAuth2
- [ ] Tích hợp `GoogleIdTokenVerifier`.
- [ ] Cấu hình `google.client-id` trong properties.
- [ ] Mapping account Google mới/tồn tại theo email.

## 8) Kafka integration
- [ ] Tạo consumer lắng nghe topic `order-events`.
- [ ] Consumer group: `user-group`.
- [ ] Chuẩn hóa payload event để mở rộng loyalty/notification.

## 9) Cấu hình ứng dụng
- [ ] Hoàn thiện `application.properties` cho:
  - datasource + JPA
  - JWT (`secret`, `expiration`)
  - SMTP mail
  - Kafka
  - Eureka/discovery
- [ ] Tách profile `dev/test/prod`.

## 10) Test strategy
- [ ] Unit test:
  - service logic register/login/update/otp/google
  - validator + jwt utility
- [ ] Integration test:
  - repository constraints
  - controller + security flow
  - OTP expiry/resend
- [ ] Mock integration ngoài: Google, SMTP, Kafka khi cần.

## 11) Done Definition
- [ ] Đáp ứng đầy đủ BR-01..BR-04.
- [ ] API docs đủ request/response/error.
- [ ] Test pass theo scope đã chốt.
- [ ] Chạy local được với profile `dev`.

## 12) Ước lượng effort (8 ngày)
- **D1:** Chốt kiến trúc + API contract
- **D2:** Entity/Repository + migration
- **D3:** BR-01 + BR-04
- **D4:** Login + JWT security
- **D5:** Google OAuth2
- **D6:** OTP + Email
- **D7:** Kafka + config profiles
- **D8:** Test + hardening + review

## Open points cần chốt sớm
- [ ] Đồng bộ version Spring Boot giữa các service (tránh lệch major).
- [ ] Chốt 1 endpoint login hợp nhất (`loginKey`) hay tách endpoint theo loại định danh.
- [ ] Chốt phạm vi admin tools và mức chi tiết xử lý event từ `order-events`.

