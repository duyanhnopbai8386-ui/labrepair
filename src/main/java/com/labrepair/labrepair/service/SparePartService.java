package com.labrepair.labrepair.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.dto.SparePartRequest;
import com.labrepair.labrepair.dto.SparePartResponse;
import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.mapper.SparePartMapper;
import com.labrepair.labrepair.model.SparePart;
import com.labrepair.labrepair.repository.SparePartRepository;

@Service
public class SparePartService {
    private final SparePartRepository repository;
    private final SparePartMapper mapper;

    public SparePartService(SparePartRepository repository, SparePartMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<SparePartResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    public SparePartResponse findById(Integer id) {
        return mapper.toResponse(getEntityById(id));
    }

    public SparePart getEntityById(Integer id) {
        return repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy linh kiện có id = " + id));
    }

    public List<SparePartResponse> findLowStock() {
        return repository.findAll().stream()
                .filter(p -> p.getStockQuantity() <= p.getMinStockLevel())
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public SparePartResponse create(SparePartRequest request) {
        if (repository.existsByPartCode(request.getPartCode())) {
            throw new DuplicateResourceException("Mã linh kiện '" + request.getPartCode() + "' đã tồn tại");
        }
        SparePart part = mapper.toEntity(request);
        return mapper.toResponse(repository.save(part));
    }

    @Transactional
    public SparePartResponse update(Integer id, SparePartRequest request) {
        SparePart existing = getEntityById(id);
        repository.findByPartCode(request.getPartCode()).ifPresent(p -> {
            if (!p.getId().equals(id)) {
                throw new DuplicateResourceException("Mã linh kiện '" + request.getPartCode() + "' đã thuộc linh kiện khác");
            }
        });

        existing.setPartCode(request.getPartCode());
        existing.setPartName(request.getPartName());
        existing.setUnit(request.getUnit());
        existing.setStockQuantity(request.getStockQuantity());
        existing.setMinStockLevel(request.getMinStockLevel());
        existing.setUnitPrice(request.getUnitPrice());
        existing.setSupplier(request.getSupplier());

        return mapper.toResponse(repository.save(existing));
    }

    @Transactional
    public void delete(Integer id) {
        getEntityById(id);
        repository.deleteById(id);
    }

    @Transactional
    public void deductStock(Integer partId, Integer quantity) {
        SparePart part = getEntityById(partId);
        if (part.getStockQuantity() < quantity) {
            throw new BadRequestException("Linh kiện '" + part.getPartName() + "' không đủ số lượng tồn kho (còn: "
                    + part.getStockQuantity() + ", yêu cầu: " + quantity + ")");
        }
        part.setStockQuantity(part.getStockQuantity() - quantity);
        repository.save(part);
    }
}
