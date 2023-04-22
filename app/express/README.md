# Express Monolith Backend

> Express, Typescript, Jest, REST, GraphQL, Postgres (no ORM), Docker, K8s, Terraform

This bug tracker helps an organization keep track of different bugs across various projects.

## User Roles

Admins can manage users, projects, tickets, and comments.

Project Managers (PMs) can manage projects they create.

- They can add and remove people from their projects
- Only the project owner or an admin can add and remove other PMs from a project.
  - Owner -> The PM or admin who created the project

Developers can manage tickets in the projects they're a part of

- They can edit any ticket in the project, not just the ones they're assigned to

Contributors can manage tickets in projects they're a part of.

- They can only edit tickets that they own

Guests can view everything but can't create/edit anything

## Workflow

Every new user starts off as a guest until they've been granted higher privileges by the admin.

An admin or a PM can then create a project and assign other users to it.

Those users can then create and edit comments or tickets in that project

## Commands

```sh
pnpm ddev
pnpm test
```

## Debugging (vscode)

1. Download the Jest Runner extension (as specified in the .vscode folder)
2. Add the breakpoints wherever you want in the application
3. Go to the test case that runs that calls your breakpoint and click "debug"

## Attribution

- [JS Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Integration Testing Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Snyk Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [Error](https://stackoverflow.com/questions/783818)
- [Node Green](https://node.green/)
