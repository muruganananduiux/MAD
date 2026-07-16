"""
Bootstrap shim for the MERN backend.

The platform's supervisor runs `uvicorn server:app --port 8001`.
On import, this module replaces the Python process with `node server.js`
so the actual Express backend binds to 8001 (as required by the K8s ingress).

Do NOT modify the supervisor config; edit only .env (PORT=8001) and this file.
"""
import os
import sys

# Make sure Node picks up the .env values (PORT=8001, MONGO_URI, JWT_SECRET, etc.)
# node's dotenv reads /app/backend/.env at runtime, so no work needed here.
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Replace the Python process with Node.js Express server.
# execvp() replaces the current process image, so supervisor's `backend` program
# now supervises node directly (no zombie Python interpreter left behind).
os.execvp("node", ["node", "server.js"])

# Unreachable, but keep uvicorn import happy if execvp somehow fails.
sys.exit(1)
