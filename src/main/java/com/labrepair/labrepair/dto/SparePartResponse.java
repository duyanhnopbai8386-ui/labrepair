package com.labrepair.labrepair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SparePartResponse {
    private Integer id;
    private String partCode;
    private String partName;
    private String unit;
    private Integer stockQuantity;
    private Integer minStockLevel;
    private BigDecimal unitPrice;
    private String supplier;
    private String status;
    private LocalDateTime createdAt;
}
