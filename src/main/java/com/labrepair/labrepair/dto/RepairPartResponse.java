package com.labrepair.labrepair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairPartResponse {
    private Integer id;
    private Integer sparePartId;
    private String partCode;
    private String partName;
    private String unit;
    private Integer quantityUsed;
    private BigDecimal unitPrice;
    private BigDecimal totalCost;
    private String note;
}
