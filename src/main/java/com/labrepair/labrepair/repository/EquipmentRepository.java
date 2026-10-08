package com.labrepair.labrepair.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.labrepair.labrepair.model.Equipment;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Integer> {
    Optional<Equipment> findByEquipmentCode(String equipmentCode);
    boolean existsByEquipmentCode(String equipmentCode);
}