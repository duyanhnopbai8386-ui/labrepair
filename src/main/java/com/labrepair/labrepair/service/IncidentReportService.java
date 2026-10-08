package com.labrepair.labrepair.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.model.IncidentReport;
import com.labrepair.labrepair.model.User;
import com.labrepair.labrepair.repository.EquipmentRepository;
import com.labrepair.labrepair.repository.IncidentReportRepository;
import com.labrepair.labrepair.repository.UserRepository;

@Service
public class IncidentReportService {
    private static final Set<String> PRIORITIES = Set.of("THAP", "TRUNG_BINH", "CAO", "KHAN_CAP");
    private static final Set<String> STATUSES = Set.of("MOI_TAO", "DA_TIEP_NHAN", "DANG_SUA", "HOAN_THANH");

    private final IncidentReportRepository repository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    public IncidentReportService(
            IncidentReportRepository repository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository) {
        this.repository = repository;
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
    }

    public List<IncidentReport> findAll() {
        return repository.findAll();
    }

    public IncidentReport findById(Integer id) {
        return repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy phiếu báo hỏng có id = " + id));
    }

    @Transactional
    public IncidentReport create(IncidentReport incident) {
        validateReferencesAndContent(incident);
        if (repository.findFirstByEquipmentIdAndStatusNot(incident.getEquipmentId(), "HOAN_THANH").isPresent()) {
            throw new DuplicateResourceException(
                    "Thiết bị (id=" + incident.getEquipmentId() + ") hiện đang có phiếu báo hỏng chưa hoàn thành");
        }

        incident.setId(null);
        incident.setAssignedTechnicianId(null);
        incident.setStatus("MOI_TAO");
        incident.setCreatedAt(LocalDateTime.now());
        return repository.save(incident);
    }

    @Transactional
    public IncidentReport update(Integer id, IncidentReport incident) {
        IncidentReport current = findById(id);
        validateReferencesAndContent(incident);
        validateStatus(incident.getStatus());
        validateTechnician(incident.getAssignedTechnicianId());
        incident.setStatus(incident.getStatus().toUpperCase());

        incident.setId(id);
        if (incident.getCreatedAt() == null) {
            incident.setCreatedAt(current.getCreatedAt());
        }
        return repository.save(incident);
    }

    @Transactional
    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    private void validateReferencesAndContent(IncidentReport incident) {
        if (incident == null) {
            throw new BadRequestException("Dữ liệu phiếu báo hỏng không được để trống");
        }
        if (incident.getEquipmentId() == null || !equipmentRepository.existsById(incident.getEquipmentId())) {
            throw new BadRequestException("Thiết bị có id = " + incident.getEquipmentId() + " không tồn tại");
        }
        if (incident.getReportedByUserId() == null || !userRepository.existsById(incident.getReportedByUserId())) {
            throw new BadRequestException("Người báo hỏng có id = " + incident.getReportedByUserId() + " không tồn tại");
        }
        if (incident.getDescription() == null || incident.getDescription().isBlank()) {
            throw new BadRequestException("Mô tả sự cố không được để trống");
        }
        String priority = incident.getPriority() == null ? "TRUNG_BINH" : incident.getPriority().toUpperCase();
        if (!PRIORITIES.contains(priority)) {
            throw new BadRequestException("Mức ưu tiên phải là THAP, TRUNG_BINH, CAO hoặc KHAN_CAP");
        }
        incident.setPriority(priority);
    }

    private void validateStatus(String status) {
        if (status == null || !STATUSES.contains(status.toUpperCase())) {
            throw new BadRequestException("Trạng thái phiếu không hợp lệ (phải là MOI_TAO, DA_TIEP_NHAN, DANG_SUA, HOAN_THANH)");
        }
    }

    private void validateTechnician(Integer technicianId) {
        if (technicianId == null) {
            return;
        }
        User technician = userRepository.findById(technicianId).orElseThrow(() ->
                new BadRequestException("Kỹ thuật viên có id = " + technicianId + " không tồn tại"));
        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole()) && !"ADMIN".equalsIgnoreCase(technician.getRole())) {
            throw new BadRequestException("Người được phân công phải có vai trò TECHNICIAN hoặc ADMIN");
        }
    }
}
