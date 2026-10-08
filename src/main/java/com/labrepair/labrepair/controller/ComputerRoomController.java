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

import com.labrepair.labrepair.model.ComputerRoom;
import com.labrepair.labrepair.service.ComputerRoomService;

@RestController
@RequestMapping("/api/rooms")
public class ComputerRoomController {
    private final ComputerRoomService service;

    public ComputerRoomController(ComputerRoomService service) {
        this.service = service;
    }

    @GetMapping
    public List<ComputerRoom> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ComputerRoom findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<ComputerRoom> create(@RequestBody ComputerRoom room) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(room));
    }

    @PutMapping("/{id}")
    public ComputerRoom update(@PathVariable Integer id, @RequestBody ComputerRoom room) {
        return service.update(id, room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
