package com.labrepair.labrepair.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.labrepair.labrepair.model.IncidentReport;

@Repository
public interface IncidentReportRepository extends JpaRepository<IncidentReport, Integer> {
    Optional<IncidentReport> findFirstByEquipmentIdAndStatusNot(Integer equipmentId, String status);
    List<IncidentReport> findByEquipmentIdOrderByCreatedAtDesc(Integer equipmentId);
    List<IncidentReport> findByStatus(String status);
    List<IncidentReport> findByAssignedTechnicianId(Integer technicianId);

    long countByStatus(String status);
    long countByStatusNot(String status);

    @Query("SELECT COALESCE(SUM(i.actualCost), 0) FROM IncidentReport i")
    BigDecimal sumTotalActualCost();

    @Query("SELECT i.equipment.roomCode, COUNT(i), COALESCE(SUM(i.actualCost), 0) " +
           "FROM IncidentReport i " +
           "GROUP BY i.equipment.roomCode")
    List<Object[]> countAndCostByRoomCode();

    @Query("SELECT i.equipment.id, COUNT(i), COALESCE(SUM(i.actualCost), 0) " +
           "FROM IncidentReport i " +
           "GROUP BY i.equipment.id " +
           "ORDER BY COUNT(i) DESC")
    List<Object[]> findTopFailureEquipments();
}
