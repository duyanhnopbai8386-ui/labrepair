package com.labrepair.labrepair.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentFailureReportResponse {
    private Integer equipmentId;
    private String equipmentCode;
    private String equipmentName;
    private String roomCode;
    private String manufacturer;
    private String model;
    private long failureCount;
    private BigDecimal totalRepairCost;
    private String currentStatus;
}
