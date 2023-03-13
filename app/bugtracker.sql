-- I'm worried about using enums but I'm running with it
-- http://komlenic.com/244/8-reasons-why-mysqls-enum-data-type-is-evil/
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('admin', 'project_manager', 'developer', 'contributor') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

-- last_modified_at will need an event trigger to work properly

-- faster logins
CREATE UNIQUE INDEX user_email_idx ON Users(email);

CREATE TABLE Projects (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES Users(id),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
)

-- ProjectUsers is a many to many relationship
-- one project can have many users
-- one user can have many projects
CREATE TABLE ProjectUsers (
  project_id INTEGER NOT NULL REFERENCES Projects(id),
  user_id INTEGER NOT NULL REFERENCES Users(id),
  -- therefore I used a composite primary key
  -- if I used a regular primary key, I might map a project to a user more than once
  PRIMARY KEY (project_id, user_id)
)

-- ProjectComments is a one to many relationship
-- one project can have many comments
CREATE TABLE ProjectComments (
  -- therefore I used a regular primary key
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES Users(id),
  project_id INTEGER NOT NULL REFERENCES Projects(id), 
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  description VARCHAR(500) NOT NULL
)

CREATE TABLE Tickets (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES Users(id),
  priority INTEGER NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
)

CREATE TABLE TicketAssignments (
  PRIMARY KEY (ticket_id, developer_id),
  ticket_id INTEGER NOT NULL REFERENCES Tickets(id),
  developer_id INTEGER NOT NULL REFERENCES Users(id),
);

CREATE TABLE TicketComments (
  id SERIAL PRIMARY KEY,
  owner INTEGER NOT NULL REFERENCES Users(id),
  description VARCHAR(500) NOT NULL,
  ticket_id INTEGER NOT NULL REFERENCES Tickets(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TABLE TicketHistory (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES Tickets(id),
  changer_id INTEGER NOT NULL REFERENCES Users(id),
  changed_fields VARCHAR(100)[] NOT NULL,
  previous_values VARCHAR(100)[] NOT NULL,
  new_values VARCHAR(100)[] NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
);