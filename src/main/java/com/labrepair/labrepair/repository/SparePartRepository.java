package com.labrepair.labrepair.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labrepair.labrepair.model.SparePart;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Integer> {
    Optional<SparePart> findByPartCode(String partCode);
    boolean existsByPartCode(String partCode);
    List<SparePart> findByStockQuantityLessThanEqual(Integer threshold);
    List<SparePart> findByStatus(String status);
}
