# Backend PLUMP specification

# Productivity Scheme

For our productivity scheme we decided to use GitHub Issues for task management. Each task will be assigned as an issue, allowing us to track progress, assign responsibilities, and maintain transparency. Our team will use WhatsApp for quick communication and hold weekly in-person meetings to discuss progress, address challenges, and plan upcoming tasks.

We will follow an iterative development process, breaking down the project into milestones and focusing on incremental improvements based on feedback and testing.
 

# Programming Language

We have chosen TypeScript and JavaScript, specifically using the Nest.js framework, for the backend. Nest.js provides a modular and structured architecture, making it well-suited for scalable and maintainable applications. TypeScript offers strong type safety, reducing runtime errors and improving code clarity, which is crucial for long-term maintainability. Nest.js also includes built-in support for RESTful APIs and GraphQL, allowing flexibility in data retrieval. To ensure clean architecture and maintainability, we will structure the backend into modules for different functionalities such as user authentication, task management, and notifications, while using dependency injection to enhance scalability.

# Database 

For data storage, we will use SQLite, as it is lightweight, easy to set up, and well-suited for applications with a smaller user base. Since SQLite is file-based, it eliminates the need for managing a separate database server, making it an ideal choice for our project, where we do not expect high concurrent traffic. We will use TypeORM to interact with the database, allowing us to define models and relationships in a structured manner. This setup ensures efficient data management while keeping the overall system simple and easy to maintain.

# Container

To maintain consistency across development and deployment environments, we will use Docker to containerize our application. This guarantees that all dependencies and configurations are standardized, preventing the common “works on my machine” issue. By packaging the backend, database, and necessary dependencies into a Docker container, we ensure that the application runs reliably across different environments. If necessary, we will use Docker Compose to manage multiple services efficiently. This approach simplifies deployment, testing, and collaboration, ensuring a smooth development process.
