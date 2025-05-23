# Identity and Access Management (IAM) Implementation

## Overview
This document describes the custom IAM implementation that replaces the previous Stytch CIAM solution. The implementation provides user authentication, authorization, and role management using Azure services.

## Architecture

### Backend Components
- **User Model**: Stores user information including username, password hash, role, and email
- **Authentication Service**: Handles user authentication, registration, and password management
- **Users Repository**: Manages user data in Azure Cosmos DB
- **JWT Authentication**: Secure token-based authentication using Azure Key Vault

### Frontend Components
- **Login Component**: User authentication interface
- **Registration Component**: New user registration
- **Password Reset**: Self-service password reset functionality
- **Admin Panel**: User management and role assignment interface

## Security Features

### Password Security
- Passwords are hashed using SHA256
- Password reset tokens expire after 24 hours
- Secure password storage in Cosmos DB

### Authentication
- JWT-based authentication
- Token expiration after 7 days
- Secure token storage in Azure Key Vault

### Authorization
- Role-based access control (RBAC)
- Admin role for user management
- Protected API endpoints

## API Endpoints

### Authentication
- `POST /auth/login`: User login
- `POST /auth/register`: User registration
- `POST /auth/reset-password-request`: Request password reset
- `POST /auth/reset-password`: Reset password with token

### User Management (Admin Only)
- `PUT /auth/users/{userId}/role`: Update user role

## Frontend Implementation

### Components
1. **LoginForm**
   - Username/password login
   - Password reset link
   - Error handling

2. **RegisterForm**
   - New user registration
   - Role selection (default: User)
   - Email verification

3. **PasswordResetForm**
   - Email-based password reset
   - Token validation
   - New password setup

4. **AdminPanel**
   - User list with pagination
   - Role management
   - User search and filtering

### State Management
- JWT token storage in secure HTTP-only cookies
- User context for role-based UI rendering
- Admin state for privileged operations

## Setup and Configuration

### Backend Configuration
1. Azure Cosmos DB
   - Database: TREY
   - Container: Users
   - Partition Key: /id

2. Azure Key Vault
   - JWT_SECRET: Token signing key
   - JWT_ISSUER: Token issuer URL
   - JWT_AUDIENCE: Token audience URL

### Frontend Configuration
1. Environment Variables
   - API_BASE_URL: Backend API URL
   - JWT_COOKIE_NAME: JWT cookie name
   - ADMIN_ROLE: Admin role identifier

## Security Considerations

### Best Practices
1. All passwords are hashed before storage
2. JWT tokens are stored in HTTP-only cookies
3. API endpoints are protected with role-based authorization
4. Password reset tokens have limited validity
5. Admin operations require explicit authorization

### Limitations
1. No multi-factor authentication (MFA)
2. No social login integration
3. No email verification flow
4. No session management UI

## Future Improvements

### Planned Features
1. Multi-factor authentication
2. Social login integration
3. Email verification
4. Session management
5. Audit logging
6. User activity monitoring

### Security Enhancements
1. Password complexity requirements
2. Account lockout after failed attempts
3. Session timeout configuration
4. IP-based access control
5. Security event logging 