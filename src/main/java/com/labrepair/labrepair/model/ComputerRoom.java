package com.labrepair.labrepair.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "computer_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ComputerRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "room_code", nullable = false, unique = true, length = 50)
    private String roomCode;

    @Column(name = "room_name", nullable = false, length = 100)
    private String roomName;

    @Column(length = 50)
    private String building;

    private Integer floor;

    @Column(length = 200)
    private String location;

    private Integer capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public ComputerRoom(Integer id, String roomCode, String roomName, String location, Integer capacity) {
        this.id = id;
        this.roomCode = roomCode;
        this.roomName = roomName;
        this.location = location;
        this.capacity = capacity;
        this.isActive = true;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
    }
}
