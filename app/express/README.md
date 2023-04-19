# Express Web API

This is an express API written in TS (monolith). It implements sessions, graphQL, rest, PG (no ORM).

I have notes in the /docs folder

## Roles

- ADMIN: Everything
- PROJECT_MANAGER: Creates & manages projects, assigns tickets to devs
- DEVELOPER: Create/edit tickets & comments. Can update ticket status
- CONTRIBUTOR: Ditto, but can't update ticket status
- GUEST: Can view projects/comments but can't edit

## Commands

```sh
pnpm ddev
pnpm test
```

## Debugging (vscode)

Download the Jest Runner extension from the .vscode folder and use its debug feature on any test case. 
Set breakpoints anywhere in the application that need debugging.

## Attribution

- [JS Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Integration Testing Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Snyk Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [Error](https://stackoverflow.com/questions/783818)
- [Node Green](https://node.green/)
