package com.labrepair.labrepair.mapper;

import com.labrepair.labrepair.dto.SparePartRequest;
import com.labrepair.labrepair.dto.SparePartResponse;
import com.labrepair.labrepair.model.SparePart;
import org.springframework.stereotype.Component;

@Component
public class SparePartMapper {
    public SparePart toEntity(SparePartRequest request) {
        if (request == null) return null;
        SparePart part = new SparePart();
        part.setPartCode(request.getPartCode());
        part.setPartName(request.getPartName());
        part.setUnit(request.getUnit() != null ? request.getUnit() : "Cái");
        part.setStockQuantity(request.getStockQuantity());
        part.setMinStockLevel(request.getMinStockLevel() != null ? request.getMinStockLevel() : 5);
        part.setUnitPrice(request.getUnitPrice());
        part.setSupplier(request.getSupplier());
        return part;
    }

    public SparePartResponse toResponse(SparePart entity) {
        if (entity == null) return null;
        return new SparePartResponse(
                entity.getId(),
                entity.getPartCode(),
                entity.getPartName(),
                entity.getUnit(),
                entity.getStockQuantity(),
                entity.getMinStockLevel(),
                entity.getUnitPrice(),
                entity.getSupplier(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }
}
