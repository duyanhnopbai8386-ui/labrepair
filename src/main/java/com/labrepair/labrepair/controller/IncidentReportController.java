package com.labrepair.labrepair.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labrepair.labrepair.dto.IncidentRequest;
import com.labrepair.labrepair.dto.IncidentResponse;
import com.labrepair.labrepair.service.IncidentReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/incidents")
public class IncidentReportController {

    private final IncidentReportService service;

    public IncidentReportController(IncidentReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<IncidentResponse> findAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer equipmentId) {
        if (status != null && !status.isBlank()) {
            return service.findByStatus(status);
        }
        if (equipmentId != null) {
            return service.findByEquipmentId(equipmentId);
        }
        return service.findAll();
    }

    @GetMapping("/{id}")
    public IncidentResponse findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> create(@Valid @RequestBody IncidentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public IncidentResponse update(@PathVariable Integer id, @Valid @RequestBody IncidentRequest request) {
        return service.update(id, request);
    }

    @PutMapping("/{id}/assign")
    public IncidentResponse assignTechnician(
            @PathVariable Integer id,
            @RequestParam Integer technicianId) {
        return service.assignTechnician(id, technicianId);
    }

    @PutMapping("/{id}/status")
    public IncidentResponse updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
