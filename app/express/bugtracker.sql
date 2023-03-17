CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('admin', 'project_manager', 'qa', 'developer', 'contributor') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE UserHistory (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES Users(id),
  changer_id INTEGER NOT NULL REFERENCES Users(id),
  action VARCHAR(100) NOT NULL,
  changed_fields JSONB NOT NULL,
  previous_values JSONB, 
  new_values JSONB NOT NULL,
  change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
)

-- faster logins
CREATE UNIQUE INDEX user_email_idx ON Users(email);

CREATE TABLE Projects (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES Users(id),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
)

/*
  The ProjectUsers table marks a many to many relationship
  - one project can have many users
  - one user can have many projects

  I thought about nesting the users array under the Projects table as an INTEGER[]
  But after doing some research there are benefits to creating it as a table

  It's more scaleable because userIds can bloat a Project row by quite a bit.
  It's more performant because you can attach indexes to ProjectUsers and joins.
  It's more flexible because you can associate users with projects in more interesting ways.
  It has better data integrity because this table will make sure each user is only added once per project.
*/
CREATE TABLE ProjectUsers (
  project_id INTEGER NOT NULL REFERENCES Projects(id),
  user_id INTEGER NOT NULL REFERENCES Users(id),
  /*
    this is a composite primary key (it's common in many-to-many relationships)
    It combines two foreign keys into one primary key. If I used a regular primary key instead, 
    I could accidentally map the same project to the same user more than once
  */
  PRIMARY KEY (project_id, user_id)
)

/*
  ProjectComments is a one to many relationship
  one project can have many comments
  one comment can't have many projects
*/
CREATE TABLE ProjectComments (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES Users(id),
  project_id INTEGER NOT NULL REFERENCES Projects(id), 
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE ProjectHistory (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES Projects(id),
  changer_id INTEGER NOT NULL REFERENCES Users(id),
  action VARCHAR(100) NOT NULL, 
  changed_fields JSONB NOT NULL,
  previous_values JSONB,
  new_values JSONB NOT NULL,
  change_timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE Tickets (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES Users(id),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  priority INTEGER NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE TicketAssignments (
  ticket_id INTEGER NOT NULL REFERENCES Tickets(id),
  developer_id INTEGER NOT NULL REFERENCES Users(id),
  PRIMARY KEY (ticket_id, developer_id)
);

CREATE TABLE TicketComments (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES Users(id),
  description VARCHAR(500) NOT NULL,
  ticket_id INTEGER NOT NULL REFERENCES Tickets(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE TicketHistory (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES Tickets(id),
  changer_id INTEGER NOT NULL REFERENCES Users(id),
  changed_fields JSONB NOT NULL,
  previous_values JSONB,
  new_values JSONB NOT NULL,
  change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);
