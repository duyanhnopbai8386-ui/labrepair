package com.labrepair.labrepair.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labrepair.labrepair.dto.RepairHistoryRequest;
import com.labrepair.labrepair.dto.RepairHistoryResponse;
import com.labrepair.labrepair.service.RepairHistoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/repair-histories")
public class RepairHistoryController {

    private final RepairHistoryService service;

    public RepairHistoryController(RepairHistoryService service) {
        this.service = service;
    }

    @GetMapping("/incident/{incidentId}")
    public List<RepairHistoryResponse> findByIncidentId(@PathVariable Integer incidentId) {
        return service.findByIncidentId(incidentId);
    }

    @PostMapping
    public ResponseEntity<RepairHistoryResponse> recordHistory(@Valid @RequestBody RepairHistoryRequest request) {
        RepairHistoryResponse created = service.recordHistory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
