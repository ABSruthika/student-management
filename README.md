# Student Management System

A full-stack Student Management System built using Spring Boot and React. The application provides secure authentication, role-based authorization, and student CRUD (Create, Read, Update, Delete) operations.

## Features

### Authentication and Security
- User registration and login.
- JWT-based authentication.
- Role-based authorization for ADMIN and FACULTY users.
- Protected API endpoints.
- Automatic logout when an API request returns an unauthorized response.
- Secure registration that assigns the FACULTY role to newly registered users.

### Student Management
- Add new students (ADMIN only).
- View the list of students.
- Edit student details using a popup modal.
- Delete students (ADMIN only).
- Validate student input.
- Display loading states, success messages, and error messages.
- Handle backend connection failures gracefully.

### User Interface
- React-based frontend.
- Login and registration interface.
- Dashboard with role-specific functionality.
- Responsive student table.
- Edit Student popup modal.
- Styled forms, buttons, and feedback messages.

## Technology Stack

| Category | Technologies |
|---|---|
| Backend | Java 21, Spring Boot |
| Frontend | React, Vite, JavaScript |
| Database | MySQL |
| Security | Spring Security, JWT |
| Data Access | Spring Data JPA, Hibernate |
| Testing | JUnit, Spring Boot Test |
| Build Tools | Maven, npm |
| API Testing | Postman |
| Version Control | Git, GitHub |

## Role-Based Access

| Feature | ADMIN | FACULTY |
|---|---|---|
| Login | Yes | Yes |
| View students | Yes | Yes |
| Add students | Yes | No |
| Edit students | Yes | Yes |
| Delete students | Yes | No |

**Note:** Permissions are enforced by the backend, not just by hiding buttons in the frontend.

## Project Structure

```text
student-management/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

## Prerequisites

Install the following before running the application:

- Java Development Kit (JDK) 21
- Apache Maven
- Node.js and npm
- MySQL Server
- Git

Check your installations:

```bash
java -version
mvn -version
node -v
npm -v
git --version
```

## Database and Environment Configuration

### 1. Create the Database

Start your MySQL server and execute:

```sql
CREATE DATABASE student_management;
```

The application uses the database named `student_management`.

### 2. Configure the Backend

The backend configuration is located in:

`backend/src/main/resources/application.properties`

Relevant configuration:

```properties
spring.application.name=student-management

spring.datasource.url=jdbc:mysql://localhost:3306/student_management
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=${JWT_SECRET}
```

### 3. Configure Environment Variables

The backend expects these environment variables:

| Variable | Purpose |
|---|---|
| `DB_PASSWORD` | Password for the MySQL `root` user |
| `JWT_SECRET` | Secret used by the JWT implementation |

Configure both variables in your local development environment before starting the backend.

The variables must be available to the process running Spring Boot. If you configure them through an editor or terminal, make sure the backend process inherits those values.

**Security precautions:**
- Never commit actual database passwords or JWT secrets to GitHub.
- Never put real secret values in this README.
- Use a strong, appropriately sized JWT secret compatible with your application's signing algorithm.
- For production, use a dedicated database account with only the permissions it needs rather than the MySQL `root` account.

## How to Run the Application

Run the backend and frontend in separate terminals.

### 1. Start the Backend

Open a terminal:

```bash
cd backend
mvn spring-boot:run
```

The Spring Boot application should start on:

`http://localhost:8080`

Make sure MySQL is running and both required environment variables are available to the backend process.

### 2. Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal. Open that URL in your browser.

The frontend communicates with the backend at:

`http://localhost:8080`

## API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |

### Student Management

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/students` | Retrieve students |
| POST | `/students` | Create a student |
| PUT | `/students/{id}` | Update a student |
| DELETE | `/students/{id}` | Delete a student |

Protected student endpoints require a valid JWT access token. Authorization depends on the user's role.

## Testing

### Backend Tests

From the project root:

```bash
cd backend
mvn test
```

This executes the backend test suite, including security-related tests.

### Frontend Production Build

From the project root:

```bash
cd frontend
npm run build
```

This checks whether the frontend can be compiled for production.

### Manual API Testing

You can use Postman to test:

- User registration and login.
- Accessing protected endpoints with a valid token.
- Student CRUD operations.
- Unauthorized requests.
- Role-based restrictions for ADMIN and FACULTY.

## Current Project Status

The core Student Management System includes:

- Spring Boot REST APIs.
- MySQL persistence.
- JWT authentication and role-based authorization.
- React frontend integration.
- Student CRUD functionality.
- Form validation and user feedback.
- An Edit Student popup modal.
- Backend security tests and frontend production build checks.

## Future Improvements

Potential future improvements include:

- Automated frontend tests.
- Deployment of the backend and frontend.
- Production database and secret management.
- API documentation using Swagger/OpenAPI.

These are future enhancements and are not claimed as completed features.