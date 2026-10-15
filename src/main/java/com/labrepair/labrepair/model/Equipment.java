package com.labrepair.labrepair.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "equipment_code", nullable = false, unique = true, length = 50)
    private String equipmentCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String type; // COMPUTER, MONITOR, PROJECTOR, etc.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private EquipmentCategory category;

    @Column(name = "room_code", nullable = false, length = 50)
    private String roomCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private ComputerRoom room;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(length = 100)
    private String manufacturer;

    @Column(length = 100)
    private String model;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Column(length = 50)
    private String status = "HOAT_DONG"; // HOAT_DONG, HONG, DANG_SUA, THANH_LY

    @Column(name = "condition_note", columnDefinition = "TEXT")
    private String conditionNote;

    @Column(name = "last_maintenance")
    private LocalDate lastMaintenance;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "HOAT_DONG";
        }
    }
}
