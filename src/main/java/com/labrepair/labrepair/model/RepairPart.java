package com.labrepair.labrepair.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "repair_parts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairPart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_history_id", nullable = false)
    @JsonIgnore
    private RepairHistory repairHistory;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "spare_part_id", nullable = false)
    private SparePart sparePart;

    @Column(name = "quantity_used", nullable = false)
    private Integer quantityUsed = 1;

    @Column(name = "total_cost", precision = 12, scale = 2)
    private BigDecimal totalCost;

    @Column(length = 255)
    private String note;
}
