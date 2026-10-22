package com.labrepair.labrepair.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.labrepair.labrepair.dto.LoginRequest;
import com.labrepair.labrepair.dto.LoginResponse;
import com.labrepair.labrepair.dto.RegisterRequest;
import com.labrepair.labrepair.dto.UserResponse;
import com.labrepair.labrepair.exception.BadRequestException;
import com.labrepair.labrepair.exception.DuplicateResourceException;
import com.labrepair.labrepair.exception.ResourceNotFoundException;
import com.labrepair.labrepair.mapper.UserMapper;
import com.labrepair.labrepair.model.User;
import com.labrepair.labrepair.repository.UserRepository;
import com.labrepair.labrepair.security.JwtService;
import com.labrepair.labrepair.service.DatabaseUserDetailsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final DatabaseUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            DatabaseUserDetailsService userDetailsService,
            JwtService jwtService,
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getIdentifier());
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(userDetails.getUsername())
                .or(() -> userRepository.findByEmployeeCode(userDetails.getUsername()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin tài khoản"));

        LoginResponse response = new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' đã được sử dụng");
        }

        if (request.getEmployeeCode() != null && !request.getEmployeeCode().isBlank()) {
            if (userRepository.existsByEmployeeCode(request.getEmployeeCode())) {
                throw new DuplicateResourceException("Mã nhân viên / MSSV '" + request.getEmployeeCode() + "' đã tồn tại");
            }
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmployeeCode(request.getEmployeeCode());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());

        String role = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole().toUpperCase().replace("ROLE_", "")
                : "STUDENT";
        user.setRole(role);
        user.setStatus("ACTIVE");

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(saved));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadRequestException("Chưa đăng nhập");
        }

        String username = auth.getName();
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByEmployeeCode(username))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin người dùng đang đăng nhập"));

        return ResponseEntity.ok(userMapper.toResponse(user));
    }
}
