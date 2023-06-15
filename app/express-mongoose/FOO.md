myapp/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── ProjectController.ts
│   │   │   └── UserController.ts
│   │   ├── dtos/
│   │   │   ├── CreateProjectDto.ts
│   │   │   └── CreateUserDto.ts
│   │   ├── routes/
│   │   │   ├── projectRoutes.ts
│   │   │   └── userRoutes.ts
│   ├── core/
│   │   ├── domain/
│   │   │   ├── Project/
│   │   │   │   ├── Project.ts (Entity)
│   │   │   │   ├── ProjectId.ts (Value Object)
│   │   │   │   ├── ProjectName.ts (Value Object)
│   │   │   │   └── ProjectRepository.ts (Repository Interface)
│   │   │   ├── User/
│   │   │   │   ├── User.ts (Entity)
│   │   │   │   ├── UserId.ts (Value Object)
│   │   │   │   ├── UserName.ts (Value Object)
│   │   │   │   └── UserRepository.ts (Repository Interface)
│   │   ├── application/
│   │   │   ├── Project/
│   │   │   │   ├── CreateProjectService.ts
│   │   │   │   ├── DeleteProjectService.ts
│   │   │   │   └── UpdateProjectService.ts
│   │   │   ├── User/
│   │   │   │   ├── CreateUserService.ts
│   │   │   │   ├── DeleteUserService.ts
│   │   │   │   └── UpdateUserService.ts
│   │   ├── infrastructure/
│   │   │   ├── db/
│   │   │   │   ├── ProjectRepositoryImpl.ts (Implementation of ProjectRepository)
│   │   │   │   └── UserRepositoryImpl.ts (Implementation of UserRepository)
│   │   │   └── utils/
│   │   │       └── dbConnection.ts
│   ├── app.ts (Main application file)
│   └── server.ts (Server bootstrap)
├── test/
│   └── integration/
│       ├── ProjectController.test.ts
│       └── UserController.test.ts
├── package.json
├── tsconfig.json
└── README.md
