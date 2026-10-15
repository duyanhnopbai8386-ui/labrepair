package com.labrepair.labrepair.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labrepair.labrepair.model.RepairHistory;

@Repository
public interface RepairHistoryRepository extends JpaRepository<RepairHistory, Integer> {
    List<RepairHistory> findByIncidentIdOrderByPerformedAtDesc(Integer incidentId);
    List<RepairHistory> findByTechnicianId(Integer technicianId);
}
