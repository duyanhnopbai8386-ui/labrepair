package com.labrepair.labrepair.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.dto.EquipmentRequest;
import com.labrepair.labrepair.dto.EquipmentResponse;
import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.mapper.EquipmentMapper;
import com.labrepair.labrepair.model.ComputerRoom;
import com.labrepair.labrepair.model.Equipment;
import com.labrepair.labrepair.model.EquipmentCategory;
import com.labrepair.labrepair.repository.ComputerRoomRepository;
import com.labrepair.labrepair.repository.EquipmentCategoryRepository;
import com.labrepair.labrepair.repository.EquipmentRepository;

@Service
public class EquipmentService {

    private final EquipmentRepository repository;
    private final ComputerRoomRepository roomRepository;
    private final EquipmentCategoryRepository categoryRepository;
    private final EquipmentMapper mapper;

    public EquipmentService(
            EquipmentRepository repository,
            ComputerRoomRepository roomRepository,
            EquipmentCategoryRepository categoryRepository,
            EquipmentMapper mapper) {
        this.repository = repository;
        this.roomRepository = roomRepository;
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> findAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EquipmentResponse findById(Integer id) {
        return mapper.toResponse(getEntityById(id));
    }

    public Equipment getEntityById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy thiết bị có id = " + id
                ));
    }

    @Transactional
    public EquipmentResponse create(EquipmentRequest request) {
        if (request == null) {
            throw new BadRequestException("Dữ liệu thiết bị không được để trống");
        }

        if (repository.existsByEquipmentCode(request.getEquipmentCode())) {
            throw new DuplicateResourceException(
                    "Mã thiết bị '" + request.getEquipmentCode() + "' đã tồn tại"
            );
        }

        EquipmentCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new BadRequestException("Không tìm thấy danh mục thiết bị id = " + request.getCategoryId()));
        } else if (request.getType() != null && !request.getType().isBlank()) {
            category = categoryRepository.findByCode(request.getType())
                    .orElseThrow(() -> new BadRequestException("Loại thiết bị '" + request.getType() + "' không tồn tại trong hệ thống"));
        }

        ComputerRoom room = null;
        if (request.getRoomId() != null) {
            room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new BadRequestException("Không tìm thấy phòng máy id = " + request.getRoomId()));
        } else if (request.getRoomCode() != null && !request.getRoomCode().isBlank()) {
            room = roomRepository.findByCode(request.getRoomCode())
                    .orElseThrow(() -> new BadRequestException("Phòng máy '" + request.getRoomCode() + "' không tồn tại trong hệ thống"));
        }

        Equipment equipment = mapper.toEntity(request);
        if (category != null) {
            equipment.setCategory(category);
            equipment.setType(category.getCategoryCode());
        }
        if (room != null) {
            equipment.setRoom(room);
            equipment.setRoomCode(room.getRoomCode());
        }

        Equipment saved = repository.save(equipment);
        return mapper.toResponse(saved);
    }

    @Transactional
    public EquipmentResponse update(Integer id, EquipmentRequest request) {
        Equipment existing = getEntityById(id);

        if (request.getEquipmentCode() != null && !request.getEquipmentCode().isBlank()) {
            repository.findByEquipmentCode(request.getEquipmentCode())
                    .ifPresent(other -> {
                        if (!other.getId().equals(id)) {
                            throw new DuplicateResourceException(
                                    "Mã thiết bị '" + request.getEquipmentCode() + "' đã thuộc về thiết bị khác"
                            );
                        }
                    });
            existing.setEquipmentCode(request.getEquipmentCode());
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            existing.setName(request.getName());
        }

        if (request.getCategoryId() != null) {
            EquipmentCategory cat = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new BadRequestException("Không tìm thấy danh mục thiết bị id = " + request.getCategoryId()));
            existing.setCategory(cat);
            existing.setType(cat.getCategoryCode());
        } else if (request.getType() != null && !request.getType().isBlank()) {
            EquipmentCategory cat = categoryRepository.findByCode(request.getType())
                    .orElseThrow(() -> new BadRequestException("Loại thiết bị '" + request.getType() + "' không tồn tại trong hệ thống"));
            existing.setCategory(cat);
            existing.setType(cat.getCategoryCode());
        }

        if (request.getRoomId() != null) {
            ComputerRoom room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new BadRequestException("Không tìm thấy phòng máy id = " + request.getRoomId()));
            existing.setRoom(room);
            existing.setRoomCode(room.getRoomCode());
        } else if (request.getRoomCode() != null && !request.getRoomCode().isBlank()) {
            ComputerRoom room = roomRepository.findByCode(request.getRoomCode())
                    .orElseThrow(() -> new BadRequestException("Phòng máy '" + request.getRoomCode() + "' không tồn tại trong hệ thống"));
            existing.setRoom(room);
            existing.setRoomCode(room.getRoomCode());
        }

        if (request.getSerialNumber() != null) existing.setSerialNumber(request.getSerialNumber());
        if (request.getManufacturer() != null) existing.setManufacturer(request.getManufacturer());
        if (request.getModel() != null) existing.setModel(request.getModel());
        if (request.getPurchaseDate() != null) existing.setPurchaseDate(request.getPurchaseDate());
        if (request.getWarrantyExpiry() != null) existing.setWarrantyExpiry(request.getWarrantyExpiry());
        if (request.getStatus() != null && !request.getStatus().isBlank()) existing.setStatus(request.getStatus());
        if (request.getConditionNote() != null) existing.setConditionNote(request.getConditionNote());

        Equipment saved = repository.save(existing);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void delete(Integer id) {
        getEntityById(id);
        repository.deleteById(id);
    }
}
