#!/bin/bash
screen -d -m -S continue python3 get_workspace_info.py
# --- Installation ---
echo "Running installation script..."
bash ./install.sh
echo "Installation finished."

# --- Start Daemon in a Screen Session ---
echo "Starting daemon in a new screen session named 'daemon'..."
screen -d -m -S daemon bash ./start-daemon.sh

# --- Start Web UI in a Screen Session ---
echo "Starting web interface in a new screen session named 'web'..."
screen -d -m -S web bash ./start-web.sh

# --- Verification ---
echo "Scripts have been started in the background."
echo "Use 'screen -ls' to see the list of running sessions."
echo "Use 'screen -r daemon' or 'screen -r web' to attach to a session."
screen -d -m -S frp bash mefrp/mefrpstart.sh