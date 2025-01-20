#!/bin/bash

# Exit on any error
set -e

# Store the base directory
INSTALL_SCRIPT="install.sh"
SCHEMA_SCRIPT="setup.sh"
RUN_SCRIPT="run.sh"

# Make all setup scripts executable
chmod u+x "$INSTALL_SCRIPT" "$SCHEMA_SCRIPT" "$RUN_SCRIPT"

# Execute scripts in order
echo "Running installation script..."
"./$INSTALL_SCRIPT"

echo "Running schema loading script..."
"./$SCHEMA_SCRIPT"

echo "Running application..."
"./$RUN_SCRIPT"
