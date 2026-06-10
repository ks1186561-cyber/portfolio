# Personal Portfolio Website

A full-stack personal portfolio website built with Python Flask, HTML, CSS, JavaScript, and SQLite. This project showcases my skills, projects, and achievements through a responsive and user-friendly web interface.

## 🚀 Features

- Responsive portfolio website
- Dynamic project management using SQLite
- REST API for project data
- Clean and modern user interface
- Mobile-friendly design
- Flask backend integration
- GitHub project links

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask

### Database
- SQLite

### Version Control
- Git
- GitHub

## 📂 Project Structure

```text
portfolio/
│
├── app.py
├── requirements.txt
├── render.yaml
├── Procfile
├── portfolio.db
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── main.js
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/ks1186561-cyber/portfolio.git
cd portfolio
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Open:

```text
http://localhost:5000
```

## 📡 API Endpoints

### Get All Projects

```http
GET /projects
```

### Add New Project

```http
POST /add_project
```

Example JSON:

```json
{
  "title": "Project Name",
  "description": "Project Description",
  "tech_stack": "Python, Flask",
  "github_url": "https://github.com/username/project",
  "live_url": "https://example.com"
}
```

## 🎯 Projects Included

### Online Voting System
A secure voting platform built using Python and Flask with voter authentication and vote management.

### Vote Gatekeeper Pro
An advanced voting system with access control, voter verification, and result integrity features.

### Personal Portfolio Website
A responsive portfolio website showcasing skills, projects, and professional information.

## 📚 Learning Outcomes

- Flask Web Development
- REST API Development
- SQLite Database Integration
- Frontend and Backend Integration
- Git and GitHub Workflow
- Deployment Fundamentals

## 👩‍💻 Author

**Kathi Shirisha**

Email: ks1186561@gmail.com

GitHub:
https://github.com/ks1186561-cyber

LinkedIn:
https://www.linkedin.com/in/kathi-shirisha-8697a4381

## ⭐ Acknowledgements

This project was developed as part of a Full Stack Development Internship to gain practical experience in building and deploying web applications.
