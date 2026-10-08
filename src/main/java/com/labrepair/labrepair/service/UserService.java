package com.labrepair.labrepair.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.model.User;
import com.labrepair.labrepair.repository.UserRepository;

@Service
public class UserService {
    private static final Set<String> ROLES = Set.of("LECTURER", "TECHNICIAN", "ADMIN", "STUDENT");
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> findAll() {
        return repository.findAll();
    }

    public User findById(Integer id) {
        return repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy người dùng có id = " + id));
    }

    @Transactional
    public User create(User user) {
        validate(user);
        if (repository.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("Email '" + user.getEmail() + "' đã tồn tại");
        }
        user.setId(null);
        if (user.getStatus() == null || user.getStatus().isBlank()) {
            user.setStatus("ACTIVE");
        }
        return repository.save(user);
    }

    @Transactional
    public User update(Integer id, User user) {
        findById(id);
        validate(user);
        repository.findByEmail(user.getEmail()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Email '" + user.getEmail() + "' đã thuộc về người dùng khác");
            }
        });
        user.setId(id);
        return repository.save(user);
    }

    @Transactional
    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    private void validate(User user) {
        if (user == null) {
            throw new BadRequestException("Dữ liệu người dùng không được để trống");
        }
        if (user.getEmail() == null || user.getEmail().isBlank() || !user.getEmail().contains("@")) {
            throw new BadRequestException("Email người dùng không hợp lệ");
        }
        if (user.getFullName() == null || user.getFullName().isBlank()) {
            throw new BadRequestException("Họ tên người dùng không được để trống");
        }
        if (user.getRole() == null || !ROLES.contains(user.getRole().toUpperCase())) {
            throw new BadRequestException("Vai trò phải là LECTURER, TECHNICIAN, ADMIN hoặc STUDENT");
        }
        user.setRole(user.getRole().toUpperCase());
    }
}
