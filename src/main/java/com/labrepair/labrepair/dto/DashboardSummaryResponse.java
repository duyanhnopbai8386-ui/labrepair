package com.labrepair.labrepair.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalRooms;
    private long totalEquipment;
    private long activeEquipment;
    private long brokenEquipment;
    private long totalIncidents;
    private long pendingIncidents;
    private long completedIncidents;
    private BigDecimal totalRepairCost;
    private long totalSparePartTypes;
    private long lowStockSpareParts;
}
