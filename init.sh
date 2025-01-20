#!/bin/bash

# Exit on any error
set -e

# Store the base directory
BASE_DIR="$(pwd)"
SCRIPTS_DIR="$BASE_DIR/script/setup"

INSTALL_SCRIPT="install.sh"
SCHEMA_SCRIPT="load_schemas.sh"
RUN_SCRIPT="run.sh"

# Make all setup scripts executable
chmod u+x "$SCRIPTS_DIR/$INSTALL_SCRIPT" "$SCRIPTS_DIR/$SCHEMA_SCRIPT" "$SCRIPTS_DIR/$RUN_SCRIPT"

# Execute scripts in order
echo "Running installation script..."
"$SCRIPTS_DIR/$INSTALL_SCRIPT"

echo "Running schema loading script..."
"$SCRIPTS_DIR/$SCHEMA_SCRIPT"

echo "Running application..."
"$SCRIPTS_DIR/$RUN_SCRIPT"
