package com.labrepair.labrepair.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.labrepair.labrepair.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            UserDetailsService userDetailsService
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. API Xác thực công khai (Login, Register)
                        .requestMatchers("/api/auth/**").permitAll()

                        // 2. Tra cứu phòng máy, danh mục & thiết bị công khai cho sinh viên / giảng viên xem
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/equipment/**").permitAll()

                        // 3. Báo hỏng thiết bị: Sinh viên, Giảng viên, KTV, Admin đều được báo hỏng
                        .requestMatchers(HttpMethod.POST, "/api/incidents").hasAnyRole("ADMIN", "TECHNICIAN", "TEACHER", "STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/incidents/**").hasAnyRole("ADMIN", "TECHNICIAN", "TEACHER", "STUDENT")

                        // 4. Tiếp nhận, sửa chữa, thay linh kiện: Chỉ TECHNICIAN và ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/incidents/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers("/api/repair-histories/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.GET, "/api/spare-parts/**").hasAnyRole("ADMIN", "TECHNICIAN")

                        // 5. Quản trị hệ thống, kho linh kiện, dashboard báo cáo, quản lý users: Chỉ ADMIN
                        .requestMatchers("/api/dashboard/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/spare-parts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/spare-parts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/spare-parts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/equipment/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/equipment/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/equipment/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasRole("ADMIN")

                        // Mọi endpoint khác bắt buộc phải đăng nhập
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
