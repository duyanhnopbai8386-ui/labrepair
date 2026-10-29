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
        System.out.println("========== [DataInitializer] KIỂM TRA VÀ KHỞI TẠO TÀI KHOẢN MẪU ==========");

        // 1. Luôn đảm bảo tài khoản Admin và Technician tồn tại với mật khẩu BCrypt chính xác
        if (userRepository.findByEmail("admin@school.edu").isEmpty()) {
            User admin = new User(null, "AD001", "admin@school.edu", passwordEncoder.encode("admin123"), "Quản trị viên Hệ thống", "0901234567", "Phòng CNTT", "ADMIN", "ACTIVE", LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("-> Đã tạo tài khoản Admin: admin@school.edu / admin123");
        }

        if (userRepository.findByEmail("tech@school.edu").isEmpty()) {
            User tech = new User(null, "KT001", "tech@school.edu", passwordEncoder.encode("tech123"), "Kỹ thuật viên Nguyễn Văn Trực", "0912345678", "Tổ Kỹ thuật", "TECHNICIAN", "ACTIVE", LocalDateTime.now());
            userRepository.save(tech);
            System.out.println("-> Đã tạo tài khoản Technician: tech@school.edu / tech123");
        }

        if (userRepository.findByEmail("student@school.edu").isEmpty()) {
            User student = new User(null, "2124110340", "student@school.edu", passwordEncoder.encode("student123"), "Lê Nguyễn Ngọc Duy Anh", "0934567890", "Lớp CCQ2411E", "STUDENT", "ACTIVE", LocalDateTime.now());
            userRepository.save(student);
            System.out.println("-> Đã tạo tài khoản Student: student@school.edu / student123");
        }

        // Cập nhật mật khẩu cho các tài khoản cũ bị NULL
        userRepository.findAll().forEach(u -> {
            if (u.getPassword() == null || u.getPassword().isBlank()) {
                u.setPassword(passwordEncoder.encode(u.getRole().equalsIgnoreCase("ADMIN") ? "admin123" : "tech123"));
                userRepository.save(u);
            }
        });

        // 2. Khởi tạo Danh mục thiết bị
        if (categoryRepository.findAll().isEmpty()) {
            categoryRepository.save(new EquipmentCategory(null, "PC", "Máy tính để bàn", "Máy tính để bàn phục vụ học tập"));
            categoryRepository.save(new EquipmentCategory(null, "MONITOR", "Màn hình máy tính", "Màn hình hiển thị LED/LCD"));
            categoryRepository.save(new EquipmentCategory(null, "PROJECTOR", "Máy chiếu", "Máy chiếu phòng thực hành"));
        }

        // 3. Khởi tạo Phòng máy
        if (roomRepository.findAll().isEmpty()) {
            roomRepository.save(new ComputerRoom(null, "PM01", "Phòng máy 1 (Lập trình Java)", "Tòa H, Tầng 3, Phòng H301", 45));
            roomRepository.save(new ComputerRoom(null, "PM02", "Phòng máy 2 (Mạng & Hệ thống)", "Tòa A, Tầng 2, Phòng A204", 40));
        }

        // 4. Khởi tạo Thiết bị mẫu
        if (equipmentRepository.count() == 0) {
            Equipment eq1 = new Equipment();
            eq1.setEquipmentCode("PC-PM01-01");
            eq1.setName("Dell OptiPlex 7090 - Máy 01");
            eq1.setType("PC");
            eq1.setRoomCode("PM01");
            eq1.setSerialNumber("SN-DELL-7090-001");
            eq1.setManufacturer("Dell");
            eq1.setModel("OptiPlex 7090");
            eq1.setPurchaseDate(LocalDate.of(2025, 9, 1));
            eq1.setWarrantyExpiry(LocalDate.of(2028, 9, 1));
            eq1.setStatus("HOAT_DONG");
            equipmentRepository.save(eq1);

            Equipment eq2 = new Equipment();
            eq2.setEquipmentCode("PC-PM01-02");
            eq2.setName("Dell OptiPlex 7090 - Máy 02");
            eq2.setType("PC");
            eq2.setRoomCode("PM01");
            eq2.setSerialNumber("SN-DELL-7090-002");
            eq2.setManufacturer("Dell");
            eq2.setModel("OptiPlex 7090");
            eq2.setPurchaseDate(LocalDate.of(2025, 9, 1));
            eq2.setWarrantyExpiry(LocalDate.of(2028, 9, 1));
            eq2.setStatus("CHO_SUA");
            eq2 = equipmentRepository.save(eq2);

            Equipment eq3 = new Equipment();
            eq3.setEquipmentCode("PRJ-PM01");
            eq3.setName("Máy chiếu Epson EB-X06");
            eq3.setType("PROJECTOR");
            eq3.setRoomCode("PM01");
            eq3.setSerialNumber("SN-EPSON-X06");
            eq3.setManufacturer("Epson");
            eq3.setModel("EB-X06");
            eq3.setPurchaseDate(LocalDate.of(2025, 8, 15));
            eq3.setWarrantyExpiry(LocalDate.of(2027, 8, 15));
            eq3.setStatus("HOAT_DONG");
            equipmentRepository.save(eq3);
        }

        // 5. Khởi tạo Kho linh kiện thay thế
        if (sparePartRepository.count() == 0) {
            sparePartRepository.save(new SparePart(null, "RAM-DDR4-8G", "RAM Kingston Fury 8GB DDR4 3200MHz", "Thanh", 15, 5, new BigDecimal("450000"), "Kingston VN", "CON_HANG", LocalDateTime.now()));
            sparePartRepository.save(new SparePart(null, "SSD-256G", "SSD Kingston A400 256GB SATA3", "Ổ", 10, 3, new BigDecimal("550000"), "Kingston VN", "CON_HANG", LocalDateTime.now()));
            sparePartRepository.save(new SparePart(null, "PSU-500W", "Nguồn máy tính Cooler Master 500W", "Cái", 8, 2, new BigDecimal("680000"), "Cooler Master", "CON_HANG", LocalDateTime.now()));
            sparePartRepository.save(new SparePart(null, "MOUSE-LOGI", "Chuột có dây Logitech B100", "Con", 25, 5, new BigDecimal("95000"), "Logitech", "CON_HANG", LocalDateTime.now()));
            // Linh kiện dưới định mức tồn để demo cảnh báo low-stock
            sparePartRepository.save(new SparePart(null, "KB-DAREU", "Bàn phím DareU LK145 USB", "Cái", 2, 5, new BigDecimal("180000"), "DareU", "SAP_HET", LocalDateTime.now()));
        }

        // 6. Khởi tạo Phiếu sự cố mẫu
        if (incidentRepository.count() == 0) {
            Equipment brokenEq = equipmentRepository.findByEquipmentCode("PC-PM01-02").orElse(null);
            if (brokenEq != null) {
                User student = userRepository.findByEmail("student@school.edu").orElse(null);
                User tech = userRepository.findByEmail("tech@school.edu").orElse(null);
                IncidentReport inc = new IncidentReport();
                inc.setEquipmentId(brokenEq.getId());
                inc.setEquipment(brokenEq);
                if (student != null) {
                    inc.setReportedByUserId(student.getId());
                    inc.setReportedByUser(student);
                }
                if (tech != null) {
                    inc.setAssignedTechnicianId(tech.getId());
                    inc.setAssignedTechnician(tech);
                }
                inc.setDescription("Máy tính 02 phòng máy 1 bật không lên nguồn, quạt nguồn không quay.");
                inc.setPriority("CAO");
                inc.setStatus("DA_TIEP_NHAN");
                inc.setCostEstimate(new BigDecimal("700000"));
                inc.setActualCost(BigDecimal.ZERO);
                inc.setCreatedAt(LocalDateTime.now().minusHours(3));
                incidentRepository.save(inc);
            }
        }

        System.out.println("========== [DataInitializer] HOÀN TẤT KHỞI TẠO DỮ LIỆU MẪU THÀNH CÔNG! ==========");
    }
}
