package com.labrepair.labrepair.controller;

import java.util.List;

import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labrepair.labrepair.dto.EquipmentRequest;
import com.labrepair.labrepair.dto.EquipmentResponse;
import com.labrepair.labrepair.service.EquipmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<EquipmentResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public EntityModel<EquipmentResponse> findById(@PathVariable Integer id) {
        EquipmentResponse equipment = service.findById(id);

        return EntityModel.of(
                equipment,
                linkTo(methodOn(EquipmentController.class).findById(id)).withSelfRel(),
                linkTo(methodOn(EquipmentController.class).findAll()).withRel("all-equipment")
        );
    }

    @PostMapping
    public ResponseEntity<EquipmentResponse> create(@Valid @RequestBody EquipmentRequest request) {
        EquipmentResponse created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public EquipmentResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody EquipmentRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}