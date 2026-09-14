// Keerthana J - CMS Admin Management Engine
// Handles authentication, live CRUD modifications, and Firebase configuration

const ADMIN_SESSION_KEY = "keerthana_admin_auth_token";
const MASTER_PASSCODE = "keerthana2026";

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initSidebarTabs();
  loadAllAdminData();

  // Listen to store updates to keep admin UI in sync
  if (window.portfolioStore) {
    window.portfolioStore.subscribe(() => {
      loadAllAdminData();
    });
  }
});

// --- AUTHENTICATION (Direct Access, No Password Required) ---
function initAuth() {
  const authOverlay = document.getElementById("authOverlay");
  const adminLayout = document.getElementById("adminLayout");

  if (authOverlay) authOverlay.style.display = "none";
  if (adminLayout) adminLayout.style.display = "flex";

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> <span>Reset Cache</span>';
    logoutBtn.addEventListener("click", () => {
      showToast("Session refreshed!");
      window.location.reload();
    });
  }
}

// --- TAB NAVIGATION ---
function initSidebarTabs() {
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const tabId = link.getAttribute("data-tab");
      if (tabId) switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".sidebar-link").forEach((l) => l.classList.remove("active"));
  const activeLink = document.querySelector(`.sidebar-link[data-tab="${tabId}"]`);
  if (activeLink) activeLink.classList.add("active");

  document.querySelectorAll(".admin-tab-content").forEach((c) => (c.style.display = "none"));
  const targetContent = document.getElementById(tabId);
  if (targetContent) targetContent.style.display = "block";

  // Update Topbar Heading
  const titles = {
    "tab-overview": "Dashboard Overview",
    "tab-theme": "Theme & Color Palette Customizer",
    "tab-personal": "Hero & Personal Details",
    "tab-experience": "Manage Work Experience",
    "tab-projects": "Manage Projects Showcase",
    "tab-skills": "Skills Matrix & Technologies",
    "tab-education": "Education & Certifications",
    "tab-scalable": "Scalable Modules (Blogs & Testimonials)",
    "tab-inquiries": "Visitor Inquiries & Messages",
    "tab-firebase": "Firebase Cloud & Backup Settings"
  };
  const heading = document.getElementById("adminSectionHeading");
  if (heading && titles[tabId]) heading.textContent = titles[tabId];
}
window.switchTab = switchTab;

