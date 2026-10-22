package com.labrepair.labrepair.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String msg = authException != null && authException.getMessage() != null
                ? authException.getMessage().replace("\"", "'")
                : "Yêu cầu cần xác thực Bearer Token hợp lệ";

        String jsonResponse = String.format(
                "{\"timestamp\":\"%s\",\"status\":401,\"error\":\"UNAUTHORIZED\",\"message\":\"Yêu cầu chưa được xác thực: %s\"}",
                LocalDateTime.now(),
                msg
        );

        response.getWriter().write(jsonResponse);
    }
}
