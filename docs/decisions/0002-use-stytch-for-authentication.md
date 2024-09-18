# Use Stytch for Authentication and Authorization

## Context and Problem Statement

We need to implement a secure and user-friendly authentication and authorization mechanism in our React/C# application.

## Decision Drivers
* User Experience: Provide a seamless login/registration experience without redirecting users to external windows.
* Development Efficiency: Minimize backend development effort for authentication and user management.
* Centralized User Management: Manage user accounts and permissions in a centralized location.

## Considered Options

* [Stytch](https://stytch.com/)
* [Auth0](https://auth0.com/)
* Custom Implementation

## Decision Outcome

Chosen option: "Stytch", because it offers embedded login/registration components, eliminates the need for backend login components, and provides centralized user management capabilities, aligning with our decision drivers.