// --- LOAD ALL DATA INTO ADMIN FORMS & TABLES ---
function loadAllAdminData() {
  if (!window.portfolioStore) return;
  const data = window.portfolioStore.get();
  if (!data) return;

  // 1. Overview stats
  const statExp = document.getElementById("statExpCount");
  if (statExp) statExp.textContent = (data.experience || []).length;

  const statProj = document.getElementById("statProjCount");
  if (statProj) statProj.textContent = (data.projects || []).length;

  const statSkill = document.getElementById("statSkillCount");
  if (statSkill) statSkill.textContent = Object.keys(data.skills || {}).length;

  const statAch = document.getElementById("statAchCount");
  if (statAch) statAch.textContent = (data.achievements || []).length;

  const statMsg = document.getElementById("statMsgCount");
  if (statMsg) statMsg.textContent = (data.messages || []).length;

  // 2. Personal Form
  if (data.personal) {
    setInputValue("p_name", data.personal.name);
    setInputValue("p_role", data.personal.role);
    setInputValue("p_subtitle", data.personal.subtitle);
    setInputValue("p_location", data.personal.location);
    setInputValue("p_email", data.personal.email);
    setInputValue("p_phone", data.personal.phone);
    setInputValue("p_linkedin", data.personal.linkedin);
    setInputValue("p_github", data.personal.github);
    setInputValue("p_avatar", data.personal.avatar);
    setInputValue("p_summary", data.personal.summary);
    setInputValue("p_resumeUrl", data.personal.resumeUrl);
  }

  // 3. Render Tables
  renderExperienceTable(data.experience || []);
  renderProjectsTable(data.projects || []);
  renderSkillsManager(data.skills || {});
  renderEducationTable(data.education || []);
  renderAchievementsTable(data.achievements || []);
  renderBlogsTable(data.blogs || []);
  renderTestimonialsTable(data.testimonials || []);
  renderInquiriesTable(data.messages || []);

  // 4. Firebase Config Form
  if (window.firebaseManager) {
    const cfg = window.firebaseManager.loadConfig();
    const chk = document.getElementById("fb_enabled");
    if (chk) chk.checked = !!cfg.enabled;
    setInputValue("fb_apiKey", cfg.apiKey);
    setInputValue("fb_authDomain", cfg.authDomain);
    setInputValue("fb_projectId", cfg.projectId);
    setInputValue("fb_storageBucket", cfg.storageBucket);
    setInputValue("fb_messagingSenderId", cfg.messagingSenderId);
    setInputValue("fb_appId", cfg.appId);

    const badge = document.getElementById("syncBadge");
    if (badge) {
      if (cfg.enabled && cfg.projectId) {
        badge.className = "sync-status-badge live";
        badge.innerHTML = `<span class="pulse-dot"></span><span>Firebase Live Sync Active</span>`;
      } else {
        badge.className = "sync-status-badge local";
        badge.innerHTML = `<span class="pulse-dot"></span><span>Local Storage Active</span>`;
      }
    }
  }

  // 5. Theme Customizer Form
  if (data.theme) {
    const t = data.theme;
    setInputValue("th_primary", t.primaryColor || "#7C3AED");
    setInputValue("th_hover", t.hoverColor || "#6D28D9");
    setInputValue("th_dark", t.darkColor || "#4C1D95");
    setInputValue("th_light", t.lightColor || "#A855F7");
    setInputValue("th_soft", t.softColor || "#F3E8FF");
    setInputValue("th_bgBody", t.bgBody || "#FAF8FF");
    setInputValue("th_bgCard", t.bgCard || "#FFFFFF");

    setInputValue("th_primary_picker", t.primaryColor || "#7C3AED");
    setInputValue("th_hover_picker", t.hoverColor || "#6D28D9");
    setInputValue("th_light_picker", t.lightColor || "#A855F7");
    setInputValue("th_soft_picker", t.softColor || "#F3E8FF");
    setInputValue("th_bgBody_picker", t.bgBody || "#FAF8FF");
    setInputValue("th_bgCard_picker", t.bgCard || "#FFFFFF");

    updateLiveAdminPreview(t);
  }
}

// --- THEME CUSTOMIZER LOGIC & PRESETS ---
const THEME_PRESETS = {
  "purple-white": {
    primaryColor: "#7C3AED",
    hoverColor: "#6D28D9",
    darkColor: "#4C1D95",
    lightColor: "#A855F7",
    softColor: "#F3E8FF",
    bgBody: "#FAF8FF",
    bgCard: "#FFFFFF",
    preset: "purple-white"
  },
  "midnight-purple": {
    primaryColor: "#9333EA",
    hoverColor: "#7E22CE",
    darkColor: "#3B0764",
    lightColor: "#C084FC",
    softColor: "#2E1065",
    bgBody: "#0F0A1C",
    bgCard: "#18112C",
    preset: "midnight-purple"
  },
  "ocean-blue": {
    primaryColor: "#0284C7",
    hoverColor: "#0369A1",
    darkColor: "#075985",
    lightColor: "#38BDF8",
    softColor: "#E0F2FE",
    bgBody: "#F8FAFC",
    bgCard: "#FFFFFF",
    preset: "ocean-blue"
  },
  "cyber-emerald": {
    primaryColor: "#059669",
    hoverColor: "#047857",
    darkColor: "#065F46",
    lightColor: "#34D399",
    softColor: "#D1FAE5",
    bgBody: "#F0FDF4",
    bgCard: "#FFFFFF",
    preset: "cyber-emerald"
  },
  "crimson-rose": {
    primaryColor: "#E11D48",
    hoverColor: "#BE123C",
    darkColor: "#9F1239",
    lightColor: "#FB7185",
    softColor: "#FFE4E6",
    bgBody: "#FFF1F2",
    bgCard: "#FFFFFF",
    preset: "crimson-rose"
  },
  "electric-indigo": {
    primaryColor: "#4F46E5",
    hoverColor: "#4338CA",
    darkColor: "#312E81",
    lightColor: "#818CF8",
    softColor: "#EEF2FF",
    bgBody: "#F8FAFC",
    bgCard: "#FFFFFF",
    preset: "electric-indigo"
  },
  "sunset-amber": {
    primaryColor: "#D97706",
    hoverColor: "#B45309",
    darkColor: "#92400E",
    lightColor: "#FBBF24",
    softColor: "#FEF3C7",
    bgBody: "#FFFBEB",
    bgCard: "#FFFFFF",
    preset: "sunset-amber"
  }
};

