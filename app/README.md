# Express Backend API

```sh
pnpm ddev # pgadmin on 8080
pnpm test # ignore redis connect errors on first startup
```

> Express, Typescript, Jest, REST, GraphQL, Postgres (no ORM), Docker, K8s, Terraform
> This bug tracker helps an organization keep track of different bugs across various projects.
> routes -> middlewares -> controllers -> services -> repositories

I didn't realize this at the time, but my models are totally anemic (basically DTOs) 
Most of the logic is in the services. Mainly because I built this api using functions originally.

I'll do a more DDD/OOP approach in the other version of this api.

## Bug Tracker User Roles

There's four main roles

Admins can manage everything (users, projects, tickets, and comments).

Project Managers (PMs) can manage projects they create and who's allowed to work in them.

Developers can be assigned to a project or a ticket.

Contributors are developers with less priviledges.

## Workflow

1. User signup/login
2. User creates a project if they're a PM, or they get invited to join an existing project.
3. User creates tickets in their assigned projects
4. User (dev) closes tickets when they're done working on them.

## Debugging (vscode)

You can debug code using jest.

1. Download the Jest Runner extension (as specified in the .vscode folder)
2. Add the breakpoints wherever you want in the application
3. Go to the test case that tests the route you wanna test and hit debug

## Attribution

- [JS Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Integration Testing Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Snyk Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [Error](https://stackoverflow.com/questions/783818)
- [Node Green](https://node.green/)
- [Bug Tracker App That I'm Cloning](https://www.youtube.com/watch?v=vG824vBdYY8)
