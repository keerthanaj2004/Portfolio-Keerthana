// Keerthana J - Dynamic Portfolio Application
// Subscribes to PortfolioStore for live two-way updates without needing code rebuilds

document.addEventListener("DOMContentLoaded", () => {
  // Setup Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Subscribe to store updates
  if (window.portfolioStore) {
    window.portfolioStore.subscribe((data) => {
      renderPortfolio(data);
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  const formAlert = document.getElementById("formAlert");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\"></i> Sending...";
      submitBtn.disabled = true;

      const messageObj = {
        name: document.getElementById("contactName")?.value || "Anonymous",
        email: document.getElementById("contactEmail")?.value || "",
        subject: document.getElementById("contactSubject")?.value || "Portfolio Inquiry",
        message: document.getElementById("contactMessage")?.value || ""
      };

      try {
        await window.portfolioStore.addMessage(messageObj);
        contactForm.reset();
        if (formAlert) {
          formAlert.textContent = "Thank you! Your message has been sent successfully. Keerthana will get back to you shortly.";
          formAlert.className = "form-alert success";
          setTimeout(() => {
            formAlert.style.display = "none";
          }, 6000);
        }
      } catch (err) {
        console.error("Failed to send message:", err);
        alert("Failed to submit message. Please try sending directly to jkeerthana2004@gmail.com.");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Initialize Responsive 3D Avatar Tilt
  initResponsiveAvatarTilt();
});

// Master Render Function
function renderPortfolio(data) {
  if (!data) return;

  if (data.theme) {
    applyTheme(data.theme);
  }

  renderHero(data.personal);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderSkills(data.skills);
  renderEducation(data.education);
  renderAchievements(data.achievements);
  renderBlogs(data.blogs);
  renderTestimonials(data.testimonials);
  renderContact(data.personal);
}

// Dynamic Theme Color Engine
function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;

  if (theme.primaryColor) {
    root.style.setProperty("--purple-primary", theme.primaryColor);
    root.style.setProperty("--purple-border", hexToRgba(theme.primaryColor, 0.2));
    root.style.setProperty("--purple-glow", hexToRgba(theme.primaryColor, 0.3));
    root.style.setProperty("--border-strong", hexToRgba(theme.primaryColor, 0.3));
  }
  if (theme.hoverColor) {
    root.style.setProperty("--purple-hover", theme.hoverColor);
  }
  if (theme.darkColor) {
    root.style.setProperty("--purple-dark", theme.darkColor);
  }
  if (theme.lightColor) {
    root.style.setProperty("--purple-light", theme.lightColor);
    root.style.setProperty("--purple-accent", theme.lightColor);
  }
  if (theme.softColor) {
    root.style.setProperty("--purple-soft", theme.softColor);
    root.style.setProperty("--bg-subtle", theme.softColor);
  }
  if (theme.bgBody) {
    root.style.setProperty("--bg-body", theme.bgBody);
    document.body.style.backgroundColor = theme.bgBody;
  }
  if (theme.bgCard) {
    root.style.setProperty("--bg-card", theme.bgCard);
  }

  // Generate smooth dynamic gradient
  const primary = theme.primaryColor || "#7C3AED";
  const light = theme.lightColor || theme.hoverColor || "#A855F7";
  root.style.setProperty("--gradient-purple", `linear-gradient(135deg, ${primary} 0%, ${light} 100%)`);
}

// Convert Hex to RGBA helper
function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith("#")) return `rgba(124, 58, 237, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

// Responsive 3D Parallax Tilt for Avatar
function initResponsiveAvatarTilt() {
  const wrapper = document.querySelector(".hero-card-wrapper");
  const visualArea = document.querySelector(".hero-visual");
  if (!wrapper || !visualArea) return;

  visualArea.addEventListener("mousemove", (e) => {
    const rect = visualArea.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -(y / (rect.height / 2)) * 10;
    const tiltY = (x / (rect.width / 2)) * 10;

    wrapper.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  visualArea.addEventListener("mouseleave", () => {
    wrapper.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });

  // Touch support for mobile devices
  visualArea.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      const rect = visualArea.getBoundingClientRect();
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;
      const tiltX = -(y / (rect.height / 2)) * 8;
      const tiltY = (x / (rect.width / 2)) * 8;
      wrapper.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    }
  }, { passive: true });

  visualArea.addEventListener("touchend", () => {
    wrapper.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
}

// 1. Hero & Personal Info
function renderHero(personal) {
  if (!personal) return;

  const heroName = document.getElementById("heroName");
  if (heroName) heroName.textContent = personal.name || "Keerthana J";

  const heroRole = document.getElementById("heroRole");
  if (heroRole) heroRole.textContent = personal.role || "Software Development Engineer (AI/ML)";

  const heroSubtitle = document.getElementById("heroSubtitle");
  if (heroSubtitle) heroSubtitle.textContent = personal.subtitle || "";

  const heroDescription = document.getElementById("heroDescription");
  if (heroDescription) heroDescription.textContent = personal.summary || "";

  const heroAvatar = document.getElementById("heroAvatar");
  if (heroAvatar && personal.avatar) {
    heroAvatar.src = personal.avatar;
    heroAvatar.alt = personal.name || "Keerthana J";
  }

  // Resume button
  const resumeBtn = document.getElementById("resumeDownloadBtn");
  if (resumeBtn) {
    if (personal.resumeUrl && personal.resumeUrl !== "#resume-modal") {
      resumeBtn.href = personal.resumeUrl;
      resumeBtn.target = "_blank";
    } else {
      resumeBtn.href = "#";
      resumeBtn.onclick = (e) => {
        e.preventDefault();
        openResumeModal();
      };
    }
  }

  // Social Links
  const linkedinLink = document.getElementById("heroLinkedin");
  if (linkedinLink && personal.linkedin) linkedinLink.href = personal.linkedin;

  const githubLink = document.getElementById("heroGithub");
  if (githubLink && personal.github) githubLink.href = personal.github;

  const emailLink = document.getElementById("heroEmail");
  if (emailLink && personal.email) emailLink.href = `mailto:${personal.email}`;

  // Quick stats
  const statsContainer = document.getElementById("quickStatsContainer");
  if (statsContainer && Array.isArray(personal.quickStats)) {
    statsContainer.innerHTML = personal.quickStats
      .map(
        (stat) => `
        <div class="stat-item">
          <div class="stat-number">${escapeHtml(stat.value)}</div>
          <div class="stat-label">${escapeHtml(stat.label)}</div>
        </div>
      `
      )
      .join("");
  }
}

// 2. Experience Timeline
function renderExperience(experiences) {
  const container = document.getElementById("experienceList");
  if (!container) return;

  if (!experiences || experiences.length === 0) {
    container.innerHTML = `<p class="text-muted">No experience entries recorded yet.</p>`;
    return;
  }

  container.innerHTML = experiences
    .map((exp) => {
      const techChips = (exp.technologies || [])
        .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
        .join("");

      const bulletItems = (exp.bullets || [])
        .map((b) => `<li>${escapeHtml(b)}</li>`)
        .join("");

      return `
      <div class="experience-card" id="${exp.id}">
        <div class="exp-header">
          <div>
            <h3 class="exp-role">${escapeHtml(exp.role)}</h3>
            <div class="exp-company-info">
              <i class="fa-solid fa-briefcase"></i>
              <span>${escapeHtml(exp.company)}</span>
              <span>•</span>
              <span>${escapeHtml(exp.location || "")}</span>
            </div>
          </div>
          <span class="exp-period-badge">
            <i class="fa-regular fa-calendar"></i>
            ${escapeHtml(exp.period)}
          </span>
        </div>

        <ul class="exp-bullets">
          ${bulletItems}
        </ul>

        <div class="exp-tech-stack">
          ${techChips}
        </div>
      </div>
    `;
    })
    .join("");
}

// 3. Projects Showcase
function renderProjects(projects) {
  const container = document.getElementById("projectsGrid");
  if (!container) return;

  if (!projects || projects.length === 0) {
    container.innerHTML = `<p class="text-muted">No projects added yet.</p>`;
    return;
  }

  container.innerHTML = projects
    .map((proj) => {
      const techChips = (proj.technologies || [])
        .slice(0, 6)
        .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
        .join("");

      return `
      <div class="project-card" id="${proj.id}">
        <div class="project-img-wrapper">
          <img src="${escapeHtml(proj.image || 'assets/observe_ai.jpg')}" alt="${escapeHtml(proj.title)}" class="project-img" onerror="this.src='assets/observe_ai.jpg'">
          <span class="project-category-badge">${escapeHtml(proj.category || 'AI Project')}</span>
        </div>
        <div class="project-body">
          <h3 class="project-title">${escapeHtml(proj.title)}</h3>
          <div class="project-tagline">${escapeHtml(proj.tagline || '')}</div>
          <p class="project-desc">${escapeHtml(proj.description || '')}</p>

          ${proj.metrics ? `<div class="project-metrics-highlight"><i class="fa-solid fa-chart-line"></i> ${escapeHtml(proj.metrics)}</div>` : ''}

          <div class="project-techs">
            ${techChips}
          </div>

          <div class="project-footer">
            <button class="btn btn-outline btn-sm" onclick="openProjectDetails('${proj.id}')">
              <i class="fa-solid fa-layer-group"></i> Architecture Details
            </button>
            <div class="project-links">
              ${proj.githubUrl ? `<a href="${escapeHtml(proj.githubUrl)}" target="_blank" class="project-link-btn" title="View Source Code"><i class="fa-brands fa-github"></i> Code</a>` : ''}
              ${proj.liveUrl && proj.liveUrl !== '#' ? `<a href="${escapeHtml(proj.liveUrl)}" target="_blank" class="project-link-btn" title="Live Application"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// 4. Skills Matrix
let activeSkillCategory = "ALL";
function renderSkills(skillsObj) {
  const filterNav = document.getElementById("skillsFilterNav");
  const grid = document.getElementById("skillsCategoriesGrid");
  if (!skillsObj || !grid) return;

  const categories = Object.keys(skillsObj);

  // Render filter buttons once or maintain active state
  if (filterNav) {
    const allCategories = ["ALL", ...categories];
    filterNav.innerHTML = allCategories
      .map(
        (cat) => `
        <button class="skill-tab-btn ${cat === activeSkillCategory ? 'active' : ''}" onclick="filterSkillsCategory('${escapeHtml(cat)}')">
          ${cat === 'ALL' ? '✦ All Skills' : escapeHtml(cat)}
        </button>
      `
      )
      .join("");
  }

  // Icons mapping for category cards
  const categoryIcons = {
    "Backend Development": "fa-solid fa-server",
    "AI & Machine Learning": "fa-solid fa-brain",
    "Databases & Messaging": "fa-solid fa-database",
    "Tools & Cloud": "fa-solid fa-cloud",
    "Core Computer Science": "fa-solid fa-microchip"
  };

  const displayedCategories = activeSkillCategory === "ALL" 
    ? categories 
    : categories.filter((c) => c === activeSkillCategory);

  grid.innerHTML = displayedCategories
    .map((cat) => {
      const chips = (skillsObj[cat] || [])
        .map((s) => `<span class="tech-tag">${escapeHtml(s)}</span>`)
        .join("");

      const iconClass = categoryIcons[cat] || "fa-solid fa-code";

      return `
      <div class="skill-category-card">
        <div class="skill-category-header">
          <div class="skill-cat-icon">
            <i class="${iconClass}"></i>
          </div>
          <h4 class="skill-cat-title">${escapeHtml(cat)}</h4>
        </div>
        <div class="skill-chips-group">
          ${chips}
        </div>
      </div>
    `;
    })
    .join("");
}

function filterSkillsCategory(category) {
  activeSkillCategory = category;
  const storeData = window.portfolioStore ? window.portfolioStore.get() : window.DEFAULT_PORTFOLIO_DATA;
  renderSkills(storeData.skills);
}
window.filterSkillsCategory = filterSkillsCategory;

// 5. Education
function renderEducation(educationList) {
  const container = document.getElementById("educationList");
  if (!container) return;

  if (!educationList || educationList.length === 0) {
    container.innerHTML = `<p class="text-muted">No education records added.</p>`;
    return;
  }

  container.innerHTML = educationList
    .map(
      (edu) => `
      <div class="info-item" id="${edu.id}">
        <div class="info-item-top">
          <h4 class="info-item-title">${escapeHtml(edu.degree)}</h4>
          <span class="info-item-score">${escapeHtml(edu.score || '')}</span>
        </div>
        <div class="info-item-sub">
          <strong>${escapeHtml(edu.institution)}</strong> • ${escapeHtml(edu.location || '')} (${escapeHtml(edu.period)})
        </div>
        ${edu.highlights ? `<p class="info-item-desc">${escapeHtml(edu.highlights)}</p>` : ''}
      </div>
    `
    )
    .join("");
}

// 6. Achievements & Certifications
function renderAchievements(achList) {
  const container = document.getElementById("achievementsList");
  if (!container) return;

  if (!achList || achList.length === 0) {
    container.innerHTML = `<p class="text-muted">No achievements recorded yet.</p>`;
    return;
  }

  container.innerHTML = achList
    .map(
      (ach) => `
      <div class="info-item" id="${ach.id}">
        <div class="info-item-top">
          <h4 class="info-item-title">
            <i class="${escapeHtml(ach.icon || 'fa-solid fa-award')}" style="color: var(--purple-primary); margin-right: 6px;"></i>
            ${escapeHtml(ach.title)}
          </h4>
          <span class="info-item-score">${escapeHtml(ach.year || '')}</span>
        </div>
        <div class="info-item-sub">
          <strong>${escapeHtml(ach.issuer || ach.category || '')}</strong>
        </div>
        ${ach.description ? `<p class="info-item-desc">${escapeHtml(ach.description)}</p>` : ''}
        ${ach.link && ach.link !== '#' ? `<a href="${escapeHtml(ach.link)}" target="_blank" class="project-link-btn" style="margin-top: 6px;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Verify / View Publication</a>` : ''}
      </div>
    `
    )
    .join("");
}

// 7. Scalable Blogs / Articles
function renderBlogs(blogs) {
  const container = document.getElementById("blogsGrid");
  const blogSection = document.getElementById("blogsSection");
  if (!container) return;

  if (!blogs || blogs.length === 0) {
    if (blogSection) blogSection.style.display = "none";
    return;
  }

  if (blogSection) blogSection.style.display = "block";
  container.innerHTML = blogs
    .map(
      (b) => `
      <div class="blog-card" id="${b.id}">
        <div class="blog-meta">
          <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(b.date || '')}</span>
          <span><i class="fa-regular fa-clock"></i> ${escapeHtml(b.readTime || '')}</span>
        </div>
        <h4 class="blog-title">${escapeHtml(b.title)}</h4>
        <p class="blog-summary">${escapeHtml(b.summary || '')}</p>
        <div>
          <span class="tech-tag">${escapeHtml(b.category || 'Tech')}</span>
        </div>
      </div>
    `
    )
    .join("");
}

// 8. Scalable Testimonials
function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonialsGrid");
  const testSection = document.getElementById("testimonialsSection");
  if (!container) return;

  if (!testimonials || testimonials.length === 0) {
    if (testSection) testSection.style.display = "none";
    return;
  }

  if (testSection) testSection.style.display = "block";
  container.innerHTML = testimonials
    .map(
      (t) => `
      <div class="testimonial-card" id="${t.id}">
        <p class="testimonial-quote">“${escapeHtml(t.quote)}”</p>
        <div class="testimonial-author-box">
          <div class="channel-icon-circle" style="width: 40px; height: 40px; font-size: 1rem;">
            <i class="fa-solid fa-quote-left"></i>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${escapeHtml(t.author)}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(t.role)} • ${escapeHtml(t.company || '')}</div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

// 9. Contact Details
function renderContact(personal) {
  if (!personal) return;

  const emailEl = document.getElementById("contactEmailDisplay");
  if (emailEl) {
    emailEl.textContent = personal.email || "";
    emailEl.parentElement.href = `mailto:${personal.email}`;
  }

  const phoneEl = document.getElementById("contactPhoneDisplay");
  if (phoneEl) {
    phoneEl.textContent = personal.phone || "";
    phoneEl.parentElement.href = `tel:${personal.phone}`;
  }

  const locationEl = document.getElementById("contactLocationDisplay");
  if (locationEl) {
    locationEl.textContent = personal.location || "";
  }
}

// Project Details Modal
function openProjectDetails(projectId) {
  const data = window.portfolioStore ? window.portfolioStore.get() : window.DEFAULT_PORTFOLIO_DATA;
  const project = (data.projects || []).find((p) => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("projectModal");
  const modalContent = document.getElementById("projectModalContent");
  if (!modal || !modalContent) return;

  const bulletsHtml = (project.bullets || [])
    .map((b) => `<li style="margin-bottom: 10px; line-height: 1.6;">${escapeHtml(b)}</li>`)
    .join("");

  const techChips = (project.technologies || [])
    .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
    .join("");

  modalContent.innerHTML = `
    <h2 style="font-size: 1.8rem; margin-bottom: 8px;">${escapeHtml(project.title)}</h2>
    <div style="color: var(--purple-primary); font-weight: 600; margin-bottom: 16px;">${escapeHtml(project.tagline || '')}</div>
    <img src="${escapeHtml(project.image || 'assets/observe_ai.jpg')}" alt="${escapeHtml(project.title)}" style="width: 100%; border-radius: 16px; margin-bottom: 20px; max-height: 320px; object-fit: cover;">
    
    <div style="margin-bottom: 20px;">
      <h4 style="margin-bottom: 8px;">Architecture & Implementation</h4>
      <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 14px;">${escapeHtml(project.description || '')}</p>
      <ul style="padding-left: 20px; color: var(--text-secondary);">
        ${bulletsHtml}
      </ul>
    </div>

    ${project.metrics ? `
      <div class="project-metrics-highlight" style="margin-bottom: 20px;">
        <strong>Key Impacts:</strong> ${escapeHtml(project.metrics)}
      </div>
    ` : ''}

    <div style="margin-bottom: 24px;">
      <h4 style="margin-bottom: 10px;">Tech Stack</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${techChips}
      </div>
    </div>

    <div style="display: flex; gap: 14px;">
      ${project.githubUrl ? `<a href="${escapeHtml(project.githubUrl)}" target="_blank" class="btn btn-primary btn-sm"><i class="fa-brands fa-github"></i> GitHub Repository</a>` : ''}
      ${project.liveUrl && project.liveUrl !== '#' ? `<a href="${escapeHtml(project.liveUrl)}" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
    </div>
  `;

  modal.classList.add("active");
}
window.openProjectDetails = openProjectDetails;

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal) modal.classList.remove("active");
}
window.closeProjectModal = closeProjectModal;

// Resume Viewer Modal
function openResumeModal() {
  const modal = document.getElementById("resumeModal");
  if (modal) modal.classList.add("active");
}
window.openResumeModal = openResumeModal;

function closeResumeModal() {
  const modal = document.getElementById("resumeModal");
  if (modal) modal.classList.remove("active");
}
window.closeResumeModal = closeResumeModal;

// Helper: Escape HTML
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
