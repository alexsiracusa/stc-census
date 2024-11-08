#!/bin/bash

# Install frontend dependencies
cd frontend || exit
npm run dev
cd ..

# Install backend dependencies
cd backend || exit
pipenv install
cd ..
