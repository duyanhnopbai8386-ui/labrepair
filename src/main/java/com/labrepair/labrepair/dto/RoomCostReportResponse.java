package com.labrepair.labrepair.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomCostReportResponse {
    private String roomCode;
    private String roomName;
    private long equipmentCount;
    private long incidentCount;
    private BigDecimal totalRepairCost;
}
