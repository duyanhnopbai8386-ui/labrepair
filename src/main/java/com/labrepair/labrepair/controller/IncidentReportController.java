package com.labrepair.labrepair.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labrepair.labrepair.model.IncidentReport;
import com.labrepair.labrepair.service.IncidentReportService;

@RestController
@RequestMapping("/api/incidents")
public class IncidentReportController {
    private final IncidentReportService service;

    public IncidentReportController(IncidentReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<IncidentReport> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public IncidentReport findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<IncidentReport> create(@RequestBody IncidentReport incident) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(incident));
    }

    @PutMapping("/{id}")
    public IncidentReport update(@PathVariable Integer id, @RequestBody IncidentReport incident) {
        return service.update(id, incident);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
