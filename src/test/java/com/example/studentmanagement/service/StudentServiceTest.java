package com.example.studentmanagement.service;

import com.example.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.StudentNotFoundException;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
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
                "Java");

        when(studentRepository.save(student))
                .thenReturn(student);

        Student result = studentService.createStudent(student);

        assertEquals(student, result);

        verify(studentRepository).save(student);
    }

    @Test
    void getAllStudents_shouldReturnStudentList() {
        List<Student> students = List.of(
                new Student(
                        "Sru",
                        "sru@gmail.com",
                        23,
                        "Java Backend"),
                new Student(
                        "Mukhil",
                        "mukhil@gmail.com",
                        23,
                        "Backend"));

        when(studentRepository.findAll()).thenReturn(students);

        List<Student> result = studentService.getAllStudents();

        assertEquals(students, result);

        verify(studentRepository).findAll();
    }

    @Test
    void getStudentById_shouldReturnStudent() {
        Long id = 1L;
        Student student = new Student(
                "Sru",
                "sru@gmail.com",
                23,
                "Java Backend");

        when(studentRepository.findById(id))
                .thenReturn(Optional.of(student));

        Student result = studentService.getStudentById(id);

        assertEquals(student, result);

        verify(studentRepository).findById(id);
    }

    @Test
    void getStudentById_shouldThrowExceptionWhenStudentNotFound() {

        Long id = 99L;

        when(studentRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                StudentNotFoundException.class,
                () -> studentService.getStudentById(id));

        verify(studentRepository).findById(id);
    }

    @Test
    void updateStudent_shouldUpdateAndReturnStudent() {
        Long id = 1L;
        Student existingStudent = new Student(
                "Anu",
                "anu@gmail.com",
                23,
                "Backend");
        Student updatedStudent = new Student(
                "Anu",
                "anu_new@gmail.com",
                23,
                "Backend");

        when(studentRepository.findById(id))
                .thenReturn(Optional.of(existingStudent));

        when(studentRepository.save(existingStudent))
                .thenReturn(existingStudent);

        Student result = studentService.updateStudent(id, updatedStudent);

        assertEquals("Anu", result.getName());
        assertEquals("anu_new@gmail.com", result.getEmail());
        assertEquals(23, result.getAge());
        assertEquals("Backend", result.getCourse());

        verify(studentRepository).findById(id);
        verify(studentRepository).save(existingStudent);

    }

    @Test
    void updateStudent_shouldThrowExceptionWhenStudentNotFound() {
        Long id = 99L;
        Student updatedStudent = new Student(
                "Anu",
                "anu_new@gmail.com",
                23,
                "Backend");

        when(studentRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                StudentNotFoundException.class,
                () -> studentService.updateStudent(id, updatedStudent));

        verify(studentRepository).findById(id);
        verify(studentRepository, never()).save(updatedStudent);
    }

    @Test
    void deleteStudent_shouldDeleteStudent() {

        Long id = 1L;

        when(studentRepository.existsById(id))
                .thenReturn(true);

        studentService.deleteStudent(id);

        verify(studentRepository).existsById(id);
        verify(studentRepository).deleteById(id);
    }

    @Test
    void deleteStudent_shouldThrowExceptionWhenStudentNotFound() {

        Long id = 99L;

        when(studentRepository.existsById(id))
                .thenReturn(false);

        assertThrows(
                StudentNotFoundException.class,
                () -> studentService.deleteStudent(id));

        verify(studentRepository).existsById(id);
        verify(studentRepository, never()).deleteById(id);
    }
}
