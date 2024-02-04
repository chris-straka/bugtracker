## Notes

```sh
npm init @eslint/config
pnpm fetch # similar to pnpm install
```

`pnpm fetch` only uses the pnpm-lock.yaml file and not the package.json file.

Sometimes you change something that isn't a dependency in the package.json file,
and you don't want docker to download all the dependencies again when that happens.

## Dependency Stuff

express no longer needs body-parser. express-session no longer needs cookie-parser.
HTTP is sent as a string not a JS object, hence why we used these.

cookie-session stores session information in a cookie instead of redis/server.

## Session Fixation vulnerability

1. Attacker creates a cookie with a sessionID of their choosing
2. They send the victim a phishing email with a link containing that cookie
3. The user signs in with the link in the email and authenticates that cookie
4. The hacker can then impersonate the user and do whatever

PREVENTION:

Generate new random session IDs for each session and only after the user signs in.
The old session should also be invalidated.

## Pagination

Offset is simple and you can use it to jump arbitrary pages (page 1 to page 230)
- It's unreliable because data can be added to the DB while you're searching
- It's not performant, especially when your offset becomes large

Cursor is performant and reliable
- Clients need to traverse the page one by one and can't jump arbitrarily
- Clients need to keep track of the cursor value
- Records need to be added sequentially to the DB