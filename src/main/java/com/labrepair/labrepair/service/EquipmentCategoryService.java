package com.labrepair.labrepair.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.model.EquipmentCategory;
import com.labrepair.labrepair.repository.EquipmentCategoryRepository;

@Service
public class EquipmentCategoryService {
    private final EquipmentCategoryRepository repository;

    public EquipmentCategoryService(EquipmentCategoryRepository repository) {
        this.repository = repository;
    }

    public List<EquipmentCategory> findAll() {
        return repository.findAll();
    }

    public EquipmentCategory findById(Integer id) {
        return repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy loại thiết bị có id = " + id));
    }

    public EquipmentCategory create(EquipmentCategory category) {
        validate(category);
        if (repository.existsByCode(category.getCategoryCode())) {
            throw new DuplicateResourceException("Mã loại thiết bị '" + category.getCategoryCode() + "' đã tồn tại");
        }
        category.setId(null);
        return repository.save(category);
    }

    public EquipmentCategory update(Integer id, EquipmentCategory category) {
        findById(id);
        validate(category);
        repository.findByCode(category.getCategoryCode()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Mã loại '" + category.getCategoryCode() + "' đã thuộc về loại khác");
            }
        });
        category.setId(id);
        return repository.update(category);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    private void validate(EquipmentCategory category) {
        if (category == null) {
            throw new BadRequestException("Dữ liệu loại thiết bị không được để trống");
        }
        if (category.getCategoryCode() == null || category.getCategoryCode().isBlank()) {
            throw new BadRequestException("Mã loại thiết bị không được để trống");
        }
        if (category.getCategoryName() == null || category.getCategoryName().isBlank()) {
            throw new BadRequestException("Tên loại thiết bị không được để trống");
        }
    }
}
