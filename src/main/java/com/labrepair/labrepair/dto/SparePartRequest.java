package com.labrepair.labrepair.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SparePartRequest {
    @NotBlank(message = "Mã linh kiện không được để trống")
    private String partCode;

    @NotBlank(message = "Tên linh kiện không được để trống")
    private String partName;

    private String unit = "Cái";

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private Integer stockQuantity;

    private Integer minStockLevel = 5;

    @NotNull(message = "Đơn giá không được để trống")
    private BigDecimal unitPrice;

    private String supplier;
}
