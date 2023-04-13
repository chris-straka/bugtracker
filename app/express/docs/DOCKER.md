# Docker

Environment variables that you set inside a docker compose file can not be understood by parent process's outside of docker compose. So if you run `jest`, and `jest` has a globalSetup() that spins up docker compose containers for your test, those ENV variables that you set in docker-compose are not going to show up in `jest`. This means your test runner will not know how to connect to PGHOST, it won't have the PGUSER or the PGPASSWORD, etc. 

You might be inclined to duplicate the ENV variables from the docker compose file into a .env file, and then run that dotenv() inside the jest globalSetup() hook. But if you do this, just know that the environment variables related to the docker network (PGHOST=db, REDIS_HOST), will be unintelligible for jest. Only containers inside the docker compose network understand what PGHOST=db means. Jest is outside of that network and does not understand that db is a service inside your docker compose file. You must use PGHOST=127.0.0.1 instead or PGHOST=localhost.

So in summary, if your backend API is running inside docker compose then you can connect to the DB by listening for it on localhost i.e. PGHOST=localhost or by listening to the other service PGHOST=db. Your jest process is not running inside docker compose and can only understand PG=localhost.

## Small stuff 

Docker runs things as PID 1 and Node doesn't want to be PID 1 (Snyk talks about it, see my attributions). 
So you might want to use a dummy init process instead (Snyk uses 'dumb-init').

The WORKDIR and ENV stanzas in Docker reset after every stage in a multistage build.

I tried [rancher desktop](https://docs.rancherdesktop.io/getting-started/installation/) which uses nerdctl and not docker. But it was giving me issues with bind mounts, which meant hot reload wasn't working either. I could have done it with ts-node-dev --poll, but that wasn't a great DX imo.
