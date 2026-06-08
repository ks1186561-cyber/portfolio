# Kathi Shirisha — Personal Portfolio

A full-stack personal portfolio built with **Flask**, **SQLite**, **HTML**, **CSS**, and **JavaScript**.  
Features a dark-themed, animated UI with a live projects section powered by a RESTful API.

---

## Folder Structure

```
portfolio/
├── app.py                  # Flask app — routes & API endpoints
├── requirements.txt        # Python dependencies
├── Procfile                # Render/Heroku start command
├── render.yaml             # Render deployment config
├── .gitignore
├── README.md
├── portfolio.db            # SQLite DB (auto-created on first run)
├── templates/
│   └── index.html          # Main HTML template
└── static/
    ├── css/
    │   └── style.css       # Dark theme stylesheet
    └── js/
        └── main.js         # Frontend JS (API calls, animations)
```

---

## API Endpoints

| Method | Endpoint        | Description                      |
|--------|-----------------|----------------------------------|
| GET    | `/projects`     | Returns all projects as JSON     |
| POST   | `/add_project`  | Adds a new project to the DB     |

### POST /add_project — Request body
```json
{
  "title":       "My Project",
  "description": "What it does",
  "tech_stack":  "Python, Flask",
  "github_url":  "https://github.com/...",
  "live_url":    ""
}
```

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/kathishirisha/portfolio.git
cd portfolio

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Open **http://localhost:5000** in your browser.

---

## Tech Stack

- **Backend:** Python 3, Flask
- **Database:** SQLite (via Python's built-in `sqlite3` module)
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts:** Syne · DM Mono · DM Sans (Google Fonts)
- **Deployment:** Render (Gunicorn WSGI)
