## Notes

A lot of the session stuff happens automatically.

Sessions make the server stateful when they're stored on the server (which violates restful principles). 

For this API, I'm going to make the API read the sessionID and hit the DB to find out more information on the user.

```js
// middleware is evaluated from right to left
app.get('route', second, first) 
```

Express-session no longer needs cookie-parser and express no longer needs body-parser. These packages were used because HTTP stuff is sent as a string, but I want to use req.cookie and req.body as JS objects.

When the [express-session docs](https://expressjs.com/en/resources/middleware/session.html) says "Expires Set-Cookie attribute", they're referring to the Set-Cookie HTTP header, which has an Expires field (attribute).

cookie-parser is the same as express-session except it stores the session information on the client and not the server.

CMD ["node", "index.js"]  is best for forwarding signals to the node process

```sh
npm init @eslint/config
```
