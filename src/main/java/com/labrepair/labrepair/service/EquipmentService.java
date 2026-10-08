package com.labrepair.labrepair.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.model.Equipment;
import com.labrepair.labrepair.repository.ComputerRoomRepository;
import com.labrepair.labrepair.repository.EquipmentCategoryRepository;
import com.labrepair.labrepair.repository.EquipmentRepository;

@Service
public class EquipmentService {

    private final EquipmentRepository repository;
    private final ComputerRoomRepository roomRepository;
    private final EquipmentCategoryRepository categoryRepository;

    public EquipmentService(
            EquipmentRepository repository,
            ComputerRoomRepository roomRepository,
            EquipmentCategoryRepository categoryRepository) {
        this.repository = repository;
        this.roomRepository = roomRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Equipment> findAll() {
        return repository.findAll();
    }

    public Equipment findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy thiết bị có id = " + id
                ));
    }

    @Transactional
    public Equipment create(Equipment equipment) {
        validate(equipment);

        if (repository.existsByEquipmentCode(equipment.getEquipmentCode())) {
            throw new DuplicateResourceException(
                    "Mã thiết bị '" + equipment.getEquipmentCode() + "' đã tồn tại"
            );
        }

        equipment.setId(null);

        if (equipment.getStatus() == null || equipment.getStatus().isBlank()) {
            equipment.setStatus("HOAT_DONG");
        }

        return repository.save(equipment);
    }

    @Transactional
    public Equipment update(Integer id, Equipment equipment) {
        findById(id);
        validate(equipment);

        repository.findByEquipmentCode(equipment.getEquipmentCode())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new DuplicateResourceException(
                                "Mã thiết bị '" + equipment.getEquipmentCode() + "' đã thuộc về thiết bị khác"
                        );
                    }
                });

        equipment.setId(id);
        return repository.save(equipment);
    }

    @Transactional
    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    private void validate(Equipment equipment) {
        if (equipment == null) {
            throw new BadRequestException("Dữ liệu thiết bị không được để trống");
        }

        if (equipment.getEquipmentCode() == null || equipment.getEquipmentCode().isBlank()) {
            throw new BadRequestException("Mã thiết bị không được để trống");
        }

        if (equipment.getName() == null || equipment.getName().isBlank()) {
            throw new BadRequestException("Tên thiết bị không được để trống");
        }

        if (equipment.getType() == null || equipment.getType().isBlank()) {
            throw new BadRequestException("Loại thiết bị không được để trống");
        }

        if (categoryRepository.findByCode(equipment.getType()).isEmpty()) {
            throw new BadRequestException(
                    "Loại thiết bị '" + equipment.getType() + "' không tồn tại trong hệ thống"
            );
        }

        if (equipment.getRoomCode() == null || equipment.getRoomCode().isBlank()) {
            throw new BadRequestException("Phòng máy không được để trống");
        }

        if (roomRepository.findByCode(equipment.getRoomCode()).isEmpty()) {
            throw new BadRequestException(
                    "Phòng máy '" + equipment.getRoomCode() + "' không tồn tại trong hệ thống"
            );
        }
    }
}
