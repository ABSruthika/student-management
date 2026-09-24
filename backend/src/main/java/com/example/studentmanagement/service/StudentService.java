package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import com.example.studentmanagement.exception.StudentNotFoundException;

import java.util.List;

@Service 
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student){
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id){
        return studentRepository.findById(id)
        .orElseThrow(()->
        new StudentNotFoundException(
            "Student not found with id: "+id
        ));
    }

    public Student updateStudent(Long id, Student student){
        Student existingStudent = studentRepository.findById(id)
        .orElseThrow(()-> new StudentNotFoundException(
            "Student not found with id: "+id
        ));
        // if(existingStudent == null){
        //     return null;
        // }

        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setAge(student.getAge());
        existingStudent.setCourse(student.getCourse());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id){
        if(!studentRepository.existsById(id)){
            throw new StudentNotFoundException(
                "Student not found with id: "+id
            );
        }
        studentRepository.deleteById(id);
    }
}
