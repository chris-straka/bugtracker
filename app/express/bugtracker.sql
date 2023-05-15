CREATE TYPE user_role AS ENUM('owner', 'admin', 'project_manager', 'developer', 'tester', 'quality_assurance', 'contributor');

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'contributor',
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

CREATE TABLE project_user (
  project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES user(id),
  last_accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE project_comment (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES user(id),
  project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE, 
  comment VARCHAR(500) NOT NULL,
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

CREATE TYPE ticket_status AS ENUM('open', 'in_progress', 'closed', 'additional_info_required');
CREATE TYPE ticket_priority AS ENUM('none', 'low', 'medium', 'high', 'critical');
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

CREATE TABLE ticket_user (
  ticket_id INTEGER NOT NULL REFERENCES ticket(id),
  user_id INTEGER NOT NULL REFERENCES user(id),
  PRIMARY KEY (ticket_id, user_id)
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
