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

import com.labrepair.labrepair.model.EquipmentCategory;
import com.labrepair.labrepair.service.EquipmentCategoryService;

@RestController
@RequestMapping("/api/categories")
public class EquipmentCategoryController {
    private final EquipmentCategoryService service;

    public EquipmentCategoryController(EquipmentCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<EquipmentCategory> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public EquipmentCategory findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<EquipmentCategory> create(@RequestBody EquipmentCategory category) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(category));
    }

    @PutMapping("/{id}")
    public EquipmentCategory update(@PathVariable Integer id, @RequestBody EquipmentCategory category) {
        return service.update(id, category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
