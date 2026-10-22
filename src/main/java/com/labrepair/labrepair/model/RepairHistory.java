package com.labrepair.labrepair.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "repair_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @JsonIgnore
    private IncidentReport incident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id")
    private User technician;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; // hành động khảo sát  sửa chữa , thay thế, 

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "duration_minutes")
    private Integer durationMinutes; // thời gian làm

    @Column(name = "performed_at")
    private LocalDateTime performedAt;

    @OneToMany(mappedBy = "repairHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RepairPart> repairParts = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.performedAt == null) {
            this.performedAt = LocalDateTime.now();
        }
    }
}
