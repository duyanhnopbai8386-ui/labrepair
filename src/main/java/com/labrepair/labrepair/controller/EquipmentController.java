package com.labrepair.labrepair.controller;

import java.util.List;

import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
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

import com.labrepair.labrepair.model.Equipment;
import com.labrepair.labrepair.service.EquipmentService;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Equipment> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public EntityModel<Equipment> findById(@PathVariable Integer id) {
        Equipment equipment = service.findById(id);

        return EntityModel.of(
                equipment,
                linkTo(methodOn(EquipmentController.class)
                        .findById(id))
                        .withSelfRel(),
                linkTo(methodOn(EquipmentController.class)
                        .findAll())
                        .withRel("all-equipment")
        );
    }

    @PostMapping
    public ResponseEntity<Equipment> create(
            @RequestBody Equipment equipment) {

        Equipment created = service.create(equipment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @PutMapping("/{id}")
    public Equipment update(
            @PathVariable Integer id,
            @RequestBody Equipment equipment) {

        return service.update(id, equipment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}