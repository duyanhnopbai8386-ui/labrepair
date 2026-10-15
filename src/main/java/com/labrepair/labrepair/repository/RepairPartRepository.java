package com.labrepair.labrepair.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labrepair.labrepair.model.RepairPart;

@Repository
public interface RepairPartRepository extends JpaRepository<RepairPart, Integer> {
    List<RepairPart> findByRepairHistoryId(Integer repairHistoryId);
    List<RepairPart> findBySparePartId(Integer sparePartId);
}
