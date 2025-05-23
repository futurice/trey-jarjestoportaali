---
status: accepted
date: 2024-03-19
deciders: Development Team
consulted: Security Team, UX Team
informed: Project Stakeholders
---
# Custom IAM Implementation

## Context and Problem Statement

The Trey Järjestöportaali requires a robust identity and access management (IAM) system that balances security, usability, and flexibility. We need to choose between implementing a custom IAM solution or using a third-party Customer Identity and Access Management (CIAM) solution.

## Decision Drivers

* Username-based authentication requirement
* Finnish language support
* Cost efficiency
* Learning curve for power users
* Integration with Azure services
* Customization flexibility

## Considered Options

* Custom IAM Implementation
* Auth0
* Okta
* Keycloak
* Firebase Authentication

## Decision Outcome

Chosen option: "Custom IAM Implementation", because it provides the best balance of features, cost efficiency, and user experience while meeting our specific requirements for username-based authentication and Finnish language support.

### Consequences

* Good, because:
  - Complete control over the authentication system
  - Cost-effective scaling
  - Simplified user experience
  - Flexible user management
  - Direct integration with Azure services
  - Custom monitoring and logging
* Bad, because:
  - Initial development overhead
  - Need to maintain security best practices
  - Responsibility for security updates
  - Need to handle email delivery infrastructure

## Validation

The implementation will be validated through:
- Security audits
- User acceptance testing
- Performance testing
- Integration testing with Azure services

## Pros and Cons of the Options

### Custom IAM Implementation

* Good, because:
  - Username-based authentication support
  - Native Finnish language support
  - Cost-effective scaling
  - Full control over user experience
  - Direct Azure integration
  - Custom monitoring and logging
* Bad, because:
  - Initial development overhead
  - Security maintenance responsibility
  - Email infrastructure management

### Auth0

* Good, because:
  - Comprehensive feature set
  - Extensive SDK support
  - Built-in social login
  - Enterprise-grade security
* Bad, because:
  - High learning curve for power users
  - Limited username-based authentication
  - Expensive for our scale
  - Less control over user experience
  - Complex pricing model

### Okta

* Good, because:
  - Enterprise-grade security
  - Extensive integration options
  - Strong compliance features
  - Robust admin controls
* Bad, because:
  - Overkill for our needs
  - Expensive licensing
  - Complex setup and maintenance
  - Limited customization options
  - Heavy reliance on email-based authentication

### Keycloak

* Good, because:
  - Open-source
  - Self-hosted option
  - Flexible authentication methods
  - Good documentation
* Bad, because:
  - Requires significant maintenance
  - Complex setup
  - Limited out-of-the-box features
  - Requires additional infrastructure
  - Steep learning curve for administrators

### Firebase Authentication

* Good, because:
  - Easy to implement
  - Free tier available
  - Good documentation
  - Quick setup
* Bad, because:
  - Limited customization
  - Vendor lock-in
  - Email-centric authentication
  - Limited control over user data
  - Basic role management

## More Information

The custom IAM solution will include:
- JWT-based authentication
- Email verification system
- Password reset functionality
- Role-based access control
- Session management
- User profile management

Security measures will include:
- Regular security audits
- Automated vulnerability scanning
- Monitoring of authentication attempts
- Rate limiting
- Secure password policies
- Regular token rotation

Monitoring and maintenance will be handled through:
- Azure Monitor integration
- Custom logging
- Performance metrics
- User activity tracking
- Error monitoring
- Security event logging 