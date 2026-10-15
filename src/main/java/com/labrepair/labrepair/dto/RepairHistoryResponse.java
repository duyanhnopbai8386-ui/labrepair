package com.labrepair.labrepair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairHistoryResponse {
    private Integer id;
    private Integer incidentId;
    private Integer technicianId;
    private String technicianName;
    private String actionType;
    private String note;
    private Integer durationMinutes;
    private LocalDateTime performedAt;
    private List<RepairPartResponse> repairParts = new ArrayList<>();
}
