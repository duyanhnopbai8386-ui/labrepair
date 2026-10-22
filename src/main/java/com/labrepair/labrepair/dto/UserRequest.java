package com.labrepair.labrepair.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String employeeCode;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    private String phone;
    private String department;
    private String password;

    @NotBlank(message = "Vai trò không được để trống (ADMIN, TECHNICIAN, TEACHER, STUDENT)")
    private String role;

    private String status = "ACTIVE";
}
