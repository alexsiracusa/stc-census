-- ===================================
-- Census - STC IQP C25
-- Alexander Siracusa, Alexander Gu, Alexander Lap, Ha Chu
--
-- Admin Database Schema
--
-- ===================================

DROP VIEW IF EXISTS Project_Path, Task_Node, Project_Children;
DROP TABLE IF EXISTS Account, Session, Project, Task, Task_Depends_On;
DROP TYPE IF EXISTS TASK_STATUS, PROJECT_STATUS;



-- ===================================
-- Type Definitions
-- ===================================

CREATE TYPE TASK_STATUS AS ENUM ('to_do', 'in_progress', 'on_hold', 'done');
CREATE TYPE PROJECT_STATUS AS ENUM ('not_started', 'in_progress', 'on_hold', 'complete');


-- ===================================
-- Table Definitions
-- ===================================

CREATE TABLE Account (
    id              SERIAL  PRIMARY KEY,
    email           TEXT    NOT NULL,
    password_hash   TEXT    NOT NULL
);

CREATE UNIQUE INDEX ON Account ((lower(email)));


CREATE TABLE Session (
    id                  TEXT            PRIMARY KEY,    --This is the bcrypt hash of a uuid
    ip_address          INET            NOT NULL,
    account_id          INT             REFERENCES Account(id),
    session_start       TIMESTAMPTZ     NOT NULL,
    expires_at          TIMESTAMPTZ     NOT NULL,
    last_activity       TIMESTAMPTZ     NOT NULL,
    timeout_duration    INTERVAL        NOT NULL
);

CREATE INDEX session_account_b_tree_index ON Session USING BTREE (account_id);


CREATE TABLE Project (
    id              SERIAL          PRIMARY KEY,
    parent          INT             REFERENCES Project(id),
    name            TEXT            NOT NULL,
    description     TEXT,
    status          PROJECT_STATUS  NOT NULL DEFAULT 'not_started',
    budget          DECIMAL(2),
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    requested_by    TEXT,
    date_requested  DATE,
    date_due        DATE,
    date_started    DATE,

    archived        BOOLEAN         NOT NULL DEFAULT false
);


CREATE TABLE Task (
    id              INT         NOT NULL,
    project_id      INT         NOT NULL REFERENCES Project(id),
    name            TEXT        NOT NULL,
    description     TEXT,
    status          TASK_STATUS NOT NULL DEFAULT 'to_do',
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    expected_cost   DECIMAL(2),
    actual_cost     DECIMAL(2),

    start_date              DATE,
    completion_date         DATE,

    target_start_date       DATE,
    target_completion_date  DATE,
    target_days_to_complete DECIMAL(2),

    PRIMARY KEY (project_id, id)
);


CREATE TABLE Task_Depends_On (
    task_id             INT,
    project_id          INT,

    depends_task_id     INT,
    depends_project_id  INT,

    FOREIGN KEY (project_id, task_id) REFERENCES Task (project_id, id),
    FOREIGN KEY (depends_project_id, depends_task_id) REFERENCES Task (project_id, id),

    PRIMARY KEY (task_id, project_id, depends_task_id, depends_project_id)
);



-- ===================================
-- Views
-- ===================================

CREATE VIEW Project_Path AS (
    WITH RECURSIVE project_cte(id,path) AS (
        SELECT
            Project.id,
            ARRAY[jsonb_build_object('id', Project.id, 'name', Project.name)]::JSONB[] AS path
        FROM Project
        WHERE Project.parent IS NULL
    UNION ALL
        SELECT
            Project.id,
            array_append(project_cte.path, jsonb_build_object('id', Project.id, 'name', Project.name))
        FROM project_cte, Project
        WHERE Project.parent = project_cte.id
    )
    SELECT *
    FROM project_cte
);

CREATE VIEW Project_Children AS (
    WITH RECURSIVE project_tree(parent, child) AS (
        SELECT
            Project.id as parent,
            Project.id as child
        FROM Project
    UNION ALL
        SELECT
            project_tree.parent,
            Project.id
        FROM Project
        INNER JOIN project_tree ON Project.parent = project_tree.child
    )
    SELECT
        parent AS id,
        ARRAY_AGG(child) AS children
    FROM project_tree
    GROUP BY parent
);

CREATE VIEW Task_Node AS (
    SELECT
        Task.*,
        array_remove(array_agg(json_object_nullif(jsonb_build_object(
            'task_id', Task_Depends_On.depends_task_id,
            'project_id', Task_Depends_On.depends_project_id)
        )), NULL) AS depends_on
    FROM TASK
    LEFT JOIN Task_Depends_On ON Task.project_id = Task_Depends_On.project_id AND Task.id = Task_Depends_On.task_id
    GROUP BY Task.id, Task.project_id
);



-- ===================================
-- Schema Constraints
-- ===================================

-- Ensures that a Project's parent cannot be itself.
CREATE OR REPLACE FUNCTION project_parent_not_self()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent = NEW.id THEN
        RAISE EXCEPTION 'Project parent id cannot be itself';
    END IF;

    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_parent_not_self
BEFORE INSERT ON Project
FOR EACH ROW EXECUTE FUNCTION project_parent_not_self();

-- Ensures that a Project's parent cannot be changed. This ensures a tree structure with no loops.
CREATE OR REPLACE FUNCTION raise_immutable()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'UPDATE not allowed on %(%)', TG_ARGV[0], TG_ARGV[1];
END
$$ LANGUAGE plpgsql;

-- sets task ids automatically
CREATE TRIGGER set_task_id
BEFORE INSERT ON Task
FOR EACH ROW
WHEN (NEW.id IS NULL)
EXECUTE FUNCTION generate_task_id();

CREATE TRIGGER project_parent_immutable
AFTER UPDATE OF parent ON Project
FOR EACH ROW EXECUTE PROCEDURE raise_immutable('Project', 'parent');

CREATE TRIGGER project_id_immutable
AFTER UPDATE OF id ON Project
FOR EACH ROW EXECUTE PROCEDURE raise_immutable('Project', 'id');

CREATE TRIGGER task_id_immutable
AFTER UPDATE OF id ON Task
FOR EACH ROW EXECUTE PROCEDURE raise_immutable('Task', 'id');


