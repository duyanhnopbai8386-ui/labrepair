package com.labrepair.labrepair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentResponse {
    private Integer id;
    private String equipmentCode;
    private String name;
    private String type;
    private Integer categoryId;
    private String categoryName;
    private String roomCode;
    private Integer roomId;
    private String roomName;
    private String serialNumber;
    private String manufacturer;
    private String model;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private String status;
    private String conditionNote;
    private LocalDate lastMaintenance;
    private LocalDateTime createdAt;
}
