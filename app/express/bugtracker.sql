CREATE TYPE user_role AS ENUM('owner', 'admin', 'project_manager', 'developer', 'tester', 'quality_assurance', 'contributor', 'guest');

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'guest',
  password CHAR(145) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user(id),
  changer_id INTEGER NOT NULL REFERENCES user(id),
  action VARCHAR(100) NOT NULL,
  changed_fields JSONB NOT NULL,
  previous_values JSONB, 
  new_values JSONB NOT NULL,
  change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- faster logins
CREATE UNIQUE INDEX user_email_idx ON user(email);

CREATE TYPE project_status AS ENUM('active', 'completed', 'archived');

CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES user(id),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  status project_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/*
  The ProjectUsers table marks a "many-to-many" relationship
  - one project can have many users
  - one user can have many projects

  I thought about nesting the users array under the Projects table as an INTEGER[]
  But after doing some research there are benefits to creating it as a table

  It's more scaleable because userIds can bloat a Project row by quite a bit.
  It's more performant because you can attach indexes to ProjectUsers and joins.
  It's more flexible because you can associate users with projects in more interesting ways.
  It has better data integrity because this table will make sure each user is only added once per project.
*/
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

/*
  project_comments marks a "one-to-many" relationship
  one project can have many comments
  one comment can't have many projects
*/
CREATE TABLE project_comment (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES user(id),
  project_id INTEGER NOT NULL REFERENCES project(id), 
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_history (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES project(id),
  changer_id INTEGER NOT NULL REFERENCES user(id),
  action VARCHAR(100) NOT NULL, 
  changed_fields JSONB NOT NULL,
  previous_values JSONB,
  new_values JSONB NOT NULL,
  change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE ticket_status AS ENUM('open', 'in_progress', 'closed', 'on_hold');
CREATE TYPE ticket_priority AS ENUM('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_type AS ENUM('bug', 'feature_request', 'task', 'documentation', 'improvement', 'question');

CREATE TABLE ticket (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES project(id), 
  owner_id INTEGER NOT NULL REFERENCES user(id),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  priority ticket_priority NOT NULL,
  type ticket_type NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX tickets_project_id_idx ON tickets(project_id);

CREATE TABLE ticket_assignment (
  ticket_id INTEGER NOT NULL REFERENCES ticket(id),
  developer_id INTEGER NOT NULL REFERENCES user(id),
  PRIMARY KEY (ticket_id, developer_id)
);

CREATE TABLE ticket_comment (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES user(id),
  ticket_id INTEGER NOT NULL REFERENCES ticket(id),
  comment VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_history (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES ticket(id),
  changer_id INTEGER NOT NULL REFERENCES user(id),
  changed_fields JSONB NOT NULL,
  previous_values JSONB,
  new_values JSONB NOT NULL,
  change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
