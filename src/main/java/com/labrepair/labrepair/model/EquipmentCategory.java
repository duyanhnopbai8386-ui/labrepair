package com.labrepair.labrepair.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "equipment_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EquipmentCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "category_code", nullable = false, unique = true, length = 50)
    private String categoryCode;

    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @Column(length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_category_id")
    private EquipmentCategory parentCategory;

    public EquipmentCategory(Integer id, String categoryCode, String categoryName, String description) {
        this.id = id;
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
        this.description = description;
    }
}
