# Express Monolith Backend API

> Express, Typescript, Jest, REST, GraphQL, Postgres (no ORM), Docker, K8s, Terraform
> This bug tracker helps an organization keep track of different bugs across various projects.

## User Roles

Admins can manage users, projects, tickets, and comments.

Project Managers (PMs) can manage projects they create.

- PMs can add and remove people from a projects
- The only PM that can add/remove another pm is an admin or the project owner (the PM/admin who created the project)

Devs assigned to a project can manage and comment on all its tickets

Contributors can manage tickets they created but they can only comment on other tickets

## Workflow

1. The user signs in with their email and password
2. They're brought to the dashboard

Every user starts off as a contributor until they've been granted higher privileges by an admin.
An admin or PM is responsible for creating a project and then adding users to it.

3. The dashboard has a bunch of tabs

- Home

  - Ticket statistics and a searchbar for viewing tickets/projects that have been assigned to them.
  - Searching removes the statistics from view, which they can bring back with a button.
  - The search bar can be used to jump to a project (/projects/:projectId), or ticket (/projects/:projectName/tickets/:ticketId)

- Profile

  - lets a user change their username, email and password.

- Created tickets
- Assigned tickets
- Assigned projects

4. The admin dashboard would look like this

- Home
- Profile
- Tickets (all)
- Projects (all)
- User Management

## Frontend

Dashboard has ticket statistics, but when they search something the stats disappear to make way for search results.
Button for clearing the search results

## Commands

```sh
pnpm ddev
pnpm test
```

## Debugging (vscode)

You can debug code by running the test case for that code in Jest

1. Download the Jest Runner extension (as specified in the .vscode folder)
2. Add the breakpoints wherever you want in the application
3. Go to the test case that runs that calls your breakpoint and click "debug"

You might be able to also run the following 

>Debug: JavaScript Debug Terminal

## Attribution

- [JS Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Integration Testing Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Snyk Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [Error](https://stackoverflow.com/questions/783818)
- [Node Green](https://node.green/)
- [tdd video](https://www.youtube.com/watch?v=M44umyYPiuo)
- [Bug Tracker App That I'm Cloning](https://www.youtube.com/watch?v=vG824vBdYY8)
