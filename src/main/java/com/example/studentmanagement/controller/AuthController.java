package com.example.studentmanagement.controller;
import com.example.studentmanagement.dto.RegisterRequest;
import com.example.studentmanagement.dto.UserResponse;
import com.example.studentmanagement.dto.LoginRequest;
import com.example.studentmanagement.dto.LoginResponse;
import com.example.studentmanagement.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody RegisterRequest request) {
        return authService.registerUser(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}
