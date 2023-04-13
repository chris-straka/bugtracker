# Express Web API 

This is an express API written in TS (monolith). It implements sessions, graphQL, rest, PG (no ORM).

I have notes in the /docs folder

## Roles

- dev: Can edit tickets assigned to them, update the status of the ticket (e.g., mark it as resolved), and add comments.

- Admin: Can edit all tickets, assign tickets to developers, update the status of the ticket, and add comments.

- Contributor: Can create new tickets and edit the tickets they created, but cannot change the status of the ticket or assign it to others.

- Project Manager: Can edit all tickets, assign tickets to developers, update the status of the ticket, and add comments.

## Commands 

```sh
pnpm ddev
pnpm test
```

## Debugging 

Open a JS debug terminal in vscode by bringing up the command palette.

```
>Debug: Javascript Debug Terminal
```

Then run whatever command you want to debug, ddev or test.

## Attribution

- [JS Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Integration Testing Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Snyk Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [Error](https://stackoverflow.com/questions/783818)
- [Node Green](https://node.green/)
