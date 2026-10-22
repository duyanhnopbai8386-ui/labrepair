package com.labrepair.labrepair.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.labrepair.labrepair.security.JwtAuthenticationEntryPoint;
import com.labrepair.labrepair.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
            UserDetailsService userDetailsService
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        // Cho phép Preflight request (OPTIONS) từ trình duyệt
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Cho phép tài nguyên tĩnh (Giao diện Quản trị Web tích hợp trong Spring Boot)
                        .requestMatchers("/", "/index.html", "/assets/**", "/*.svg", "/*.ico", "/*.png", "/favicon.ico").permitAll()

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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
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
