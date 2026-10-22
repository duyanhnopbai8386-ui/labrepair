package com.labrepair.labrepair.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "spare_parts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SparePart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "part_code", nullable = false, unique = true, length = 50)
    private String partCode;

    @Column(name = "part_name", nullable = false, length = 100)
    private String partName;

    @Column(length = 20)
    private String unit; // Cái, Bộ, Thanh, Cuộn

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "min_stock_level")
    private Integer minStockLevel = 5; // cảnh báo hết hàng

    @Column(name = "unit_price", precision = 12, scale = 2)
    private BigDecimal unitPrice; // đơn giá 

    @Column(length = 100)
    private String supplier;

    @Column(length = 50)
    private String status = "CON_HANG"; // CON_HANG, SAP_HET, HET_HANG

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void updateStatus() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.stockQuantity == null || this.stockQuantity <= 0) {
            this.status = "HET_HANG";
        } else if (this.minStockLevel != null && this.stockQuantity <= this.minStockLevel) {
            this.status = "SAP_HET";
        } else {
            this.status = "CON_HANG";
        }
    }
}
