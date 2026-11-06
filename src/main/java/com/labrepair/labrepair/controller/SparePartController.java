package com.labrepair.labrepair.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labrepair.labrepair.dto.SparePartRequest;
import com.labrepair.labrepair.dto.SparePartResponse;
import com.labrepair.labrepair.service.SparePartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/spare-parts")
public class SparePartController {

    private final SparePartService service;

    public SparePartController(SparePartService service) {
        this.service = service;
    }

    @GetMapping
    public List<SparePartResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SparePartResponse findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/low-stock")
    public List<SparePartResponse> findLowStock() {
        return service.findLowStock();
    }

    @PostMapping
    public ResponseEntity<SparePartResponse> create(@Valid @RequestBody SparePartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public SparePartResponse update(@PathVariable Integer id, @Valid @RequestBody SparePartRequest request) {
        return service.update(id, request);
    }

    @PostMapping("/{id}/deduct")
    public ResponseEntity<SparePartResponse> deductStock(@PathVariable Integer id, @RequestParam(defaultValue = "1") Integer quantity) {
        service.deductStock(id, quantity);
        return ResponseEntity.ok(service.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
