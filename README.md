# 🛠️ LabRepair - Hệ Thống Quản Lý & Báo Cáo Sửa Chữa Thiết Bị Phòng Máy

> Dự án xây dựng Backend RESTful API phục vụ quản lý thiết bị phòng máy thực hành, theo dõi tình trạng hư hỏng và điều phối kỹ thuật viên sửa chữa sự cố.

---

## 📌 1. Giới thiệu dự án

Hệ thống **LabRepair** giải quyết bài toán quản lý tài sản, trang thiết bị tại các phòng máy thực hành (trường học, trung tâm đào tạo, văn phòng). Khi thiết bị (máy tính, màn hình, máy chiếu...) gặp trục trặc, giảng viên hoặc sinh viên có thể tạo báo cáo sự cố. Hệ thống hỗ trợ bộ phận quản trị tiếp nhận, phân công kỹ thuật viên xử lý và cập nhật tiến độ minh bạch.

---

## 📅 2. Kế hoạch thực hiện từng tuần (4 Tuần) & Tiến độ dự án

> Kế hoạch 4 tuần rút gọn bám sát mục tiêu xây dựng và hoàn thiện hệ thống Backend:

| Tuần | Công việc chính | Kết quả cần có (Deliverables) | Tiến độ | Trạng thái |
| :---: | :--- | :--- | :---: | :---: |
| **Tuần 1** | **Khảo sát yêu cầu, Thiết kế hệ thống & Khởi tạo dự án**<br>- Chốt đề tài, phân tích vai trò người dùng (Admin, Technician, Teacher, Student).<br>- Thiết kế mô hình CSDL (ERD) và quan hệ kế thừa (Equipment, Computer, Monitor, Projector).<br>- Khởi tạo Spring Boot 3, cấu hình Maven, kết nối MySQL và Hibernate ddl-auto. | - Sơ đồ ERD (`erd.mmd` / Mermaid)<br>- Domain Model UML kế thừa<br>- Project skeleton kết nối MySQL thành công | **100%** |  Hoàn thành |
| **Tuần 2** | **Xây dựng thực thể cơ sở & CRUD các tài nguyên chính**<br>- Thiết kế Entity, Repository, Service, Controller cho `Equipment`, `ComputerRoom`, `EquipmentCategory`, `User`.<br>- Triển khai đầy đủ các phương thức GET, POST, PUT, DELETE.<br>- Cấu hình lưu trữ dữ liệu bền vững trên MySQL qua Spring Data JPA. | - API CRUD Phòng máy (`/api/rooms`)<br>- API CRUD Danh mục (`/api/categories`)<br>- API CRUD Thiết bị (`/api/equipments`)<br>- API CRUD Người dùng (`/api/users`) | **100%** |  Hoàn thành |
| **Tuần 3** | **Xử lý nghiệp vụ Báo cáo sự cố & Bắt lỗi tập trung**<br>- Xây dựng module `IncidentReport`: Tạo phiếu báo hỏng, phân công kỹ thuật viên.<br>- Luồng chuyển đổi trạng thái: `MOI_TIEP_NHAN` -> `DANG_XU_LY` -> `HOAN_THANH` / `HUY`.<br>- Xây dựng bộ bắt lỗi tập trung `GlobalExceptionHandler` (chặn trùng mã, bắt NotFound, validate dữ liệu). | - API Báo cáo & điều phối sự cố (`/api/incidents`)<br>- Chuẩn hóa định dạng lỗi `ErrorResponse`<br>- Xử lý ngoại lệ `DuplicateResource`, `ResourceNotFound`, `BadRequest` | **100%** |  Hoàn thành |
| **Tuần 4** | **Kiểm thử toàn diện, Hoàn thiện tài liệu & Báo cáo**<br>- Kiểm thử toàn bộ API bằng Postman (kiểm tra các ca thành công và biên lỗi).<br>- Xuất file Postman Collection lưu vào thư mục `docs/`.<br>- Chụp ảnh minh chứng kết quả chạy API, viết báo cáo tổng kết.<br>- Hoàn thiện tài liệu `README.md`, đẩy toàn bộ mã nguồn lên GitHub. | - Postman Collection & Test Case đầy đủ<br>- Báo cáo đồ án có kèm ảnh minh chứng<br>- GitHub repository chuẩn chỉ, sẵn sàng nộp | **90%** | 🔄 Đang hoàn thiện |

---

## 🗄️ 3. Sơ đồ thực thể CSDL (Entity Relationship Diagram - ERD)

Dưới đây là sơ đồ quan hệ giữa các bảng trong cơ sở dữ liệu `labrepair_db`:

