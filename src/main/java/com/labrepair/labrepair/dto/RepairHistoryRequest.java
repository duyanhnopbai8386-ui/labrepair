package com.labrepair.labrepair.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairHistoryRequest {
    @NotNull(message = "ID phiếu báo hỏng không được để trống")
    private Integer incidentId;

    private Integer technicianId;

    @NotBlank(message = "Loại hành động không được để trống (KHAO_SAT, SUA_CHUA, THAY_THE, HOAN_THANH)")
    private String actionType;

    private String note;
    private Integer durationMinutes;
    private Boolean markCompleted;

    private List<RepairPartItemRequest> partsUsed = new ArrayList<>();
}
