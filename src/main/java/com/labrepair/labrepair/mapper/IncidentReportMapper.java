package com.labrepair.labrepair.mapper;

import com.labrepair.labrepair.dto.IncidentRequest;
import com.labrepair.labrepair.dto.IncidentResponse;
import com.labrepair.labrepair.model.IncidentReport;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class IncidentReportMapper {
    private final RepairHistoryMapper historyMapper;

    public IncidentReportMapper(RepairHistoryMapper historyMapper) {
        this.historyMapper = historyMapper;
    }

    public IncidentReport toEntity(IncidentRequest request) {
        if (request == null) return null;
        IncidentReport inc = new IncidentReport();
        inc.setEquipmentId(request.getEquipmentId());
        inc.setReportedByUserId(request.getReportedByUserId());
        inc.setAssignedTechnicianId(request.getAssignedTechnicianId());
        inc.setDescription(request.getDescription());
        inc.setPriority(request.getPriority() != null ? request.getPriority() : "TRUNG_BINH");
        inc.setStatus(request.getStatus() != null ? request.getStatus() : "MOI_TAO");
        inc.setResolutionNote(request.getResolutionNote());
        inc.setCostEstimate(request.getCostEstimate());
        inc.setActualCost(request.getActualCost());
        return inc;
    }

    public IncidentResponse toResponse(IncidentReport entity) { // nhận entity từ CSDL
        if (entity == null) return null;
        IncidentResponse res = new IncidentResponse();
        res.setId(entity.getId());
        res.setEquipmentId(entity.getEquipmentId());
        if (entity.getEquipment() != null) {
            res.setEquipmentCode(entity.getEquipment().getEquipmentCode());
            res.setEquipmentName(entity.getEquipment().getName());
            res.setRoomCode(entity.getEquipment().getRoomCode());
        }
        res.setReportedByUserId(entity.getReportedByUserId());
        if (entity.getReportedByUser() != null) {
            res.setReportedByUserName(entity.getReportedByUser().getFullName());
        }
        res.setAssignedTechnicianId(entity.getAssignedTechnicianId());
        if (entity.getAssignedTechnician() != null) {
            res.setAssignedTechnicianName(entity.getAssignedTechnician().getFullName());
        }
        res.setDescription(entity.getDescription());
        res.setPriority(entity.getPriority());
        res.setStatus(entity.getStatus());
        res.setResolutionNote(entity.getResolutionNote());
        res.setCostEstimate(entity.getCostEstimate());
        res.setActualCost(entity.getActualCost());
        res.setCreatedAt(entity.getCreatedAt());
        res.setResolvedAt(entity.getResolvedAt());

        if (entity.getRepairHistories() != null) {
            res.setRepairHistories(entity.getRepairHistories().stream()
                    .map(historyMapper::toResponse)
                    .collect(Collectors.toList()));
        }
        return res;
    }
}
