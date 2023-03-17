# Express Web API 

This web api implements JWT, graphQL and sessions for practice.

## Notes

This version does not use an ORM. I separated the ORMs into their own folder to keep things clean.

Yes, I'm aware that sessions are stateful and violate RESTful principles (it's only meant for practice).

```js
// middleware is evaluated from right to left
app.get('route', second, first) 
```

Express-session no longer needs cookie-parser and express no longer needs body-parser. These packages were used because HTTP stuff is sent as a string, but I want to use req.cookie and req.body as JS objects.

When the [express-session docs](https://expressjs.com/en/resources/middleware/session.html) says "Expires Set-Cookie attribute", they're referring to the Set-Cookie HTTP header, which has an Expires field (attribute).
