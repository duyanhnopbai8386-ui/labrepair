package com.labrepair.labrepair.mapper;

import com.labrepair.labrepair.dto.UserRequest;
import com.labrepair.labrepair.dto.UserResponse;
import com.labrepair.labrepair.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toEntity(UserRequest request) {
        if (request == null) return null;
        User user = new User();
        user.setEmployeeCode(request.getEmployeeCode());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        return user;
    }

    public UserResponse toResponse(User entity) {
        if (entity == null) return null;
        return new UserResponse(
                entity.getId(),
                entity.getEmployeeCode(),
                entity.getEmail(),
                entity.getFullName(),
                entity.getPhone(),
                entity.getDepartment(),
                entity.getRole(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }
}
