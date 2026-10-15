package com.labrepair.labrepair.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {
    @NotNull(message = "ID thiết bị không được để trống")
    private Integer equipmentId;

    @NotNull(message = "ID người báo không được để trống")
    private Integer reportedByUserId;

    private Integer assignedTechnicianId;

    @NotBlank(message = "Mô tả sự cố không được để trống")
    private String description;

    private String priority = "TRUNG_BINH";
    private String status = "MOI_TAO";

    private String resolutionNote;
    private BigDecimal costEstimate = BigDecimal.ZERO;
    private BigDecimal actualCost = BigDecimal.ZERO;
}
