# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD) - USER SERVICE

## 1. Tổng quan (Overview)
**User Service** là một microservice cốt lõi chịu trách nhiệm quản lý thông tin người dùng, xử lý xác thực (Authentication), phân quyền (Authorization) và quản lý bảo mật tài khoản (OTP, mã hóa mật khẩu). Ngoài ra, service này cũng chịu trách nhiệm giao tiếp với các hệ thống bên thứ ba (Google OAuth2, Email Server) và lắng nghe các sự kiện nội bộ hệ thống thông qua Kafka.

---

## 2. Các tính năng chính (Key Features)

### 2.1. Quản lý người dùng (User Management)
* **Đăng ký tài khoản mới (Registration):** Cho phép người dùng hoặc hệ thống tạo mới tài khoản.
* **Cập nhật thông tin hồ sơ (Profile Update):** Cho phép thay đổi các thông tin cá nhân bao gồm: Họ và tên, Email, Địa chỉ, Quyền hạn (Role) và Tên đăng nhập (Username).
* **Quản trị viên (Admin Tools):** * Lấy danh sách toàn bộ người dùng trong hệ thống.
    * Đăng ký tài khoản với quyền Admin (bỏ qua quy tắc set quyền mặc định).
    * Xóa tài khoản người dùng khỏi hệ thống theo ID.
* **Tra cứu thông tin:** Hỗ trợ tìm kiếm người dùng theo ID, theo Email hoặc theo một từ khóa bất kỳ (có thể là username, email hoặc số điện thoại).

### 2.2. Xác thực và Bảo mật (Authentication & Security)
* **Đăng nhập truyền thống:** Cho phép người dùng đăng nhập linh hoạt bằng một trong ba thông tin: Tên đăng nhập (Username), Email, hoặc Số điện thoại cùng với mật khẩu.
* **Đăng nhập qua Google (OAuth2):** Hỗ trợ đăng nhập một chạm (Single Sign-On) sử dụng Google ID Token.
* **Quản lý mật khẩu:** Mã hóa mật khẩu một chiều trước khi lưu vào cơ sở dữ liệu. Cung cấp tính năng cập nhật/đổi mật khẩu an toàn.
* **Tích hợp Spring Security:** Tự động định dạng lại quyền hạn (roles) theo chuẩn `ROLE_{Tên quyền}` để hệ thống phân quyền (Authorization) có thể hoạt động chính xác.

### 2.3. Quản lý OTP (One-Time Password)
* **Sinh mã OTP:** Tạo mã bảo mật ngẫu nhiên dùng một lần để phục vụ cho các luồng xác thực (như quên mật khẩu, xác thực đăng nhập).
* **Gửi OTP qua Email:** Tự động trích xuất email của người dùng và gửi mã OTP kèm theo thông báo.
* **Xác thực OTP:** Kiểm tra tính hợp lệ và thời hạn của mã OTP mà người dùng nhập vào.

### 2.4. Tích hợp Hệ thống (System Integration)
* **Kafka Consumer:** Lắng nghe các sự kiện (events) liên quan đến đơn hàng từ topic `order-events`. Mở rộng để phục vụ logic tích điểm thưởng (loyalty points) hoặc gửi thông báo cho khách hàng khi đơn hàng thay đổi trạng thái.

---

## 3. Quy tắc Nghiệp vụ chi tiết (Business Rules)

### BR-01: Quy tắc Đăng ký tài khoản
1. **Thông tin bắt buộc:** `Username` và `Password` không được để trống.
2. **Tính duy nhất (Uniqueness):** * `Username` không được trùng lặp.
    * `Email` (nếu có cung cấp) không được trùng lặp.
    * `Phone` (nếu có cung cấp) không được trùng lặp.
3. **Phân quyền mặc định:** Nếu lúc đăng ký không truyền quyền hạn (Role), hệ thống sẽ tự động gán quyền mặc định là `USER`.
4. **Bảo mật:** Mật khẩu gốc tuyệt đối không được lưu dưới dạng plain-text, phải được mã hóa trước khi lưu trữ.

### BR-02: Quy tắc Đăng nhập và Xác thực
1. **Đăng nhập truyền thống:** Hệ thống tự động nhận diện từ khóa đăng nhập của khách hàng (login key). Khách hàng có thể nhập username, email, hoặc số điện thoại vào cùng một ô input, hệ thống sẽ tuần tự kiểm tra và quét qua cả 3 trường dữ liệu này để tìm kiếm tài khoản.
2. **Đăng nhập bằng Google:** * Hệ thống phải gọi thư viện Google để xác minh tính hợp lệ của `idTokenString`.
    * Nếu email từ Google chưa từng tồn tại trong hệ thống: Tự động tạo một tài khoản mới với `Username` và `Email` bằng chính email của Google, `Password` để trống (không hỗ trợ đăng nhập mật khẩu với tài khoản này) và cấp quyền mặc định.
    * Nếu email đã tồn tại: Cho phép đăng nhập bình thường.

### BR-03: Quy tắc quản lý mã OTP
1. **Định dạng:** Mã OTP phải luôn có định dạng là **6 chữ số** (ví dụ: `048123`).
2. **Thời hạn (Expiry):** Mã OTP chỉ có hiệu lực tối đa **5 phút** kể từ lúc sinh ra.
3. **Quy tắc ghi đè:** Tại một thời điểm, mỗi một chuỗi định danh (loginKey) chỉ có duy nhất một mã OTP tồn tại. Nếu người dùng yêu cầu gửi lại mã mới, hệ thống phải xóa bỏ mã cũ trong cơ sở dữ liệu trước khi sinh mã mới.

### BR-04: Quy tắc Cập nhật thông tin (Update Profile)
1. Người dùng có quyền cập nhật từng trường thông tin (Họ tên, Email, Địa chỉ, Quyền, Username). Trường nào không truyền lên thì giữ nguyên giá trị cũ.
2. **Kiểm tra trùng lặp:** Nếu người dùng yêu cầu đổi `Username`, hệ thống phải kiểm tra xem username mới đã bị ai khác sử dụng hay chưa. Nếu trùng sẽ báo lỗi ngay lập tức.

---

## 4. Yêu cầu Kỹ thuật dự kiến (Technical Dependencies)
* **Bảo mật mật khẩu:** Dùng `PasswordEncoder` (thường là BCrypt).
* **Dịch vụ Email:** Dùng `JavaMailSender` (giao thức SMTP) để gửi thư xác thực.
* **Google Auth:** Dùng thư viện `GoogleIdTokenVerifier` với thông tin `google.client-id` được cấp từ Google Cloud Console.
* **Event-Driven:** Dùng thư viện `Spring Kafka` lắng nghe tại Consumer Group `user-group`.