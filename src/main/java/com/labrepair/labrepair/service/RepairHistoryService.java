package com.labrepair.labrepair.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.dto.RepairHistoryRequest;
import com.labrepair.labrepair.dto.RepairHistoryResponse;
import com.labrepair.labrepair.dto.RepairPartItemRequest;
import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.mapper.RepairHistoryMapper;
import com.labrepair.labrepair.model.*;
import com.labrepair.labrepair.repository.*;

@Service
public class RepairHistoryService {
    private final RepairHistoryRepository historyRepository;
    private final IncidentReportRepository incidentRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final SparePartRepository sparePartRepository;
    private final RepairPartRepository repairPartRepository;
    private final SparePartService sparePartService;
    private final RepairHistoryMapper mapper;

    public RepairHistoryService(
            RepairHistoryRepository historyRepository,
            IncidentReportRepository incidentRepository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository,
            SparePartRepository sparePartRepository,
            RepairPartRepository repairPartRepository,
            SparePartService sparePartService,
            RepairHistoryMapper mapper) {
        this.historyRepository = historyRepository;
        this.incidentRepository = incidentRepository;
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
        this.sparePartRepository = sparePartRepository;
        this.repairPartRepository = repairPartRepository;
        this.sparePartService = sparePartService;
        this.mapper = mapper;
    }

    public List<RepairHistoryResponse> findByIncidentId(Integer incidentId) {
        return historyRepository.findByIncidentIdOrderByPerformedAtDesc(incidentId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public RepairHistoryResponse recordHistory(RepairHistoryRequest request) {
        if (request == null) {
            throw new BadRequestException("Dữ liệu lịch sử sửa chữa không được để trống");
        }

        IncidentReport incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu báo hỏng id = " + request.getIncidentId()));

        User technician = null;
        if (request.getTechnicianId() != null) {
            technician = userRepository.findById(request.getTechnicianId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kỹ thuật viên id = " + request.getTechnicianId()));
            if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole()) && !"ADMIN".equalsIgnoreCase(technician.getRole())) {
                throw new BadRequestException("Người thực hiện phải có vai trò TECHNICIAN hoặc ADMIN");
            }
        }

        RepairHistory history = new RepairHistory();
        history.setIncident(incident);
        history.setTechnician(technician);
        history.setActionType(request.getActionType().toUpperCase());
        history.setNote(request.getNote());
        history.setDurationMinutes(request.getDurationMinutes());
        history.setPerformedAt(LocalDateTime.now());
        history = historyRepository.save(history);

        BigDecimal additionalCost = BigDecimal.ZERO;
        List<RepairPart> partsList = new ArrayList<>();

        if (request.getPartsUsed() != null && !request.getPartsUsed().isEmpty()) {
            for (RepairPartItemRequest item : request.getPartsUsed()) {
                SparePart part = sparePartService.getEntityById(item.getSparePartId());
                sparePartService.deductStock(part.getId(), item.getQuantityUsed());

                BigDecimal unitPrice = part.getUnitPrice() != null ? part.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal itemCost = unitPrice.multiply(BigDecimal.valueOf(item.getQuantityUsed()));
                additionalCost = additionalCost.add(itemCost);

                RepairPart rp = new RepairPart();
                rp.setRepairHistory(history);
                rp.setSparePart(part);
                rp.setQuantityUsed(item.getQuantityUsed());
                rp.setTotalCost(itemCost);
                rp.setNote(item.getNote());
                partsList.add(repairPartRepository.save(rp));
            }
        }
        history.setRepairParts(partsList);

        BigDecimal currentActualCost = incident.getActualCost() != null ? incident.getActualCost() : BigDecimal.ZERO;
        incident.setActualCost(currentActualCost.add(additionalCost));

        if ("HOAN_THANH".equalsIgnoreCase(request.getActionType())) {
            incident.setStatus("HOAN_THANH");
            incident.setResolvedAt(LocalDateTime.now());
            if (request.getNote() != null && !request.getNote().isBlank()) {
                incident.setResolutionNote(request.getNote());
            }

            Equipment eq = incident.getEquipment();
            if (eq != null) {
                eq.setStatus("HOAT_DONG");
                equipmentRepository.save(eq);
            }
        } else if ("SUA_CHUA".equalsIgnoreCase(request.getActionType()) || "THAY_THE".equalsIgnoreCase(request.getActionType())) {
            if (!"HOAN_THANH".equalsIgnoreCase(incident.getStatus())) {
                incident.setStatus("DANG_SUA");
            }
        } else if ("KHAO_SAT".equalsIgnoreCase(request.getActionType())) {
            if ("MOI_TAO".equalsIgnoreCase(incident.getStatus())) {
                incident.setStatus("DA_TIEP_NHAN");
            }
        }

        incidentRepository.save(incident);
        return mapper.toResponse(history);
    }
}
