package com.labrepair.labrepair.mapper;

import com.labrepair.labrepair.dto.RepairHistoryResponse;
import com.labrepair.labrepair.dto.RepairPartResponse;
import com.labrepair.labrepair.model.RepairHistory;
import com.labrepair.labrepair.model.RepairPart;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RepairHistoryMapper {
    public RepairPartResponse toPartResponse(RepairPart part) {
        if (part == null) return null;
        RepairPartResponse res = new RepairPartResponse();
        res.setId(part.getId());
        if (part.getSparePart() != null) {
            res.setSparePartId(part.getSparePart().getId());
            res.setPartCode(part.getSparePart().getPartCode());
            res.setPartName(part.getSparePart().getPartName());
            res.setUnit(part.getSparePart().getUnit());
            res.setUnitPrice(part.getSparePart().getUnitPrice());
        }
        res.setQuantityUsed(part.getQuantityUsed());
        res.setTotalCost(part.getTotalCost());
        res.setNote(part.getNote());
        return res;
    }

    public RepairHistoryResponse toResponse(RepairHistory entity) {
        if (entity == null) return null;
        RepairHistoryResponse res = new RepairHistoryResponse();
        res.setId(entity.getId());
        if (entity.getIncident() != null) {
            res.setIncidentId(entity.getIncident().getId());
        }
        if (entity.getTechnician() != null) {
            res.setTechnicianId(entity.getTechnician().getId());
            res.setTechnicianName(entity.getTechnician().getFullName());
        }
        res.setActionType(entity.getActionType());
        res.setNote(entity.getNote());
        res.setDurationMinutes(entity.getDurationMinutes());
        res.setPerformedAt(entity.getPerformedAt());

        List<RepairPartResponse> parts = new ArrayList<>();
        if (entity.getRepairParts() != null) {
            for (RepairPart p : entity.getRepairParts()) {
                parts.add(toPartResponse(p));
            }
        }
        res.setRepairParts(parts);
        return res;
    }
}
