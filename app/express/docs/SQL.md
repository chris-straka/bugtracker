The project_user table is a "many-to-many" relationship

- a project can have many users
- a user can have many projects

I could've nested user_id's in the project table via `INTEGER[]`, but the project_user table

- scales better because userIds can bloat up each project row by quite a bit.
- performs better because you can attach indexes to each project_user relationship.
- flexible is better because you can associate users with projects in more interesting ways.
- Has better data integrity because this table will make sure each user is only added once to a project.

```sql
CREATE TABLE project_user (
  project_id INTEGER NOT NULL REFERENCES project(id),
  user_id INTEGER NOT NULL REFERENCES user(id),
  /*
    this is a composite primary key (it's common in many-to-many relationships)
    It combines two foreign keys into one primary key. If I used a regular primary key instead,
    I could accidentally map the same project to the same user more than once
  */
  PRIMARY KEY (project_id, user_id)
);
```

My project_comment table marks a "one-to-many" relationship

- one project can have many comments
- one comment can't have many projects

```sql
CREATE TABLE project_comment (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES user(id),
  project_id INTEGER NOT NULL REFERENCES project(id),
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