function applyThemePreset(presetKey) {
  const preset = THEME_PRESETS[presetKey];
  if (!preset) return;

  setInputValue("th_primary", preset.primaryColor);
  setInputValue("th_hover", preset.hoverColor);
  setInputValue("th_dark", preset.darkColor);
  setInputValue("th_light", preset.lightColor);
  setInputValue("th_soft", preset.softColor);
  setInputValue("th_bgBody", preset.bgBody);
  setInputValue("th_bgCard", preset.bgCard);

  setInputValue("th_primary_picker", preset.primaryColor);
  setInputValue("th_hover_picker", preset.hoverColor);
  setInputValue("th_light_picker", preset.lightColor);
  setInputValue("th_soft_picker", preset.softColor);
  setInputValue("th_bgBody_picker", preset.bgBody);
  setInputValue("th_bgCard_picker", preset.bgCard);

  updateLiveAdminPreview(preset);
  showToast(`Loaded "${presetKey}"! Click "Apply & Save Theme" to activate.`);
}
window.applyThemePreset = applyThemePreset;

function syncColorInput(inputId, val) {
  setInputValue(inputId, val);
  triggerCurrentPreview();
}
window.syncColorInput = syncColorInput;

function syncColorPicker(pickerId, val) {
  if (val && val.startsWith("#") && (val.length === 4 || val.length === 7)) {
    setInputValue(pickerId, val);
    triggerCurrentPreview();
  }
}
window.syncColorPicker = syncColorPicker;

function triggerCurrentPreview() {
  const currentTheme = {
    primaryColor: document.getElementById("th_primary")?.value || "#7C3AED",
    hoverColor: document.getElementById("th_hover")?.value || "#6D28D9",
    darkColor: document.getElementById("th_dark")?.value || "#4C1D95",
    lightColor: document.getElementById("th_light")?.value || "#A855F7",
    softColor: document.getElementById("th_soft")?.value || "#F3E8FF",
    bgBody: document.getElementById("th_bgBody")?.value || "#FAF8FF",
    bgCard: document.getElementById("th_bgCard")?.value || "#FFFFFF"
  };
  updateLiveAdminPreview(currentTheme);
}

function updateLiveAdminPreview(t) {
  const previewBox = document.getElementById("themePreviewBox");
  const primaryBtn = document.getElementById("previewBtnPrimary");
  const secBtn = document.getElementById("previewBtnSecondary");
  const tag1 = document.getElementById("previewTag1");
  const tag2 = document.getElementById("previewTag2");
  const heading = document.getElementById("previewText");

  if (previewBox && t) {
    previewBox.style.backgroundColor = t.bgCard || "#FFFFFF";
    previewBox.style.borderColor = t.primaryColor ? `${t.primaryColor}44` : "#EBE5F7";
  }

  if (primaryBtn && t.primaryColor) {
    primaryBtn.style.background = `linear-gradient(135deg, ${t.primaryColor} 0%, ${t.lightColor || t.primaryColor} 100%)`;
    primaryBtn.style.color = "#FFFFFF";
    primaryBtn.style.borderColor = "transparent";
  }

  if (secBtn && t.softColor) {
    secBtn.style.background = t.softColor;
    secBtn.style.color = t.primaryColor || "#7C3AED";
    secBtn.style.borderColor = t.primaryColor || "#7C3AED";
  }

  if (tag1 && t.softColor) {
    tag1.style.background = t.softColor;
    tag1.style.color = t.darkColor || t.primaryColor || "#7C3AED";
    tag1.style.borderColor = t.primaryColor ? `${t.primaryColor}33` : "transparent";
  }

  if (tag2 && t.softColor) {
    tag2.style.background = t.softColor;
    tag2.style.color = t.darkColor || t.primaryColor || "#7C3AED";
    tag2.style.borderColor = t.primaryColor ? `${t.primaryColor}33` : "transparent";
  }

  if (heading && t.primaryColor) {
    heading.style.color = t.primaryColor;
  }
}

