package com.labrepair.labrepair.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.dto.IncidentRequest;
import com.labrepair.labrepair.dto.IncidentResponse;
import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.mapper.IncidentReportMapper;
import com.labrepair.labrepair.model.Equipment;
import com.labrepair.labrepair.model.IncidentReport;
import com.labrepair.labrepair.model.User;
import com.labrepair.labrepair.repository.EquipmentRepository;
import com.labrepair.labrepair.repository.IncidentReportRepository;
import com.labrepair.labrepair.repository.UserRepository;

@Service
public class IncidentReportService {
    private static final Set<String> PRIORITIES = Set.of("THAP", "TRUNG_BINH", "CAO", "KHAN_CAP");
    private static final Set<String> STATUSES = Set.of("MOI_TAO", "DA_TIEP_NHAN", "DANG_SUA", "HOAN_THANH", "HUY");

    private final IncidentReportRepository repository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final IncidentReportMapper mapper;

    public IncidentReportService(
            IncidentReportRepository repository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository,
            IncidentReportMapper mapper) {
        this.repository = repository;
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> findAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public IncidentResponse findById(Integer id) {
        return mapper.toResponse(getEntityById(id));
    }

    public IncidentReport getEntityById(Integer id) {
        return repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy phiếu báo hỏng có id = " + id));
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> findByStatus(String status) {
        return repository.findByStatus(status.toUpperCase()).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> findByEquipmentId(Integer equipmentId) {
        return repository.findByEquipmentIdOrderByCreatedAtDesc(equipmentId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public IncidentResponse create(IncidentRequest request) {
        if (request == null) {
            throw new BadRequestException("Dữ liệu phiếu báo hỏng không được để trống");
        }

        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thiết bị có id = " + request.getEquipmentId()));

        User reportedBy = userRepository.findById(request.getReportedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người báo sự cố có id = " + request.getReportedByUserId()));

        if (repository.findFirstByEquipmentIdAndStatusNot(request.getEquipmentId(), "HOAN_THANH").isPresent()) {
            throw new DuplicateResourceException(
                    "Thiết bị '" + equipment.getName() + "' (mã: " + equipment.getEquipmentCode()
                            + ") hiện đang có phiếu báo hỏng đang xử lý");
        }

        IncidentReport incident = mapper.toEntity(request);
        incident.setStatus("MOI_TAO");
        incident.setCreatedAt(LocalDateTime.now());
        incident.setEquipment(equipment);
        incident.setReportedByUser(reportedBy);

        // Cập nhật trạng thái thiết bị sang CHO_SUA
        equipment.setStatus("CHO_SUA");
        equipmentRepository.save(equipment);

        IncidentReport saved = repository.save(incident);
        return mapper.toResponse(saved);
    }

    @Transactional
    public IncidentResponse update(Integer id, IncidentRequest request) {
        IncidentReport incident = getEntityById(id);

        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            incident.setDescription(request.getDescription());
        }

        if (request.getPriority() != null) {
            String prio = request.getPriority().toUpperCase();
            if (!PRIORITIES.contains(prio)) {
                throw new BadRequestException("Mức ưu tiên không hợp lệ (phải là THAP, TRUNG_BINH, CAO, KHAN_CAP)");
            }
            incident.setPriority(prio);
        }

        if (request.getStatus() != null) {
            validateStatus(request.getStatus());
            incident.setStatus(request.getStatus().toUpperCase());
        }

        if (request.getAssignedTechnicianId() != null) {
            User tech = validateAndGetTechnician(request.getAssignedTechnicianId());
            incident.setAssignedTechnicianId(tech.getId());
            incident.setAssignedTechnician(tech);
        }

        if (request.getResolutionNote() != null) {
            incident.setResolutionNote(request.getResolutionNote());
        }

        if (request.getCostEstimate() != null) {
            incident.setCostEstimate(request.getCostEstimate());
        }

        if (request.getActualCost() != null) {
            incident.setActualCost(request.getActualCost());
        }

        return mapper.toResponse(repository.save(incident));
    }

    @Transactional
    public IncidentResponse assignTechnician(Integer incidentId, Integer technicianId) {
        IncidentReport incident = getEntityById(incidentId);
        User technician = validateAndGetTechnician(technicianId);

        incident.setAssignedTechnicianId(technician.getId());
        incident.setAssignedTechnician(technician);

        if ("MOI_TAO".equalsIgnoreCase(incident.getStatus())) {
            incident.setStatus("DA_TIEP_NHAN");
        }

        return mapper.toResponse(repository.save(incident));
    }

    @Transactional
    public IncidentResponse updateStatus(Integer incidentId, String status) {
        IncidentReport incident = getEntityById(incidentId);
        validateStatus(status);
        String upperStatus = status.toUpperCase();
        incident.setStatus(upperStatus);

        if ("HOAN_THANH".equals(upperStatus)) {
            incident.setResolvedAt(LocalDateTime.now());
            Equipment eq = incident.getEquipment();
            if (eq != null) {
                eq.setStatus("HOAT_DONG");
                equipmentRepository.save(eq);
            }
        }

        return mapper.toResponse(repository.save(incident));
    }

    @Transactional
    public void delete(Integer id) {
        getEntityById(id);
        repository.deleteById(id);
    }

    private void validateStatus(String status) {
        if (status == null || !STATUSES.contains(status.toUpperCase())) {
            throw new BadRequestException("Trạng thái phiếu không hợp lệ (phải là MOI_TAO, DA_TIEP_NHAN, DANG_SUA, HOAN_THANH, HUY)");
        }
    }

    private User validateAndGetTechnician(Integer technicianId) {
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kỹ thuật viên id = " + technicianId));
        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole()) && !"ADMIN".equalsIgnoreCase(technician.getRole())) {
            throw new BadRequestException("Người được phân công phải có vai trò TECHNICIAN hoặc ADMIN");
        }
        return technician;
    }
}
