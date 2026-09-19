package com.example.studentmanagement.service;

import com.example.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.studentmanagement.entity.Student;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith (MockitoExtension.class)
public class StudentServiceTest {
    @Mock 
    private StudentRepository studentRepository;

    @InjectMocks 
    private StudentService studentService;

    @Test
void createStudent_shouldSaveAndReturnStudent() {

    Student student = new Student(
            "Sri",
            "sri@gmail.com",
            22,
            "Java"
    );

    when(studentRepository.save(student))
            .thenReturn(student);

    Student result = studentService.createStudent(student);

    assertEquals(student, result);

    verify(studentRepository).save(student);
}

}
