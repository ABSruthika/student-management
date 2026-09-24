package com.example.studentmanagement.controller;

import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.service.StudentService;
import com.example.studentmanagement.service.JwtService;
import com.example.studentmanagement.service.CustomUserDetailsService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import org.springframework.http.MediaType;

import java.util.List;

@WebMvcTest(StudentController.class)
public class StudentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StudentService studentService;

    @MockitoBean
private JwtService jwtService;

@MockitoBean
private CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllStudents_shouldReturnAllStudents() throws Exception {
        Student student = new Student(
                "Bala",
                "bala@gmail.com",
                24,
                "Computer Networks");
        when(studentService.getAllStudents())
                .thenReturn(List.of(student));

        mockMvc.perform(get("/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Bala"));
    }

    @Test
    void createStudent_shouldReturnCreatedStudent() throws Exception {
        Student student = new Student(
                "Anu",
                "anu@gmail.com",
                23,
                "Java");
        when(studentService.createStudent(any(Student.class)))
                .thenReturn(student);

        mockMvc.perform(
                post("/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                    {
                                        "name": "Anu",
                                        "email": "anu@gmail.com",
                                        "age": 23,
                                        "course": "Java"
                                    }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Anu"))
                .andExpect(jsonPath("$.email").value("anu@gmail.com"))
                .andExpect(jsonPath("$.age").value(23))
                .andExpect(jsonPath("$.course").value("Java"));
    }

    @Test
    void getStudentById_shouldReturnStudentById() throws Exception {
        Student student = new Student(
                "Bala",
                "bala@gmail.com",
                24,
                "Computer Networks");
        Long id = 1L;
        when(studentService.getStudentById(id))
                .thenReturn(student);

        mockMvc.perform(get("/students/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Bala"));
    }

    @Test
    void updatedStudent_shouldUpdateAndReturnStudent() throws Exception {
        Long id = 1L;
        Student student = new Student(
                "Anu",
                "anu@gmail.com",
                23,
                "Java");
        when(studentService.updateStudent(eq(id), any(Student.class)))
                .thenReturn(student);

        mockMvc.perform(
                put("/students/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                    {
                                        "name": "Anu",
                                        "email": "anu@gmail.com",
                                        "age": 23,
                                        "course": "Java"
                                    }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Anu"))
                .andExpect(jsonPath("$.email").value("anu@gmail.com"))
                .andExpect(jsonPath("$.age").value(23))
                .andExpect(jsonPath("$.course").value("Java"));
    }

    @Test
    void deleteStudent_ShouldDeleteStudent() throws Exception {
        Long id = 1L;
        doNothing().when(studentService).deleteStudent(id);
        mockMvc.perform(delete("/students/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void createStudent_shouldReturnBadRequestForInvalidEmail() throws Exception {
        mockMvc.perform(
                post("/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "Anu",
                                    "email": "invalid-email",
                                    "age": 23,
                                    "course": "Java"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createStudent_shouldReturnBadRequestForInvalidAge() throws Exception {

        mockMvc.perform(
                post("/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "Anu",
                                    "email": "anu@gmail.com",
                                    "age": 0,
                                    "course": "Java"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}
