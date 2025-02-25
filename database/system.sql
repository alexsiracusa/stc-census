-- ===================================
-- Census - STC IQP C25
-- Alexander Siracusa, Alexander Gu, Alexander Lap, Ha Chu
--
-- This file creates the necessary setup, including extension and functions,
-- for the 'admin' database.
--
-- ===================================

CREATE EXTENSION pgcrypto;


CREATE OR REPLACE FUNCTION session_valid(
    expires_at TIMESTAMP,
    last_activity TIMESTAMP,
    timeout_duration INTERVAL
)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    AS
$$
BEGIN
   RETURN (
       CURRENT_TIMESTAMP < expires_at AND
       CURRENT_TIMESTAMP < last_activity + timeout_duration
    );
END;
$$;


CREATE OR REPLACE FUNCTION is_timezone( tz TEXT )
    RETURNS BOOLEAN
    LANGUAGE plpgsql STABLE
    AS
$$
DECLARE
    date TIMESTAMPTZ;
BEGIN
    date := now() AT TIME ZONE tz;
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

CREATE DOMAIN timezone AS TEXT
CHECK ( is_timezone( value ) );


CREATE OR REPLACE FUNCTION create_task_sequence()
RETURNS TRIGGER AS $$
DECLARE
    sequence_name TEXT := 'task_seq_' || NEW.id;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'S' AND c.relname = sequence_name
    )
    THEN
        -- Sequence does not exist, create it
        EXECUTE format('CREATE SEQUENCE %I START 1', sequence_name);
    ELSE
        -- Sequence already exists, reset it if needed
        EXECUTE format('ALTER SEQUENCE %I RESTART WITH 1', sequence_name);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION generate_task_id()
RETURNS TRIGGER AS $$
DECLARE
    next_task_id INT;
    sequence_name TEXT := 'task_seq_' || NEW.project_id;
BEGIN
    EXECUTE format('SELECT nextval(%L)', sequence_name) INTO next_task_id;
    -- Assign the task_id to the new row
    NEW.id := next_task_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION json_object_nullif(
    _data JSONB
)
RETURNS JSONB
AS $$
    SELECT nullif(jsonb_strip_nulls(_data)::TEXT, '{}')::JSONB
$$ LANGUAGE sql;


CREATE OR REPLACE FUNCTION json_array_nullif(
    _data JSONB
)
RETURNS JSONB
AS $$
    SELECT nullif(_data::TEXT, '[null]')::JSONB
$$ LANGUAGE sql;
