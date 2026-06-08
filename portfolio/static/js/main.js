/* ============================================================
   main.js — Portfolio JavaScript
   Responsibilities:
     1. Navbar scroll shadow + hamburger menu
     2. Scroll-reveal via IntersectionObserver
     3. Skill bar animation
     4. Fetch projects from GET /projects and render cards
     5. Submit new project via POST /add_project
     6. Footer year auto-update
   ============================================================ */

"use strict";

/* ── 1. NAVBAR ──────────────────────────────────────────────── */

const navbar     = document.getElementById("navbar");
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

// Add a subtle shadow when the user scrolls down
window.addEventListener("scroll", () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? "0 4px 30px rgba(0,0,0,0.5)"
    : "none";
});

// Toggle mobile drawer
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// Close the mobile menu — called by onclick in HTML anchors
function closeMobile() {
  mobileMenu.classList.remove("open");
}

/* ── 2. SCROLL REVEAL ───────────────────────────────────────── */

// All elements with .fade-in animate into view as they enter the viewport
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // only trigger once
      }
    });
  },
  { threshold: 0.12 }   // trigger when 12 % of the element is visible
);

document.querySelectorAll(".fade-in").forEach((el) => revealObserver.observe(el));

/* ── 3. SKILL BARS ──────────────────────────────────────────── */

// Animate the skill bar fills when the skills section scrolls into view
const skillSection = document.getElementById("skills");

const skillObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll(".skill-fill").forEach((bar) => {
        const level = bar.dataset.level || 0;
        // Set width via style — CSS transition handles the animation
        bar.style.width = level + "%";
      });
      skillObserver.unobserve(skillSection); // fire once
    }
  },
  { threshold: 0.3 }
);

if (skillSection) skillObserver.observe(skillSection);

/* ── 4. LOAD PROJECTS  (GET /projects) ──────────────────────── */

/**
 * Fetches all projects from the Flask API and renders them as cards.
 * Shows a loading spinner while the request is pending.
 */
async function loadProjects() {
  const loading = document.getElementById("projects-loading");
  const grid    = document.getElementById("projects-grid");
  const error   = document.getElementById("projects-error");

  try {
    const response = await fetch("/projects");

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data     = await response.json();
    const projects = data.projects || [];

    // Hide spinner
    loading.style.display = "none";

    if (projects.length === 0) {
      grid.innerHTML = `<p style="color:var(--text-muted)">No projects yet. Add one below!</p>`;
    } else {
      // Build HTML for every project card
      grid.innerHTML = projects
        .map((proj, idx) => buildProjectCard(proj, idx))
        .join("");
    }

    grid.style.display = "grid";

  } catch (err) {
    console.error("Failed to load projects:", err);
    loading.style.display = "none";
    error.style.display   = "block";
  }
}

/**
 * Builds the HTML string for a single project card.
 * @param {Object} proj  - Project object from the API
 * @param {number} idx   - Zero-based index (used for animation delay)
 * @returns {string} HTML markup
 */
function buildProjectCard(proj, idx) {
  // Split comma-separated tech stack into individual tag badges
  const tags = proj.tech_stack
    .split(",")
    .map((t) => `<span class="tech-tag">${t.trim()}</span>`)
    .join("");

  // Build GitHub / Live links only when URLs are provided
  const githubLink = proj.github_url
    ? `<a class="proj-link" href="${proj.github_url}" target="_blank" rel="noopener">⌥ GitHub</a>`
    : "";

  const liveLink = proj.live_url
    ? `<a class="proj-link" href="${proj.live_url}" target="_blank" rel="noopener">↗ Live</a>`
    : "";

  // Use inline animation-delay so cards stagger into view
  return `
    <div class="project-card" style="animation-delay:${idx * 0.08}s">
      <p class="project-number">P${String(idx + 1).padStart(2, "0")}</p>
      <h3>${escapeHtml(proj.title)}</h3>
      <p>${escapeHtml(proj.description)}</p>
      <div class="tech-tags">${tags}</div>
      <div class="project-links">${githubLink}${liveLink}</div>
    </div>
  `;
}

/* ── 5. ADD PROJECT  (POST /add_project) ────────────────────── */

/** Toggles the visibility of the add-project form */
function toggleForm() {
  const form = document.getElementById("addProjectForm");
  const btn  = document.getElementById("toggleFormBtn");

  const isHidden = form.style.display === "none";
  form.style.display = isHidden ? "block" : "none";
  btn.textContent    = isHidden ? "✕ Cancel" : "+ Add a Project";

  // Clear any lingering feedback message
  document.getElementById("form-msg").textContent = "";
  document.getElementById("form-msg").className   = "form-msg";
}

/**
 * Reads the form values, validates them, then POSTs to /add_project.
 * On success, the projects grid is reloaded to include the new entry.
 */
async function submitProject() {
  const msg = document.getElementById("form-msg");

  const payload = {
    title:       document.getElementById("proj-title").value.trim(),
    description: document.getElementById("proj-desc").value.trim(),
    tech_stack:  document.getElementById("proj-tech").value.trim(),
    github_url:  document.getElementById("proj-github").value.trim(),
    live_url:    document.getElementById("proj-live").value.trim(),
  };

  // Client-side validation before hitting the server
  if (!payload.title || !payload.description || !payload.tech_stack) {
    msg.textContent = "⚠ Please fill in the required fields (Title, Description, Tech Stack).";
    msg.className   = "form-msg error";
    return;
  }

  msg.textContent = "Saving…";
  msg.className   = "form-msg";

  try {
    const response = await fetch("/add_project", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    // Success — give feedback, clear form, reload grid
    msg.textContent = "✓ Project added successfully!";
    msg.className   = "form-msg success";

    // Clear inputs
    ["proj-title", "proj-desc", "proj-tech", "proj-github", "proj-live"].forEach(
      (id) => (document.getElementById(id).value = "")
    );

    // Reload the projects grid with the new data
    await loadProjects();

    // Auto-close form after short delay
    setTimeout(toggleForm, 1500);

  } catch (err) {
    console.error("Error adding project:", err);
    msg.textContent = `✕ Error: ${err.message}`;
    msg.className   = "form-msg error";
  }
}

/* ── 6. FOOTER YEAR ─────────────────────────────────────────── */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── HELPERS ────────────────────────────────────────────────── */

/**
 * Escapes HTML special characters to prevent XSS when injecting
 * API data directly into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ── INIT ───────────────────────────────────────────────────── */
// Load projects as soon as the DOM is ready
document.addEventListener("DOMContentLoaded", loadProjects);