async function saveThemeCustomizer() {
  const themeObj = {
    primaryColor: document.getElementById("th_primary")?.value?.trim() || "#7C3AED",
    hoverColor: document.getElementById("th_hover")?.value?.trim() || "#6D28D9",
    darkColor: document.getElementById("th_dark")?.value?.trim() || "#4C1D95",
    lightColor: document.getElementById("th_light")?.value?.trim() || "#A855F7",
    softColor: document.getElementById("th_soft")?.value?.trim() || "#F3E8FF",
    bgBody: document.getElementById("th_bgBody")?.value?.trim() || "#FAF8FF",
    bgCard: document.getElementById("th_bgCard")?.value?.trim() || "#FFFFFF",
    updatedAt: new Date().toISOString()
  };

  await window.portfolioStore.updateTheme(themeObj);
  showToast("Theme palette applied & saved! Changes live on portfolio & Firebase.");
}
window.saveThemeCustomizer = saveThemeCustomizer;

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

// --- SAVE PERSONAL FORM ---
async function savePersonalForm() {
  const personalData = {
    name: document.getElementById("p_name")?.value,
    role: document.getElementById("p_role")?.value,
    subtitle: document.getElementById("p_subtitle")?.value,
    location: document.getElementById("p_location")?.value,
    email: document.getElementById("p_email")?.value,
    phone: document.getElementById("p_phone")?.value,
    linkedin: document.getElementById("p_linkedin")?.value,
    github: document.getElementById("p_github")?.value,
    avatar: document.getElementById("p_avatar")?.value || "assets/avatar.jpg",
    summary: document.getElementById("p_summary")?.value,
    resumeUrl: document.getElementById("p_resumeUrl")?.value || "#resume-modal"
  };

  await window.portfolioStore.updatePersonal(personalData);
  showToast("Profile & Hero details updated successfully!");
}
window.savePersonalForm = savePersonalForm;

