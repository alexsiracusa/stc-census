#!/bin/bash

BACKEND_PORT=8000
FRONTEND_PORT=5173

kill_port() {
  local port=$1
  lsof -ti :$port | xargs kill -9 2>/dev/null || true
}

# Kill any process already using the backend or frontend ports
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

cleanup() {
  sleep 0.4
  kill 0
}

(trap cleanup SIGINT;
  # Start backend process
  cd ./backend || exit
  pipenv run fastapi dev main.py &

  # Start frontend process
  cd ../frontend || exit
  npm run dev
)

