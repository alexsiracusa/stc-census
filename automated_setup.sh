#!/bin/bash

# Exit on any error
set -e

# Store the base directory
BASE_DIR="$(pwd)"
SCRIPTS_DIR="$BASE_DIR/scripts/setup"

# Make all setup scripts executable
chmod u+x "$SCRIPTS_DIR/install.sh" "$SCRIPTS_DIR/setup.sh" "$SCRIPTS_DIR/run.sh"

# Execute scripts in order
echo "Running installation script..."
"$SCRIPTS_DIR/install.sh"

echo "Running database setup script..."
"$SCRIPTS_DIR/setup.sh"

echo "Running application..."
"$SCRIPTS_DIR/run.sh"
