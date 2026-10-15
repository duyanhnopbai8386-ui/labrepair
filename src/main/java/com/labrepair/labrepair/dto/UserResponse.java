package com.labrepair.labrepair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer id;
    private String employeeCode;
    private String email;
    private String fullName;
    private String phone;
    private String department;
    private String role;
    private String status;
    private LocalDateTime createdAt;
}