```mermaid
erDiagram
    COMPUTER_ROOMS ||--o{ EQUIPMENTS : "bố trí trong"
    EQUIPMENT_CATEGORIES ||--o{ EQUIPMENTS : "phân loại"
    EQUIPMENTS ||--o{ INCIDENT_REPORTS : "phát sinh sự cố"
    USERS ||--o{ INCIDENT_REPORTS : "người báo cáo (reported_by)"
    USERS ||--o{ INCIDENT_REPORTS : "kỹ thuật viên xử lý (assigned_to)"

    COMPUTER_ROOMS {
        int id PK
        string room_code UK "Mã phòng (vd: LAB101)"
        string room_name "Tên phòng máy"
        string location "Vị trí / Tòa nhà"
        int capacity "Sức chứa máy tính"
    }

    EQUIPMENT_CATEGORIES {
        int id PK
        string category_code UK "Mã danh mục (vd: PC, MON)"
        string category_name "Tên danh mục"
        string description "Mô tả"
    }

    EQUIPMENTS {
        int id PK
        string equipment_code UK "Mã thiết bị (vd: PC-01-01)"
        string name "Tên thiết bị"
        string type "Loại thiết bị"
        string serial_number "Số Serial"
        string room_code FK "Thuộc phòng máy"
        string status "Trạng thái (HOAT_DONG, HONG, DANG_SUA)"
    }

    USERS {
        int id PK
        string email UK "Email đăng nhập"
        string full_name "Họ và tên"
        string phone "Số điện thoại"
        string role "ADMIN, TECHNICIAN, TEACHER, STUDENT"
        string status "ACTIVE, INACTIVE"
    }

    INCIDENT_REPORTS {
        int id PK
        int equipment_id FK "Thiết bị gặp sự cố"
        int reported_by_user_id FK "Người tạo báo cáo"
        int assigned_technician_id FK "Kỹ thuật viên phụ trách"
        string description "Mô tả chi tiết lỗi"
        string priority "THAP, TRUNG_BINH, CAO, KHAN_CAP"
        string status "MOI_TIEP_NHAN, DANG_XU_LY, HOAN_THANH, HUY"
        datetime created_at "Thời gian tạo"
    }
```

### 🧬 Sơ đồ lớp kế thừa thiết bị (UML Class Diagram)

Hệ thống áp dụng tính kế thừa hướng đối tượng cho các loại thiết bị:

```mermaid
classDiagram
    direction BT
    class Equipment {
        +Integer id
        +String equipmentCode
        +String name
        +String type
        +String serialNumber
        +String roomCode
        +String status
    }
    class Computer {
        +String cpu
        +Integer ramGb
        +Integer storageGb
    }
    class Monitor {
        +Double screenSizeInch
        +String resolution
    }
    class Projector {
        +Integer brightnessLumens
        +String nativeResolution
    }

    Computer --|> Equipment : extends
    Monitor --|> Equipment : extends
    Projector --|> Equipment : extends
```

> 📂 File thiết kế gốc đã được lưu sẵn trong thư mục [docs/](docs/):
> - Sơ đồ ERD: [`docs/erd.mmd`](docs/erd.mmd)
> - Sơ đồ UML: [`docs/domain-model.puml`](docs/domain-model.puml)

---

## 🚀 4. Hướng dẫn cài đặt và chạy thử

### Yêu cầu môi trường
* **Java:** JDK 17 trở lên
* **Build tool:** Apache Maven 3.8+ (hoặc dùng `./mvnw` có sẵn trong source)
* **Database:** MySQL 8.0+

### Các bước khởi chạy
1. **Clone repository:**
   ```bash
   git clone <URL_REPO_GITHUB_CUA_BAN>
   cd labrepair
   ```

2. **Cấu hình cơ sở dữ liệu:**
   - Mở MySQL và tạo một database mới:
     ```sql
     CREATE DATABASE labrepair_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```
   - Kiểm tra file `src/main/resources/application.properties` để chắc chắn thông tin đăng nhập khớp với MySQL máy bạn:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/labrepair_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
     spring.datasource.username=root
     spring.datasource.password=
     ```

3. **Khởi chạy ứng dụng:**
   - Sử dụng Maven Wrapper:
     ```bash
     # Trên Windows:
     .\mvnw.cmd spring-boot:run

     # Trên Linux / macOS:
     ./mvnw spring-boot:run
     ```
   - Ứng dụng sẽ chạy tại: `http://localhost:8080`

---

## 📡 5. Danh sách RESTful API Endpoints

### 🏢 Phòng máy (`/api/rooms`)
- `GET /api/rooms` - Lấy danh sách tất cả các phòng máy.
- `GET /api/rooms/{id}` - Xem thông tin chi tiết một phòng máy.
- `POST /api/rooms` - Thêm mới một phòng máy.
- `PUT /api/rooms/{id}` - Cập nhật thông tin phòng máy.
- `DELETE /api/rooms/{id}` - Xóa phòng máy.

### 🏷️ Danh mục thiết bị (`/api/categories`)
- `GET /api/categories` - Danh sách danh mục.
- `GET /api/categories/{id}` - Chi tiết danh mục.
- `POST /api/categories` - Tạo danh mục mới.
- `PUT /api/categories/{id}` - Sửa danh mục.
- `DELETE /api/categories/{id}` - Xóa danh mục.