// --- WORK EXPERIENCE CRUD ---
function renderExperienceTable(list) {
  const container = document.getElementById("adminExpTableContainer");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No experience entries found.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Role</th>
          <th>Company</th>
          <th>Period</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (item) => `
          <tr>
            <td><strong>${escapeHtml(item.role)}</strong></td>
            <td>${escapeHtml(item.company)}</td>
            <td>${escapeHtml(item.period)}</td>
            <td>
              <div class="action-btn-group">
                <button class="action-btn edit" onclick="editExperience('${item.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="action-btn delete" onclick="deleteExperience('${item.id}')"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function saveExperienceForm() {
  const id = document.getElementById("exp_id")?.value;
  const role = document.getElementById("exp_role")?.value;
  const company = document.getElementById("exp_company")?.value;
  const location = document.getElementById("exp_location")?.value;
  const period = document.getElementById("exp_period")?.value;
  const techStr = document.getElementById("exp_tech")?.value || "";
  const bulletsStr = document.getElementById("exp_bullets")?.value || "";

  if (!role || !company || !period) {
    alert("Please fill in the required fields (Role, Company, Period).");
    return;
  }

  const expObj = {
    role,
    company,
    location,
    period,
    technologies: techStr.split(",").map((s) => s.trim()).filter(Boolean),
    bullets: bulletsStr.split("\n").map((s) => s.trim()).filter(Boolean)
  };

  if (id) {
    await window.portfolioStore.updateExperience(id, expObj);
    showToast("Experience entry updated!");
  } else {
    await window.portfolioStore.addExperience(expObj);
    showToast("New experience added!");
  }

  // Clear form
  document.getElementById("experienceForm")?.reset();
  document.getElementById("exp_id").value = "";
  const heading = document.getElementById("expFormHeading");
  if (heading) heading.textContent = "Add Work Experience";
}
window.saveExperienceForm = saveExperienceForm;

function editExperience(id) {
  const data = window.portfolioStore.get();
  const item = (data.experience || []).find((e) => e.id === id);
  if (!item) return;

  setInputValue("exp_id", item.id);
  setInputValue("exp_role", item.role);
  setInputValue("exp_company", item.company);
  setInputValue("exp_location", item.location);
  setInputValue("exp_period", item.period);
  setInputValue("exp_tech", (item.technologies || []).join(", "));
  setInputValue("exp_bullets", (item.bullets || []).join("\n"));

  const heading = document.getElementById("expFormHeading");
  if (heading) heading.textContent = "Edit Work Experience";

  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.editExperience = editExperience;

async function deleteExperience(id) {
  if (confirm("Are you sure you want to delete this experience entry?")) {
    await window.portfolioStore.deleteExperience(id);
    showToast("Experience entry removed.");
  }
}
window.deleteExperience = deleteExperience;

// --- PROJECTS CRUD ---
function renderProjectsTable(list) {
  const container = document.getElementById("adminProjTableContainer");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No projects yet.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Project</th>
          <th>Category</th>
          <th>Key Metrics</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (item) => `
          <tr>
            <td>
              <div style="font-weight: 700;">${escapeHtml(item.title)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(item.tagline || "")}</div>
            </td>
            <td><span class="tech-tag">${escapeHtml(item.category || "General")}</span></td>
            <td><small>${escapeHtml(item.metrics || "-")}</small></td>
            <td>
              <div class="action-btn-group">
                <button class="action-btn edit" onclick="editProject('${item.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="action-btn delete" onclick="deleteProject('${item.id}')"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function saveProjectForm() {
  const id = document.getElementById("proj_id")?.value;
  const title = document.getElementById("proj_title")?.value;
  const category = document.getElementById("proj_category")?.value;
  const tagline = document.getElementById("proj_tagline")?.value;
  const metrics = document.getElementById("proj_metrics")?.value;
  const githubUrl = document.getElementById("proj_github")?.value;
  const liveUrl = document.getElementById("proj_live")?.value;
  const image = document.getElementById("proj_image")?.value || "assets/observe_ai.jpg";
  const techStr = document.getElementById("proj_tech")?.value || "";
  const desc = document.getElementById("proj_desc")?.value || "";
  const bulletsStr = document.getElementById("proj_bullets")?.value || "";

  if (!title || !category) {
    alert("Please provide Project Title and Category.");
    return;
  }

  const projObj = {
    title,
    category,
    tagline,
    metrics,
    githubUrl,
    liveUrl,
    image,
    description: desc,
    technologies: techStr.split(",").map((s) => s.trim()).filter(Boolean),
    bullets: bulletsStr.split("\n").map((s) => s.trim()).filter(Boolean)
  };

  if (id) {
    await window.portfolioStore.updateProject(id, projObj);
    showToast("Project details updated!");
  } else {
    await window.portfolioStore.addProject(projObj);
    showToast("New project published!");
  }

  document.getElementById("projectForm")?.reset();
  document.getElementById("proj_id").value = "";
  const heading = document.getElementById("projFormHeading");
  if (heading) heading.textContent = "Add Project";
}
window.saveProjectForm = saveProjectForm;

