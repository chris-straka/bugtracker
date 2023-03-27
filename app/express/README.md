# Express Web API 

This backend monolith implements sessions, graphQL, rest, PG (no ORM).

## Notes

Sessions are stateful when stored on the server and violate restful principles. For this API, I'm going to make the API read the sessionID and then hit the DB to find out more information on the user.

```js
// middleware is evaluated from right to left
app.get('route', second, first) 
```

Express-session no longer needs cookie-parser and express no longer needs body-parser. These packages were used because HTTP stuff is sent as a string, but I want to use req.cookie and req.body as JS objects.

When the [express-session docs](https://expressjs.com/en/resources/middleware/session.html) says "Expires Set-Cookie attribute", they're referring to the Set-Cookie HTTP header, which has an Expires field (attribute).

cookie-parser is the same as express-session except it stores the session information on the client and not the server.

CMD ["node", "index.js"]  is best for forwarding signals to the node process

### Docker

- Apparently docker runs things as PID 1 and you don't want Node to run as PID 1 (Snyk talks about it, see attribution below). 
  - Synk recommend using a different init process instead for the Node process (such as "dumb-init").

- The WORKDIR, ENV stanzas in Docker reset after every stage in a multistage build, so you have to reapply it in all stages where you want to use it.

- `pnpm fetch` is similar to `pnpm install`, except it only uses the pnpm-lock.yaml file and not the package.json file. 
  - They made this command because if you change something in your package.json file that is unrelated to your dependencies (name, description, etc), docker will re-run the entire dockerfile again starting at the part where you added package.json (because the package.json changed and the build needs to reflect that). This also means it will reinstall all your dependencies again, even if none of them changed in the package.json file. So if you only add the lock file and install from that, changes to your package.json won't change the lock file until you install new packages. At least that's how I currently understand it.

I wanted my Dockerfile to only specify my production I needed to install the dev dependencies in one stage and the production dependencies in another, because I actually need a devDependency to build my production app (typescript's tsc), but I don't actually want devDependencies in my production build. I also wanted to I ended up with something pretty ugly, but I don't feel comfortable with other solutions so it'll stick for now.

I tried [rancher desktop](https://docs.rancherdesktop.io/getting-started/installation/) which uses nerdctl and not docker, and it was giving me issues. Hot reload wasn't working when I tried nerdctl compose, which was unfortunate. I had to use ts-node-dev --poll to get it to work, and that wasn't a great DX.

```sh
npm init @eslint/config
```

## Attribution

- [JS Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Integration Testing Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [Snyk Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
