#!/bin/bash

# Install frontend dependencies
cd frontend || exit
npm install
cd ..

# Install backend dependencies
cd backend || exit
pipenv install
cd ..
