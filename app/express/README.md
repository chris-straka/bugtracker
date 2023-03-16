# Express Web API 

This version does not use an ORM. I separated the ORMs into their own folder to keep things clean.

Yes, I'm aware that sessions are stateful and violate RESTful principles (it's only meant for practice).

```js
// middleware is evaluated from right to left
app.get('route', second, first) 
```

Express-session no longer needs cookie-parser and express no longer needs body-parser. These packages were used because HTTP stuff is sent as a string, but I want to use req.cookie and req.body as JS objects.

When the [express-session docs](https://expressjs.com/en/resources/middleware/session.html) says "Expires Set-Cookie attribute", they're referring to the Set-Cookie HTTP header, which has an Expires field (attribute).

## Prisma 

Prisma generates code from prisma/schema.prisma and puts it in `node_modules/.prisma/client`.
You need to run `prisma generate` everytime you change the prisma file in your project.

## 

pnpm i express express-graphql graphql helmet jsonwebtoken nodemailer 


  "dependencies": {
    "@prisma/client": "^4.11.0",
    "argon2": "^0.30.3",
    "bcrypt": "^5.1.0",
    "bunyan": "^1.8.15",
    "compression": "^1.7.4",
    "cookie-session": "^2.0.0",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-graphql": "^0.12.0",
    "express-jwt": "^8.4.1",
    "express-session": "^1.17.3",
    "express-validator": "^6.15.0",
    "graphql": "^16.6.0",
    "helmet": "^6.0.1",
    "jsonwebtoken": "^9.0.0",
    "knex": "^2.4.2",
    "mongodb": "^5.1.0",
    "mongoose": "^7.0.1",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.1",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "peerjs": "^1.4.7",
    "pg": "^8.10.0",
    "sequelize": "^6.29.2",
    "simple-peer": "^9.11.1",
    "socket.io": "^4.6.1",
    "sockjs": "^0.3.24",
    "typeorm": "^0.3.12",
    "winston": "^3.8.2",
    "ws": "^8.13.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.0",
    "@types/express": "^4.17.17",
    "@types/express-session": "^1.17.6",
    "@types/jest": "^29.4.0",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/node": "^18.14.6",
    "@types/nodemailer": "^6.4.7",
    "@types/pg": "^8.6.6",
    "@typescript-eslint/eslint-plugin": "^5.54.1",
    "@typescript-eslint/parser": "^5.54.1",
    "eslint": "^8.35.0",
    "eslint-config-standard-with-typescript": "^34.0.0",
    "eslint-plugin-import": "^2.25.2",
    "eslint-plugin-n": "^15.0.0",
    "eslint-plugin-promise": "^6.0.0",
    "jest": "^29.5.0",
    "prisma": "^4.11.0",
    "superagent": "^8.0.9",
    "ts-jest": "^29.0.5",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  }