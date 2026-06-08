# ============================================================
# app.py — Flask backend for Kathi Shirisha's portfolio
# Handles routing, API endpoints, and SQLite database setup
# ============================================================

from flask import Flask, jsonify, request, render_template
import sqlite3
import os

# Initialize Flask app
app = Flask(__name__)

# Path to the SQLite database file
DB_PATH = os.path.join(os.path.dirname(__file__), "portfolio.db")


# ------------------------------------------------------------
# DATABASE SETUP
# Creates the projects table if it doesn't exist yet,
# and seeds it with sample projects on first run.
# ------------------------------------------------------------
def init_db():
    """Initialize the SQLite database and seed with sample data."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create projects table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT    NOT NULL,
            description TEXT    NOT NULL,
            tech_stack  TEXT    NOT NULL,
            github_url  TEXT,
            live_url    TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Seed with sample projects only if the table is empty
    cursor.execute("SELECT COUNT(*) FROM projects")
    count = cursor.fetchone()[0]

    if count == 0:
        sample_projects = [
            (
                "Online Voting System",
                "A secure voting web application built with Python and Flask. Features include voter registration, vote casting, and real-time result display. Focused on organised and tamper-resistant vote management with session handling.",
                "Python, Flask, HTML, CSS, JavaScript, SQL",
                "https://github.com/ks1186561-cyber/vote-securely-now",
                "",
            ),
            (
                "Vote Gatekeeper Pro",
                "An advanced voting platform with enhanced access control and voter authentication. Built to manage election workflows securely, preventing duplicate votes and ensuring result integrity.",
                "Python, Flask, HTML, CSS, JavaScript, SQL",
                "https://github.com/ks1186561-cyber/vote-gatekeeper-pro",
                "",
            ),
            (
                "Personal Portfolio Website",
                "Full-stack portfolio website built using Flask, HTML, CSS, JavaScript, and SQLite. Displays personal information, skills, and project details dynamically via a REST API. Deployed as a live web application.",
                "Python, Flask, SQLite, HTML, CSS, JavaScript",
                "https://github.com/ks1186561-cyber",
                "",
            ),
        ]

        cursor.executemany(
            "INSERT INTO projects (title, description, tech_stack, github_url, live_url) VALUES (?, ?, ?, ?, ?)",
            sample_projects,
        )

    conn.commit()
    conn.close()


# ------------------------------------------------------------
# HELPER
# ------------------------------------------------------------
def get_db_connection():
    """Return a new SQLite connection with row-factory set to dict-like rows."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets us access columns by name
    return conn


# ------------------------------------------------------------
# ROUTES
# ------------------------------------------------------------

@app.route("/")
def index():
    """Serve the main portfolio page."""
    return render_template("index.html")


@app.route("/projects", methods=["GET"])
def get_projects():
    """
    GET /projects
    Returns all projects stored in the database as JSON.
    Response shape: { "projects": [ { id, title, description, tech_stack, github_url, live_url, created_at }, … ] }
    """
    conn = get_db_connection()
    rows = conn.execute(
        "SELECT * FROM projects ORDER BY created_at DESC"
    ).fetchall()
    conn.close()

    # Convert sqlite3.Row objects to plain dicts so jsonify can serialise them
    projects = [dict(row) for row in rows]
    return jsonify({"projects": projects}), 200


@app.route("/add_project", methods=["POST"])
def add_project():
    """
    POST /add_project
    Accepts JSON body: { title, description, tech_stack, github_url?, live_url? }
    Inserts a new project into the database and returns the created record.
    """
    data = request.get_json()

    # Basic validation — title, description, and tech_stack are required
    required = ["title", "description", "tech_stack"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    title       = data["title"].strip()
    description = data["description"].strip()
    tech_stack  = data["tech_stack"].strip()
    github_url  = data.get("github_url", "").strip()
    live_url    = data.get("live_url", "").strip()

    conn = get_db_connection()
    cursor = conn.execute(
        """INSERT INTO projects (title, description, tech_stack, github_url, live_url)
           VALUES (?, ?, ?, ?, ?)""",
        (title, description, tech_stack, github_url, live_url),
    )
    new_id = cursor.lastrowid

    # Fetch the newly inserted row to return it
    new_project = conn.execute(
        "SELECT * FROM projects WHERE id = ?", (new_id,)
    ).fetchone()
    conn.commit()
    conn.close()

    return jsonify({"message": "Project added!", "project": dict(new_project)}), 201


# ------------------------------------------------------------
# ENTRY POINT
# ------------------------------------------------------------
if __name__ == "__main__":
    init_db()          # Ensure DB + table exist before serving requests
    port = int(os.environ.get("PORT", 5000))
    # debug=False in production; Render sets PORT env variable automatically
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")
