# Docker

ENV vars in docker-compose.yml !DO NOT! appear in whatever starts docker compose. 
If `jest` spins up docker compose, it can't see PGHOST and your tests won't work.

You have to use dotenv() inside a globalSetup.ts file to set the ENV vars from docker-compose.yml. 

BUT BE CAREFUL! Jest does not understand any of the service names in your docker-compose.yml.
It's not a part of the docker network, hence -> PGHOST=127.0.0.1 (not PGHOST=my_db).

## Misc

Docker runs as PID 1 which is bad for Node. Snyk uses 'dumb-init' instead.

WORKDIR and ENV resets after every stage

I tried using rancher desktop instead of docker desktop but bind mounts didn't work.
This meant no hot reload which sucked. `ts-node-dev --poll` also sucked.

```dockerfile
CMD ["node", "index.js"] # BETTER at forwarding signals to the node process
CMD "node index.js"      # WORSE
```
