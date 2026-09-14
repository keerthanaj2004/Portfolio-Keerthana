// Unified Data Store
// Manages local state, LocalStorage cache, and Firebase Firestore two-way real-time sync

const DATA_STORAGE_KEY = "keerthana_portfolio_content_v1";

class PortfolioStore {
  constructor() {
    this.subscribers = [];
    this.data = this.loadInitialData();
    this.broadcastChannel = null;

    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.broadcastChannel = new BroadcastChannel("keerthana_portfolio_sync");
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === "DATA_UPDATED") {
            this.data = event.data.payload;
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel not supported", e);
      }
    }

    // Listen to window storage events (cross-tab sync)
    window.addEventListener("storage", (e) => {
      if (e.key === DATA_STORAGE_KEY && e.newValue) {
        try {
          this.data = JSON.parse(e.newValue);
          this.notify(false);
        } catch (err) {
          console.error("Storage event parse error:", err);
        }
      }
    });

    // Initialize Firebase listener if configured
    this.initFirebaseSync();
  }

  loadInitialData() {
    try {
      const stored = localStorage.getItem(DATA_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with DEFAULT_PORTFOLIO_DATA to ensure any new schema fields are present
        return this.deepMerge(window.DEFAULT_PORTFOLIO_DATA || {}, parsed);
      }
    } catch (e) {
      console.warn("Error reading stored portfolio data", e);
    }
    const initial = window.DEFAULT_PORTFOLIO_DATA ? JSON.parse(JSON.stringify(window.DEFAULT_PORTFOLIO_DATA)) : {};
    this.persistLocal(initial);
    return initial;
  }

  deepMerge(target, source) {
    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  persistLocal(data) {
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist data locally", e);
    }
  }

  notify(broadcast = true) {
    this.subscribers.forEach((cb) => {
      try {
        cb(this.data);
      } catch (e) {
        console.error("Subscriber notification error:", e);
      }
    });

    if (broadcast && this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: "DATA_UPDATED",
        payload: this.data
      });
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    // Send immediate initial data
    callback(this.data);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== callback);
    };
  }

  get() {
    return JSON.parse(JSON.stringify(this.data));
  }

  // Save changes locally and push to Firebase if connected
  async commitChanges() {
    this.persistLocal(this.data);
    this.notify(true);

    if (window.firebaseManager && window.firebaseManager.isInitialized) {
      await window.firebaseManager.pushPortfolioData(this.data);
    }
  }

  async initFirebaseSync() {
    if (!window.firebaseManager) return;
    const res = await window.firebaseManager.init();
    if (res.success) {
      window.firebaseManager.listenToPortfolio((remoteData) => {
        if (remoteData && Object.keys(remoteData).length > 0) {
          this.data = this.deepMerge(this.data, remoteData);
          this.persistLocal(this.data);
          this.notify(false);
        }
      });
    }
  }

  // --- CRUD METHODS ---

  // Update Personal Info
  async updatePersonal(personalData) {
    this.data.personal = { ...this.data.personal, ...personalData };
    await this.commitChanges();
  }

  // Update Theme Palette
  async updateTheme(themeData) {
    this.data.theme = { ...(this.data.theme || {}), ...themeData };
    await this.commitChanges();
    return this.data.theme;
  }

  // Project operations
  async addProject(project) {
    if (!this.data.projects) this.data.projects = [];
    const newProj = {
      id: "proj-" + Date.now(),
      ...project
    };
    this.data.projects.unshift(newProj);
    await this.commitChanges();
    return newProj;
  }

  async updateProject(id, updated) {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.projects[idx] = { ...this.data.projects[idx], ...updated };
      await this.commitChanges();
      return true;
    }
    return false;
  }

  async deleteProject(id) {
    this.data.projects = (this.data.projects || []).filter((p) => p.id !== id);
    await this.commitChanges();
  }

  // Experience operations
  async addExperience(exp) {
    if (!this.data.experience) this.data.experience = [];
    const newExp = {
      id: "exp-" + Date.now(),
      ...exp
    };
    this.data.experience.unshift(newExp);
    await this.commitChanges();
    return newExp;
  }

  async updateExperience(id, updated) {
    const idx = this.data.experience.findIndex((e) => e.id === id);
    if (idx !== -1) {
      this.data.experience[idx] = { ...this.data.experience[idx], ...updated };
      await this.commitChanges();
      return true;
    }
    return false;
  }

  async deleteExperience(id) {
    this.data.experience = (this.data.experience || []).filter((e) => e.id !== id);
    await this.commitChanges();
  }

  // Skills operations
  async updateSkillsCategory(categoryName, skillsArray) {
    if (!this.data.skills) this.data.skills = {};
    this.data.skills[categoryName] = skillsArray;
    await this.commitChanges();
  }

  async deleteSkillsCategory(categoryName) {
    if (this.data.skills && this.data.skills[categoryName]) {
      delete this.data.skills[categoryName];
      await this.commitChanges();
    }
  }

  // Education operations
  async addEducation(edu) {
    if (!this.data.education) this.data.education = [];
    const newEdu = {
      id: "edu-" + Date.now(),
      ...edu
    };
    this.data.education.push(newEdu);
    await this.commitChanges();
    return newEdu;
  }

  async updateEducation(id, updated) {
    const idx = this.data.education.findIndex((e) => e.id === id);
    if (idx !== -1) {
      this.data.education[idx] = { ...this.data.education[idx], ...updated };
      await this.commitChanges();
      return true;
    }
    return false;
  }

  async deleteEducation(id) {
    this.data.education = (this.data.education || []).filter((e) => e.id !== id);
    await this.commitChanges();
  }

  // Achievements & Certifications operations
  async addAchievement(ach) {
    if (!this.data.achievements) this.data.achievements = [];
    const newAch = {
      id: "ach-" + Date.now(),
      ...ach
    };
    this.data.achievements.push(newAch);
    await this.commitChanges();
    return newAch;
  }

  async updateAchievement(id, updated) {
    const idx = this.data.achievements.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.data.achievements[idx] = { ...this.data.achievements[idx], ...updated };
      await this.commitChanges();
      return true;
    }
    return false;
  }

  async deleteAchievement(id) {
    this.data.achievements = (this.data.achievements || []).filter((a) => a.id !== id);
    await this.commitChanges();
  }

  // Blogs / Articles operations
  async addBlog(blog) {
    if (!this.data.blogs) this.data.blogs = [];
    const newBlog = {
      id: "blog-" + Date.now(),
      published: true,
      ...blog
    };
    this.data.blogs.unshift(newBlog);
    await this.commitChanges();
    return newBlog;
  }

  async updateBlog(id, updated) {
    const idx = this.data.blogs.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.data.blogs[idx] = { ...this.data.blogs[idx], ...updated };
      await this.commitChanges();
      return true;
    }
    return false;
  }

  async deleteBlog(id) {
    this.data.blogs = (this.data.blogs || []).filter((b) => b.id !== id);
    await this.commitChanges();
  }

  // Testimonials operations
  async addTestimonial(item) {
    if (!this.data.testimonials) this.data.testimonials = [];
    const newTest = {
      id: "test-" + Date.now(),
      ...item
    };
    this.data.testimonials.push(newTest);
    await this.commitChanges();
    return newTest;
  }

  async updateTestimonial(id, updated) {
    const idx = this.data.testimonials.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.data.testimonials[idx] = { ...this.data.testimonials[idx], ...updated };
      await this.commitChanges();
      return true;
    }
    return false;
  }

  async deleteTestimonial(id) {
    this.data.testimonials = (this.data.testimonials || []).filter((t) => t.id !== id);
    await this.commitChanges();
  }

  // Messages (Inquiries)
  async addMessage(msg) {
    if (!this.data.messages) this.data.messages = [];
    const newMsg = {
      id: "msg-" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      ...msg
    };
    this.data.messages.unshift(newMsg);
    await this.commitChanges();

    if (window.firebaseManager && window.firebaseManager.isInitialized) {
      await window.firebaseManager.pushContactMessage(newMsg);
    }
    return newMsg;
  }

  async deleteMessage(id) {
    this.data.messages = (this.data.messages || []).filter((m) => m.id !== id);
    await this.commitChanges();
  }

  // Reset to original default resume data
  async resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(window.DEFAULT_PORTFOLIO_DATA));
    await this.commitChanges();
  }

  // Export JSON backup
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  // Import JSON
  async importJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      this.data = parsed;
      await this.commitChanges();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

window.portfolioStore = new PortfolioStore();
