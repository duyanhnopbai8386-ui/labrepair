package com.labrepair.labrepair.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {
    private Integer equipmentId;
    private String equipmentCode;

    private Integer reportedByUserId;
    private String reporterName;
    private String reporterEmail;

    private Integer assignedTechnicianId;

    @NotBlank(message = "Mô tả sự cố không được để trống")
    private String description;

    private String priority = "TRUNG_BINH";
    private String status = "MOI_TAO";

    private String resolutionNote;
    private BigDecimal costEstimate = BigDecimal.ZERO;
    private BigDecimal actualCost = BigDecimal.ZERO;
}
