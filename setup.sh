#!/bin/bash

psql -c "CREATE USER admin WITH SUPERUSER PASSWORD 'admin';"
psql -c "CREATE DATABASE census OWNER admin;"
psql -c "REVOKE ALL ON DATABASE census FROM PUBLIC;"

psql -d census < database/system.sql
psql -d census < database/schema.sql

