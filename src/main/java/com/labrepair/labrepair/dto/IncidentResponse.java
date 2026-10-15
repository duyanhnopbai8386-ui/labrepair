package com.labrepair.labrepair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private Integer id;
    private Integer equipmentId;
    private String equipmentCode;
    private String equipmentName;
    private String roomCode;
    private Integer reportedByUserId;
    private String reportedByUserName;
    private Integer assignedTechnicianId;
    private String assignedTechnicianName;
    private String description;
    private String priority;
    private String status;
    private String resolutionNote;
    private BigDecimal costEstimate;
    private BigDecimal actualCost;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private List<RepairHistoryResponse> repairHistories = new ArrayList<>();
}
