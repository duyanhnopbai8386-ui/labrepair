package com.labrepair.labrepair.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labrepair.labrepair.model.IncidentReport;

@Repository
public interface IncidentReportRepository extends JpaRepository<IncidentReport, Integer> {
    Optional<IncidentReport> findFirstByEquipmentIdAndStatusNot(Integer equipmentId, String status);
    List<IncidentReport> findByEquipmentIdOrderByCreatedAtDesc(Integer equipmentId);
    List<IncidentReport> findByStatus(String status);
    List<IncidentReport> findByAssignedTechnicianId(Integer technicianId);
}
