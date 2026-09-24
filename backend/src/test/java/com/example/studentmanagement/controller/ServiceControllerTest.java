package com.example.studentmanagement.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import org.springframework.http.MediaType;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // No token
    @Test
    void getStudentsWithoutToken_shouldReturn401() throws Exception {

        mockMvc.perform(
                get("/students"))
                .andExpect(status().isUnauthorized());
    }

    // Invalid token
    @Test
    void getStudentsWithInvalidToken_shouldReturn401() throws Exception {

        mockMvc.perform(
                get("/students")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    // Expired token
    @Test
    void getStudentsWithExpiredToken_shouldReturn401() throws Exception {

        String secret = System.getenv("JWT_SECRET");

        String expiredToken = Jwts.builder()
                .subject("Admin1")
                .issuedAt(new Date(System.currentTimeMillis() - 60_000))
                .expiration(new Date(System.currentTimeMillis() - 30_000))
                .signWith(
                        Keys.hmacShaKeyFor(
                                secret.getBytes(StandardCharsets.UTF_8)))
                .compact();

        mockMvc.perform(
                get("/students")
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void facultyCanGetStudents_shouldReturn200() throws Exception {

        mockMvc.perform(
                get("/students")
                        .with(
                                SecurityMockMvcRequestPostProcessors
                                        .user("Faculty1")
                                        .roles("FACULTY")))
                .andExpect(status().isOk());
    }

    @Test
    void facultyCannotCreateStudent_shouldReturn403() throws Exception {

        String requestBody = """
                {
                    "name": "Test Student",
                    "email": "test@student.com",
                    "age": 20,
                    "course": "Computer Science"
                }
                """;

        mockMvc.perform(
                post("/students")
                        .with(
                                SecurityMockMvcRequestPostProcessors
                                        .user("Faculty1")
                                        .roles("FACULTY"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden());
    }

    @Test
    void facultyCannotDeleteStudent_shouldReturn403() throws Exception {

        mockMvc.perform(
                delete("/students/{id}", 1L)
                        .with(
                                SecurityMockMvcRequestPostProcessors
                                        .user("Faculty1")
                                        .roles("FACULTY")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanCreateStudent_shouldReturn200() throws Exception {

        String requestBody = """
                {
                    "name": "Admin Test Student",
                    "email": "adminstudent@test.com",
                    "age": 21,
                    "course": "Computer Science"
                }
                """;

        mockMvc.perform(
                post("/students")
                        .with(
                                SecurityMockMvcRequestPostProcessors
                                        .user("Admin1")
                                        .roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void adminCanDeleteStudent_shouldReturn200() throws Exception {

        String requestBody = """
                {
                    "name": "Delete Test Student",
                    "email": "delete@test.com",
                    "age": 22,
                    "course": "Java"
                }
                """;

        String response = mockMvc.perform(
                post("/students")
                        .with(
                                SecurityMockMvcRequestPostProcessors
                                        .user("Admin1")
                                        .roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        long studentId = Long.parseLong(
                response.replaceAll(".*\"id\":(\\d+).*", "$1"));

        mockMvc.perform(
                delete("/students/{id}", studentId)
                        .with(
                                SecurityMockMvcRequestPostProcessors
                                        .user("Admin1")
                                        .roles("ADMIN")))
                .andExpect(status().isOk());
    }

}