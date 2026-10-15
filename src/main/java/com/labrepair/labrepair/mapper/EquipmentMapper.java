package com.labrepair.labrepair.mapper;

import com.labrepair.labrepair.dto.EquipmentRequest;
import com.labrepair.labrepair.dto.EquipmentResponse;
import com.labrepair.labrepair.model.Equipment;
import org.springframework.stereotype.Component;

@Component
public class EquipmentMapper {
    public Equipment toEntity(EquipmentRequest request) {
        if (request == null) return null;
        Equipment eq = new Equipment();
        eq.setEquipmentCode(request.getEquipmentCode());
        eq.setName(request.getName());
        eq.setType(request.getType());
        eq.setRoomCode(request.getRoomCode());
        eq.setSerialNumber(request.getSerialNumber());
        eq.setManufacturer(request.getManufacturer());
        eq.setModel(request.getModel());
        eq.setPurchaseDate(request.getPurchaseDate());
        eq.setWarrantyExpiry(request.getWarrantyExpiry());
        eq.setStatus(request.getStatus() != null ? request.getStatus() : "HOAT_DONG");
        eq.setConditionNote(request.getConditionNote());
        return eq;
    }

    public EquipmentResponse toResponse(Equipment entity) {
        if (entity == null) return null;
        EquipmentResponse res = new EquipmentResponse();
        res.setId(entity.getId());
        res.setEquipmentCode(entity.getEquipmentCode());
        res.setName(entity.getName());
        res.setType(entity.getType());
        if (entity.getCategory() != null) {
            res.setCategoryId(entity.getCategory().getId());
            res.setCategoryName(entity.getCategory().getCategoryName());
        }
        res.setRoomCode(entity.getRoomCode());
        if (entity.getRoom() != null) {
            res.setRoomId(entity.getRoom().getId());
            res.setRoomName(entity.getRoom().getRoomName());
        }
        res.setSerialNumber(entity.getSerialNumber());
        res.setManufacturer(entity.getManufacturer());
        res.setModel(entity.getModel());
        res.setPurchaseDate(entity.getPurchaseDate());
        res.setWarrantyExpiry(entity.getWarrantyExpiry());
        res.setStatus(entity.getStatus());
        res.setConditionNote(entity.getConditionNote());
        res.setLastMaintenance(entity.getLastMaintenance());
        res.setCreatedAt(entity.getCreatedAt());
        return res;
    }
}
