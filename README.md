# Bug Tracker

This application lets users report and track bugs.

## Project Structure

/app has the monolith versions for the backend.

/services has the microservices version of the backend.

/frontend folder has frontends for the backend (either monolith/microservices)

## How it works

This application has four different types of users...

Admins
  Manage users (CRUD)
  Manage projects (CRUD)
  Manage tickets (CRUD)

Project Managers
  Manage projects that they're a part of (CRUD)
  Manage tickets in those projects (CRUD) 
  Manage users in those projects (add/remove/assign)

Developers
  View projects that they're assigned to
  Update tickets
  Create tickets
  Comment on tickets

Contributors
  View projects that they're assigned to
  Create tickets
  Comment on tickets

1. PMs or Admins create projects and assign users to them.
2. Those users can create "tickets" for those projects, that talk about some type of bug.
3. People can leave comments and change the status etc, the history will be recorded

## Helpful

https://www.reddit.com/r/docker/comments/k0v3os/separate_dockerfiles_for_development_and

[I'm cloning this](https://www.youtube.com/watch?v=vG824vBdYY8)
