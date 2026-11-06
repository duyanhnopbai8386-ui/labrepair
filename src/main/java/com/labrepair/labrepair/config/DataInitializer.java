package com.labrepair.labrepair.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.labrepair.labrepair.model.*;
import com.labrepair.labrepair.repository.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ComputerRoomRepository roomRepository;
    private final EquipmentCategoryRepository categoryRepository;
    private final EquipmentRepository equipmentRepository;
    private final SparePartRepository sparePartRepository;
    private final IncidentReportRepository incidentRepository;
    private final RepairHistoryRepository historyRepository;
    private final RepairPartRepository repairPartRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ComputerRoomRepository roomRepository,
            EquipmentCategoryRepository categoryRepository,
            EquipmentRepository equipmentRepository,
            SparePartRepository sparePartRepository,
            IncidentReportRepository incidentRepository,
            RepairHistoryRepository historyRepository,
            RepairPartRepository repairPartRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.categoryRepository = categoryRepository;
        this.equipmentRepository = equipmentRepository;
        this.sparePartRepository = sparePartRepository;
        this.incidentRepository = incidentRepository;
        this.historyRepository = historyRepository;
        this.repairPartRepository = repairPartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println("========== [DataInitializer] KIỂM TRA VÀ KHỞI TẠO DỮ LIỆU CHUẨN ==========");

        // 1. Luôn cập nhật và đồng bộ mật khẩu BCrypt chuẩn cho các tài khoản mẫu
        userRepository.findByEmail("admin@school.edu").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setFullName("Lê Nguyễn Ngọc Duy Anh (Quản trị viên)");
                    admin.setRole("ADMIN");
                    admin.setStatus("ACTIVE");
                    userRepository.save(admin);
                },
                () -> {
                    User admin = new User(null, "AD001", "admin@school.edu", passwordEncoder.encode("admin123"), "Lê Nguyễn Ngọc Duy Anh (Quản trị viên)", "0901234567", "Phòng CNTT", "ADMIN", "ACTIVE", LocalDateTime.now());
                    userRepository.save(admin);
                }
        );

        userRepository.findByEmail("tech@school.edu").ifPresentOrElse(
                tech -> {
                    tech.setPassword(passwordEncoder.encode("tech123"));
                    tech.setFullName("Kỹ thuật viên Nguyễn Văn Trực");
                    tech.setRole("TECHNICIAN");
                    tech.setStatus("ACTIVE");
                    userRepository.save(tech);
                },
                () -> {
                    User tech = new User(null, "KT001", "tech@school.edu", passwordEncoder.encode("tech123"), "Kỹ thuật viên Nguyễn Văn Trực", "0912345678", "Tổ Kỹ thuật", "TECHNICIAN", "ACTIVE", LocalDateTime.now());
                    userRepository.save(tech);
                }
        );

        userRepository.findByEmail("student@school.edu").ifPresentOrElse(
                student -> {
                    student.setPassword(passwordEncoder.encode("student123"));
                    student.setFullName("Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)");
                    student.setRole("STUDENT");
                    student.setStatus("ACTIVE");
                    userRepository.save(student);
                },
                () -> {
                    User student = new User(null, "SV001", "student@school.edu", passwordEncoder.encode("student123"), "Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)", "0987654321", "Khoa CNTT - CCQ2411E", "STUDENT", "ACTIVE", LocalDateTime.now());
                    userRepository.save(student);
                }
        );

        // 2. Khởi tạo Danh mục thiết bị nếu chưa có
        if (categoryRepository.findAll().isEmpty()) {
            categoryRepository.save(new EquipmentCategory(null, "CAT-PC", "Máy tính để bàn", "Máy trạm PC phục vụ học thực hành lập trình và đồ họa"));
            categoryRepository.save(new EquipmentCategory(null, "CAT-MONITOR", "Màn hình máy tính", "Màn hình LCD/IPS từ 24 đến 27 inch"));
            categoryRepository.save(new EquipmentCategory(null, "CAT-NETWORK", "Thiết bị mạng & Server", "Router, Switch Cisco, Access Point WiFi"));
            categoryRepository.save(new EquipmentCategory(null, "CAT-SPARE", "Linh kiện thay thế", "RAM, SSD, Nguồn, Chuột, Bàn phím"));
        }

        // 3. Khởi tạo đầy đủ các phòng máy theo yêu cầu
        List<ComputerRoom> requiredRooms = List.of(
            new ComputerRoom(null, "A101", "Phòng máy thực hành A101 (Lập trình Cơ sở)", "Khu A Tầng 1 - HITC", 40),
            new ComputerRoom(null, "A204", "Phòng máy thực hành A204 (Lập trình Java & Spring Boot)", "Khu A Tầng 2 - HITC", 40),
            new ComputerRoom(null, "A302", "Phòng máy thực hành A302 (Web & Mobile App)", "Khu A Tầng 3 - HITC", 35),
            new ComputerRoom(null, "A404", "Phòng máy thực hành A404 (Trí tuệ nhân tạo & Data Science)", "Khu A Tầng 4 - HITC", 30),
            new ComputerRoom(null, "B102", "Phòng máy thực hành B102 (Mạng máy tính Cisco Lab)", "Khu B Tầng 1 - HITC", 35),
            new ComputerRoom(null, "B201", "Phòng máy thực hành B201 (An toàn thông tin & Quản trị Linux)", "Khu B Tầng 2 - HITC", 30),
            new ComputerRoom(null, "D-06", "Phòng máy thực hành D-06 (Đồ họa & Thiết kế 3D)", "Khu D Tầng Trệt - HITC", 35),
            new ComputerRoom(null, "D5-12", "Phòng máy thực hành D5-12 (IoT & Lập trình vi điều khiển)", "Khu D Tầng 5 - HITC", 30),
            new ComputerRoom(null, "D5-36", "Phòng máy thực hành D5-36 (Cloud Computing & DevOps)", "Khu D Tầng 5 - HITC", 30)
        );

        for (ComputerRoom r : requiredRooms) {
            if (!roomRepository.existsByCode(r.getRoomCode())) {
                roomRepository.save(r);
            }
        }

        // 4. Khởi tạo Thiết bị máy trạm cho từng phòng nếu chưa có
        for (ComputerRoom r : roomRepository.findAll()) {
            if (equipmentRepository.countByRoomCode(r.getRoomCode()) == 0) {
                int count = 15;
                for (int i = 1; i <= count; i++) {
                    String cleanCode = r.getRoomCode().replace("-", "");
                    String numStr = String.format("%02d", i);
                    String eqCode = "PC-" + cleanCode + "-" + numStr;
                    String status = (i == 5) ? "CHO_SUA" : (i == 9) ? "DANG_SUA" : "HOAT_DONG";

                    Equipment eq = new Equipment();
                    eq.setEquipmentCode(eqCode);
                    eq.setName("Máy trạm " + eqCode);
                    eq.setType("COMPUTER");
                    eq.setRoomCode(r.getRoomCode());
                    eq.setRoom(r);
                    eq.setSerialNumber("SN-HITC-" + cleanCode + "-" + numStr + "98");
                    eq.setManufacturer("Dell");
                    eq.setModel(r.getRoomCode().startsWith("D") ? "Dell Precision 3640 Tower" : "Dell OptiPlex 7090 MFF");
                    eq.setPurchaseDate(LocalDate.of(2024, 9, 1));
                    eq.setWarrantyExpiry(LocalDate.of(2027, 9, 1));
                    eq.setStatus(status);
                    eq.setConditionNote(r.getRoomCode().startsWith("D")
                        ? "Core i9-10900K / 32GB RAM / SSD 1TB / RTX 3060 12GB"
                        : "Intel Core i7-10700 / 16GB DDR4 / SSD 512GB / Dell 24\" FHD");
                    equipmentRepository.save(eq);
                }
            }
        }

        // 5. Khởi tạo Kho linh kiện thay thế nếu trống
        if (sparePartRepository.count() == 0) {
            sparePartRepository.save(new SparePart(null, "RAM-DDR4-8G", "RAM Kingston Fury 8GB DDR4 3200MHz", "Thanh", 15, 5, new BigDecimal("450000"), "Kingston VN", "CON_HANG", LocalDateTime.now()));
            sparePartRepository.save(new SparePart(null, "SSD-256G", "SSD Kingston A400 256GB SATA3", "Ổ", 12, 4, new BigDecimal("550000"), "Kingston VN", "CON_HANG", LocalDateTime.now()));
            sparePartRepository.save(new SparePart(null, "PSU-500W", "Nguồn máy tính Cooler Master 500W", "Cái", 8, 2, new BigDecimal("680000"), "Cooler Master", "CON_HANG", LocalDateTime.now()));
            sparePartRepository.save(new SparePart(null, "MOUSE-LOGI", "Chuột có dây Logitech B100", "Con", 25, 5, new BigDecimal("95000"), "Logitech", "CON_HANG", LocalDateTime.now()));
            sparePartRepository.save(new SparePart(null, "KB-DAREU", "Bàn phím DareU LK145 USB", "Cái", 2, 5, new BigDecimal("180000"), "DareU", "SAP_HET", LocalDateTime.now()));
        }

        System.out.println("========== [DataInitializer] HOÀN TẤT ĐỒNG BỘ DỮ LIỆU UTF-8 THÀNH CÔNG! ==========");
    }
}
