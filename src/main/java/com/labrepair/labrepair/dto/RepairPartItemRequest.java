package com.labrepair.labrepair.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairPartItemRequest {
    @NotNull(message = "ID linh kiện không được để trống")
    private Integer sparePartId;

    @NotNull(message = "Số lượng sử dụng không được để trống")
    @Min(value = 1, message = "Số lượng linh kiện tối thiểu là 1")
    private Integer quantityUsed = 1;

    private String note;
}