### 🖥️ Quản lý thiết bị (`/api/equipments`)
- `GET /api/equipments` - Lấy danh sách tất cả thiết bị.
- `GET /api/equipments/{id}` - Chi tiết thiết bị.
- `POST /api/equipments` - Thêm thiết bị mới vào hệ thống.
- `PUT /api/equipments/{id}` - Cập nhật thông tin thiết bị.
- `DELETE /api/equipments/{id}` - Xóa thiết bị khỏi hệ thống.

### 👥 Người dùng (`/api/users`)
- `GET /api/users` - Danh sách người dùng.
- `GET /api/users/{id}` - Chi tiết người dùng.
- `POST /api/users` - Tạo người dùng mới.
- `PUT /api/users/{id}` - Cập nhật thông tin người dùng.
- `DELETE /api/users/{id}` - Xóa người dùng.

### ⚠️ Báo cáo sự cố (`/api/incidents`)
- `GET /api/incidents` - Danh sách tất cả các sự cố được báo cáo.
- `GET /api/incidents/{id}` - Chi tiết sự cố.
- `POST /api/incidents` - Tạo mới báo cáo sự cố (giảng viên/sinh viên tạo).
- `PUT /api/incidents/{id}` - Cập nhật thông tin/trạng thái sự cố (kỹ thuật viên xử lý).
- `DELETE /api/incidents/{id}` - Xóa bản ghi sự cố.

---

## 📁 6. Cấu trúc thư mục dự án

```text
labrepair/
├── docs/                       # Tài liệu thiết kế, sơ đồ, Postman collection
├── src/
│   ├── main/
│   │   ├── java/com/labrepair/labrepair/
│   │   │   ├── controller/     # Tiếp nhận HTTP Request và điều phối luồng
│   │   │   ├── service/        # Chứa Business Logic (nghiệp vụ hệ thống)
│   │   │   ├── repository/     # Tương tác với CSDL qua Spring Data JPA
│   │   │   ├── model/          # Định nghĩa các Entity JPA
│   │   │   └── exception/      # Bắt lỗi toàn cục & chuẩn hóa định dạng lỗi
│   │   └── resources/
│   │       └── application.properties # Cấu hình DB, Port, Hibernate
│   └── test/                   # Unit test & Integration test
├── pom.xml                     # Khai báo dependency Maven
└── README.md                   # Tài liệu tổng quan dự án
```


---

## 🎨 7. Giao diện Người Dùng Hiện Đại (Web Frontend SPA)

Giao diện hệ thống được thiết kế theo phong cách **iOS Frosted Glass (Kính mờ Apple Glassmorphism)** kết hợp tông màu **Trắng Tinh Khiết & Xanh Nước Biển (Aqua Blue)**:

- **Công nghệ nền tảng:** React 19 + Vite 6 + Tailwind CSS + Lucide Icons.
- **Phong cách thị giác (Visual Language):**
  - Hiệu ứng kính mờ chiều sâu (`backdrop-blur-2xl`, viền phát sáng `border-white/60`, đổ bóng mềm `shadow-sky-500/10`).
  - Nút bấm và thẻ bo góc lớn mềm mại đặc trưng iOS (`rounded-2xl`, `rounded-3xl`, viền bóng mượt).
  - Badge trạng thái thông minh phát sáng: Đèn xanh (Hoạt động), Đèn vàng/đỏ (Chờ sửa/Hỏng), Đèn xanh dương (Đang bảo trì).
- **Các phân hệ màn hình chính:**
  1. **Trung tâm Điều hành (Dashboard):** 4 thẻ widget thống kê tổng quan (Máy hoạt động, Sự cố đang xử lý, Chi phí sửa chữa lũy kế, Cảnh báo vật tư chạm ngưỡng), biểu đồ phân bổ kinh phí theo phòng máy và danh sách sự cố khẩn cấp.
  2. **Phòng máy & Sơ đồ Máy trạm (Computer Rooms):** Chuyển đổi linh hoạt giữa PM01, PM02, PM03; xem sơ đồ trực quan từng vị trí máy tính; click xem cấu hình phần cứng chi tiết và nút 1-click báo hỏng.
  3. **Phiếu Báo Hỏng & Quản Lý Sửa Chữa (Incidents):** Luồng tạo phiếu báo hỏng; Kỹ thuật viên tiếp nhận; modal sửa chữa chọn linh kiện từ kho tự động tính chi phí, xuất kho và chuyển máy về trạng thái hoạt động.
  4. **Kho Linh Kiện & Vật Tư (Spare Parts):** Quản lý tồn kho linh kiện, cảnh báo đỏ khi chạm mức tồn tối thiểu, tính năng nhập thêm hàng nhanh chóng.
  5. **Đăng nhập & Trải nghiệm Nhanh (1-Click Demo):** 4 nút bấm đăng nhập tức thì cho Quản trị viên (Admin), Kỹ thuật viên (Technician), Giảng viên (Teacher) và Sinh viên Duy Anh (CCQ2411E).

### 🚀 Hướng Dẫn Khởi Chạy Frontend:
```bash
cd frontend
npm install
npm run dev
# Ứng dụng chạy tại: http://localhost:5173
```
