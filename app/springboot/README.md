# Spring Boot Bugtracker Backend (Monolith)

> Java, Spring Boot, Docker, K8s, GraphQL, REST

This bug tracker is different than the other ones in several ways.

User authorization is "two tiered". 

- The first tier is at project creation (admin, project manager, and user) 
- The second tier is on an individual project level (manager, developer, contributor, guest)

## Roles

### Managing Projects

- Admin: Manages users and projects
- PM "Project Manager": Can create delete their own projects, can't touch other PM's projects
- User: Can only visit other projects that

### Managing Within Projects

- Owner: Can add managers to the project + everything else
- Manager: Can assign people to tickets + everything else
- Developer: Can update tickets they're assigned to + comments
- Contributor: Can create tickets
- Guest: Can view only and request for more permissions

## Commands

```sh
./gradlew tasks      # see all available tasks
./gradlew.bat tasks  # for windows users
./gradlew bootRun
```
