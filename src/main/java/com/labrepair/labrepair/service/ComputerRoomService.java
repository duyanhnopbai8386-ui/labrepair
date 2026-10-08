package com.labrepair.labrepair.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.model.ComputerRoom;
import com.labrepair.labrepair.repository.ComputerRoomRepository;

@Service
public class ComputerRoomService {
    private final ComputerRoomRepository repository;

    public ComputerRoomService(ComputerRoomRepository repository) {
        this.repository = repository;
    }

    public List<ComputerRoom> findAll() {
        return repository.findAll();
    }

    public ComputerRoom findById(Integer id) {
        return repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy phòng máy có id = " + id));
    }

    public ComputerRoom create(ComputerRoom room) {
        validate(room);
        if (repository.existsByCode(room.getRoomCode())) {
            throw new DuplicateResourceException("Mã phòng '" + room.getRoomCode() + "' đã tồn tại");
        }
        room.setId(null);
        return repository.save(room);
    }

    public ComputerRoom update(Integer id, ComputerRoom room) {
        findById(id);
        validate(room);
        repository.findByCode(room.getRoomCode()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Mã phòng '" + room.getRoomCode() + "' đã thuộc về phòng khác");
            }
        });
        room.setId(id);
        return repository.update(room);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    private void validate(ComputerRoom room) {
        if (room == null) {
            throw new BadRequestException("Dữ liệu phòng máy không được để trống");
        }
        if (room.getRoomCode() == null || room.getRoomCode().isBlank()) {
            throw new BadRequestException("Mã phòng không được để trống");
        }
        if (room.getRoomName() == null || room.getRoomName().isBlank()) {
            throw new BadRequestException("Tên phòng không được để trống");
        }
        if (room.getCapacity() == null || room.getCapacity() <= 0) {
            throw new BadRequestException("Sức chứa phòng phải lớn hơn 0");
        }
    }
}
