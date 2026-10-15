package com.labrepair.labrepair.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentRequest {
    @NotBlank(message = "Mã thiết bị không được để trống")
    private String equipmentCode;

    @NotBlank(message = "Tên thiết bị không được để trống")
    private String name;

    @NotBlank(message = "Loại thiết bị không được để trống")
    private String type;

    private Integer categoryId;

    @NotBlank(message = "Mã phòng máy không được để trống")
    private String roomCode;

    private Integer roomId;

    private String serialNumber;
    private String manufacturer;
    private String model;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private String status = "HOAT_DONG";
    private String conditionNote;
}
