# Express Web API 

Yes, I'm aware that sessions are stateful and violates RESTful principles. I'm just using sessions for practice.

```js
app.get('route', second, first) // middleware is evaluated from right to left
```

Express-session no longer needs the cookie-parser package and express no longer needs the body-parser package. These packages were used because the HTTP headers and body are sent as a string, but I want to use them as objects in JS.

When the [express-session docs](https://expressjs.com/en/resources/middleware/session.html) say stuff like "Expires Set-Cookie attribute", they're referring to the Set-Cookie HTTP header, which has an Expires field (attribute).
