package com.labrepair.labrepair.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incident_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class IncidentReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "equipment_id", nullable = false)
    private Integer equipmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", insertable = false, updatable = false)
    private Equipment equipment;

    @Column(name = "reported_by_user_id", nullable = false)
    private Integer reportedByUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_user_id", insertable = false, updatable = false)
    private User reportedByUser;

    @Column(name = "assigned_technician_id")
    private Integer assignedTechnicianId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_technician_id", insertable = false, updatable = false)
    private User assignedTechnician;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(length = 20)
    private String priority = "TRUNG_BINH"; // THAP, TRUNG_BINH, CAO, KHAN_CAP

    @Column(length = 50)
    private String status = "MOI_TAO"; // MOI_TAO, DA_TIEP_NHAN, DANG_SUA, HOAN_THANH, HUY

    @Column(name = "resolution_note", columnDefinition = "TEXT")
    private String resolutionNote;

    @Column(name = "cost_estimate", precision = 12, scale = 2)
    private BigDecimal costEstimate = BigDecimal.ZERO;

    @Column(name = "actual_cost", precision = 12, scale = 2)
    private BigDecimal actualCost = BigDecimal.ZERO;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RepairHistory> repairHistories = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "MOI_TAO";
        }
        if (this.priority == null || this.priority.isBlank()) {
            this.priority = "TRUNG_BINH";
        }
    }
}
