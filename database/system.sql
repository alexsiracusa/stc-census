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