function editProject(id) {
  const data = window.portfolioStore.get();
  const item = (data.projects || []).find((p) => p.id === id);
  if (!item) return;

  setInputValue("proj_id", item.id);
  setInputValue("proj_title", item.title);
  setInputValue("proj_category", item.category);
  setInputValue("proj_tagline", item.tagline);
  setInputValue("proj_metrics", item.metrics);
  setInputValue("proj_github", item.githubUrl);
  setInputValue("proj_live", item.liveUrl);
  setInputValue("proj_image", item.image);
  setInputValue("proj_tech", (item.technologies || []).join(", "));
  setInputValue("proj_desc", item.description);
  setInputValue("proj_bullets", (item.bullets || []).join("\n"));

  const heading = document.getElementById("projFormHeading");
  if (heading) heading.textContent = "Edit Project";

  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.editProject = editProject;

async function deleteProject(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    await window.portfolioStore.deleteProject(id);
    showToast("Project deleted.");
  }
}
window.deleteProject = deleteProject;

// --- SKILLS CRUD ---
function renderSkillsManager(skillsObj) {
  const container = document.getElementById("adminSkillsContainer");
  if (!container) return;

  const categories = Object.keys(skillsObj);
  if (categories.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No skills found.</p>`;
    return;
  }

  container.innerHTML = categories
    .map(
      (cat) => `
      <div style="background: #FAF8FF; border: 1px solid var(--border-subtle); border-radius: 14px; padding: 18px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="font-weight: 700; color: var(--purple-dark);">${escapeHtml(cat)}</h4>
          <div class="action-btn-group">
            <button class="action-btn edit" onclick="editSkillCategory('${escapeHtml(cat)}')"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="action-btn delete" onclick="deleteSkillCategory('${escapeHtml(cat)}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${(skillsObj[cat] || []).map((s) => `<span class="tech-tag">${escapeHtml(s)}</span>`).join("")}
        </div>
      </div>
    `
    )
    .join("");
}

async function saveSkillsForm() {
  const catName = document.getElementById("skill_cat_name")?.value?.trim();
  const listStr = document.getElementById("skill_list")?.value || "";

  if (!catName || !listStr) {
    alert("Please provide both a Category Name and comma-separated Skills.");
    return;
  }

  const skillsArr = listStr.split(",").map((s) => s.trim()).filter(Boolean);
  await window.portfolioStore.updateSkillsCategory(catName, skillsArr);
  showToast(`Skills category "${catName}" saved!`);

  document.getElementById("skillsForm")?.reset();
}
window.saveSkillsForm = saveSkillsForm;

function editSkillCategory(catName) {
  const data = window.portfolioStore.get();
  const skills = data.skills?.[catName] || [];

  setInputValue("skill_cat_name", catName);
  setInputValue("skill_list", skills.join(", "));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.editSkillCategory = editSkillCategory;

async function deleteSkillCategory(catName) {
  if (confirm(`Delete skill category "${catName}"?`)) {
    await window.portfolioStore.deleteSkillsCategory(catName);
    showToast(`Deleted "${catName}".`);
  }
}
window.deleteSkillCategory = deleteSkillCategory;

// --- EDUCATION & ACHIEVEMENTS CRUD ---
function renderEducationTable(list) {
  const container = document.getElementById("adminEduListContainer");
  if (!container) return;

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Degree</th>
          <th>Institution</th>
          <th>Score</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (e) => `
          <tr>
            <td><strong>${escapeHtml(e.degree)}</strong></td>
            <td>${escapeHtml(e.institution)}</td>
            <td>${escapeHtml(e.score || "")}</td>
            <td>
              <button class="action-btn delete" onclick="deleteEducation('${e.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function saveEducationForm() {
  const degree = document.getElementById("edu_degree")?.value;
  const institution = document.getElementById("edu_institution")?.value;
  const location = document.getElementById("edu_location")?.value;
  const period = document.getElementById("edu_period")?.value;
  const score = document.getElementById("edu_score")?.value;
  const highlights = document.getElementById("edu_highlights")?.value;

  if (!degree || !institution) {
    alert("Please fill Degree and Institution.");
    return;
  }

  await window.portfolioStore.addEducation({
    degree,
    institution,
    location,
    period,
    score,
    highlights
  });

  document.getElementById("educationForm")?.reset();
  showToast("Education record added!");
}
window.saveEducationForm = saveEducationForm;

async function deleteEducation(id) {
  if (confirm("Delete this education entry?")) {
    await window.portfolioStore.deleteEducation(id);
    showToast("Education deleted.");
  }
}
window.deleteEducation = deleteEducation;

function renderAchievementsTable(list) {
  const container = document.getElementById("adminAchListContainer");
  if (!container) return;

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Issuer / Category</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (a) => `
          <tr>
            <td><strong>${escapeHtml(a.title)}</strong></td>
            <td>${escapeHtml(a.issuer || a.category)}</td>
            <td>${escapeHtml(a.year || "")}</td>
            <td>
              <button class="action-btn delete" onclick="deleteAchievement('${a.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function saveAchievementForm() {
  const title = document.getElementById("ach_title")?.value;
  const category = document.getElementById("ach_category")?.value;
  const issuer = document.getElementById("ach_issuer")?.value;
  const year = document.getElementById("ach_year")?.value;
  const link = document.getElementById("ach_link")?.value;
  const icon = document.getElementById("ach_icon")?.value || "fa-solid fa-award";
  const desc = document.getElementById("ach_desc")?.value;

  if (!title) {
    alert("Please enter title.");
    return;
  }

  await window.portfolioStore.addAchievement({
    title,
    category,
    issuer,
    year,
    link,
    icon,
    description: desc
  });

  document.getElementById("achievementForm")?.reset();
  showToast("Achievement / Certification added!");
}
window.saveAchievementForm = saveAchievementForm;

async function deleteAchievement(id) {
  if (confirm("Delete this achievement?")) {
    await window.portfolioStore.deleteAchievement(id);
    showToast("Achievement removed.");
  }
}
window.deleteAchievement = deleteAchievement;

// --- BLOGS & TESTIMONIALS CRUD (SCALABILITY) ---
function renderBlogsTable(list) {
  const container = document.getElementById("adminBlogListContainer");
  if (!container) return;

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Article Title</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (b) => `
          <tr>
            <td><strong>${escapeHtml(b.title)}</strong></td>
            <td>${escapeHtml(b.date || "")}</td>
            <td>
              <button class="action-btn delete" onclick="deleteBlog('${b.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function saveBlogForm() {
  const title = document.getElementById("blog_title")?.value;
  const category = document.getElementById("blog_category")?.value;
  const date = document.getElementById("blog_date")?.value;
  const readTime = document.getElementById("blog_readTime")?.value;
  const summary = document.getElementById("blog_summary")?.value;

  if (!title) {
    alert("Please provide an article title.");
    return;
  }

  await window.portfolioStore.addBlog({
    title,
    category,
    date,
    readTime,
    summary,
    link: "#"
  });

  document.getElementById("blogForm")?.reset();
  showToast("Article published to portfolio!");
}
window.saveBlogForm = saveBlogForm;

async function deleteBlog(id) {
  if (confirm("Delete this article?")) {
    await window.portfolioStore.deleteBlog(id);
    showToast("Article removed.");
  }
}
window.deleteBlog = deleteBlog;

function renderTestimonialsTable(list) {
  const container = document.getElementById("adminTestimonialListContainer");
  if (!container) return;

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Author</th>
          <th>Quote</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (t) => `
          <tr>
            <td><strong>${escapeHtml(t.author)}</strong><br><small>${escapeHtml(t.role || "")}</small></td>
            <td><small>“${escapeHtml(t.quote.substring(0, 80))}...”</small></td>
            <td>
              <button class="action-btn delete" onclick="deleteTestimonial('${t.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function saveTestimonialForm() {
  const author = document.getElementById("test_author")?.value;
  const role = document.getElementById("test_role")?.value;
  const quote = document.getElementById("test_quote")?.value;

  if (!author || !quote) {
    alert("Author and quote are required.");
    return;
  }

  await window.portfolioStore.addTestimonial({
    author,
    role,
    quote
  });

  document.getElementById("testimonialForm")?.reset();
  showToast("Testimonial added!");
}
window.saveTestimonialForm = saveTestimonialForm;

async function deleteTestimonial(id) {
  if (confirm("Delete this testimonial?")) {
    await window.portfolioStore.deleteTestimonial(id);
    showToast("Testimonial deleted.");
  }
}
window.deleteTestimonial = deleteTestimonial;

// --- INQUIRIES & MESSAGES TABLE ---
function renderInquiriesTable(messages) {
  const container = document.getElementById("inquiriesTableContainer");
  const countBadge = document.getElementById("inquiriesCountBadge");
  if (countBadge) countBadge.textContent = `${messages.length} message${messages.length === 1 ? '' : 's'}`;
  if (!container) return;

  if (messages.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); padding: 20px 0;">No visitor inquiries received yet. Any messages submitted through the contact form will appear here!</p>`;
    return;
  }

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Sender</th>
          <th>Subject &amp; Message</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${messages
          .map(
            (m) => `
          <tr>
            <td>
              <strong>${escapeHtml(m.name)}</strong><br>
              <a href="mailto:${escapeHtml(m.email)}" style="font-size: 0.82rem; color: var(--purple-primary);">${escapeHtml(m.email)}</a>
            </td>
            <td>
              <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(m.subject || "No Subject")}</div>
              <div style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">${escapeHtml(m.message)}</div>
            </td>
            <td><small>${escapeHtml(m.date || "Recently")}</small></td>
            <td>
              <button class="action-btn delete" onclick="deleteMessage('${m.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function deleteMessage(id) {
  if (confirm("Delete this inquiry?")) {
    await window.portfolioStore.deleteMessage(id);
    showToast("Message removed.");
  }
}
window.deleteMessage = deleteMessage;

// --- FIREBASE CONFIGURATION & BACKUPS ---
async function saveFirebaseConfig() {
  const enabled = document.getElementById("fb_enabled")?.checked;
  const apiKey = document.getElementById("fb_apiKey")?.value?.trim();
  const authDomain = document.getElementById("fb_authDomain")?.value?.trim();
  const projectId = document.getElementById("fb_projectId")?.value?.trim();
  const storageBucket = document.getElementById("fb_storageBucket")?.value?.trim();
  const messagingSenderId = document.getElementById("fb_messagingSenderId")?.value?.trim();
  const appId = document.getElementById("fb_appId")?.value?.trim();

  const newConfig = {
    enabled,
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
  };

  const result = await window.firebaseManager.saveConfig(newConfig);
  if (result.success) {
    showToast("Firebase Cloud connected successfully!");
    // Push current portfolio data up to cloud
    await window.portfolioStore.commitChanges();
  } else {
    showToast(result.message || "Firebase configuration saved.");
  }
  loadAllAdminData();
}
window.saveFirebaseConfig = saveFirebaseConfig;

function exportDataBackup() {
  const jsonStr = window.portfolioStore.exportJSON();
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `keerthana_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Portfolio JSON backup downloaded!");
}
window.exportDataBackup = exportDataBackup;

function importDataBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const content = e.target.result;
    const res = await window.portfolioStore.importJSON(content);
    if (res.success) {
      showToast("Data imported successfully!");
      loadAllAdminData();
    } else {
      alert("Error importing JSON: " + res.error);
    }
  };
  reader.readAsText(file);
}
window.importDataBackup = importDataBackup;

async function confirmResetDefaults() {
  if (confirm("Are you sure you want to reset all data back to the original resume details? Any custom additions will be reverted.")) {
    await window.portfolioStore.resetToDefaults();
    showToast("Reset to resume defaults!");
    loadAllAdminData();
  }
}
window.confirmResetDefaults = confirmResetDefaults;

// Helper: Toast message
function showToast(msg) {
  const toast = document.getElementById("adminToast");
  const msgEl = document.getElementById("toastMessage");
  if (toast && msgEl) {
    msgEl.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }
}

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
