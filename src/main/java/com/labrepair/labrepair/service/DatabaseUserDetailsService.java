package com.labrepair.labrepair.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.labrepair.labrepair.model.User;
import com.labrepair.labrepair.repository.UserRepository;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DatabaseUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Có thể đăng nhập bằng email hoặc mã nhân viên (employeeCode)
        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByEmployeeCode(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + identifier));

        String rawRole = user.getRole() != null ? user.getRole().toUpperCase().replace("ROLE_", "") : "USER";
        String password = user.getPassword() != null ? user.getPassword() : "";

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                password,
                List.of(new SimpleGrantedAuthority("ROLE_" + rawRole))
        );
    }
}
