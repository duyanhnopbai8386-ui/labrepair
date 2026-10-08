package com.labrepair.labrepair.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "incident_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "equipment_id", nullable = false)
    private Integer equipmentId;

    @Column(name = "reported_by_user_id", nullable = false)
    private Integer reportedByUserId;

    @Column(name = "assigned_technician_id")
    private Integer assignedTechnicianId;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(length = 20)
    private String priority; // THAP, TRUNG_BINH, CAO, KHAN_CAP

    @Column(length = 50)
    private String status; // MOI_TIEP_NHAN, DANG_XU_LY, HOAN_THANH, HUY

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
