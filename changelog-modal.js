/**
 * Makka Live Bot Dashboard - Changelog Modal Controller
 * Modeled on b1t-Acad changelog modal architecture
 */

const CHANGELOG_DATA_FALLBACK = {
  currentVersion: "v2.0.1",
  lastUpdated: "October 2026",
  documentationUrl: "doc/DOCUMENTATION.md",
  history: [
    {
      version: "v2.0.1",
      badge: "Latest",
      date: "02.10.26",
      changes: [
        {
          type: "Fix & Stability",
          title: "Quran Radio Pause & Resume Stream Resilience",
          description: "Engineered intelligent pause and resume tracking with PCM byte-accurate timestamp persistence and -ss fast-forward seeking fallback when remote CDN connections reset."
        },
        {
          type: "Fix & Architecture",
          title: "Recursive Playback Loop & Queue Burnout Protection",
          "description": "Added strict voice connection validation in play_next to prevent rapid queue emptying and infinite auto-refill loops when disconnected."
        },
        {
          type: "Enhancement",
          title: "Self-Healing Channel Join & Cleaner Radio Logging",
          description": "Improved !join to handle existing connections and channel switching gracefully without client errors, and suppressed benign 404 logs during radio refill."
        }
      ]
    },
    {
      version: "v2.0.0",
      badge: "Major",
      date: "30.09.26",
      changes: [
        {
          type: "Major & Architecture",
          title: "Pure Quran Foundation API Streaming Architecture",
          description: "Pivoted audio playback entirely to high-fidelity direct MP3 streaming from the Quran Foundation API. Deprecated legacy YouTube playback commands (!play, !play live, !haram) due to YouTube anti-bot verification barriers."
        },
        {
          type: "Feature & UI/UX",
          title: "Interactive What's New Changelog Modal",
          description: "Integrated a dynamic release changelog modal with offline fallback data, tag-based change pills, expandable version history accordion, and a floating desktop trigger button."
        },
        {
          type: "Docs & Standards",
          title: "AGENTS.md & Repository Guidelines Standardization",
          description: "Standardized prompt archiving, dual-write planning documents, and automated history synchronization across the backend and frontend repositories."
        }
      ]
    },
    {
      version: "v1.9.2",
      badge: "Fix & Security",
      date: "17.07.26",
      changes: [
        {
          type: "Fix",
          title: "Standalone PyNaCl Voice Libraries Bundling",
          description: "Fixed voice connection errors in standalone desktop executables by packaging native sodium binaries and cryptography modules."
        },
        {
          type: "Security",
          title: "Expanded Halal/Haram Keyword Verification",
          description: "Broadened content verification filters with extensive Arabic script and topic recognition, enforcing case-insensitive checks."
        }
      ]
    },
    {
      version: "v1.9.1",
      badge: "Security",
      date: "17.07.26",
      changes: [
        {
          type: "Security",
          title: "Mandatory Discord DAVE Protocol (E2EE Voice)",
          description: "Upgraded voice engine to discord.py v2.7.0 with native Dave encryption support, eliminating WebSocket 4017 disconnect codes."
        }
      ]
    },
    {
      version: "v1.9.0",
      badge: "Feature",
      date: "17.07.26",
      changes: [
        {
          type: "New Feature",
          title: "Non-Stop Quran Radio Mode (!quran radio)",
          description: "Introduced automated, continuous randomized Surah queueing for unending community listening without stream disruption."
        },
        {
          type: "Enhancement",
          title: "Byte-Accurate Stream State Failover Transfer",
          description: "Embedded PCM byte stream tracking into Master heartbeats, allowing Standby instances to fast-forward directly to the exact second of disconnection upon failover."
        }
      ]
    },
    {
      version: "v1.8.1",
      date: "16.07.26",
      changes: [
        {
          type: "Fix",
          title: "Full-Surah Pagination Retrieval",
          description: "Increased verses-per-page query limits up to 286 verses to ensure complete playback for long chapters like Surah Al-Baqarah."
        }
      ]
    },
    {
      version: "v1.8.0",
      badge: "Feature",
      date: "16.07.26",
      changes: [
        {
          type: "New Feature",
          title: "Android Termux Support & 3-Column Surah List",
          description: "Added ARM64 Linux launcher script for Termux and optimized !surah output into clean 3-column messages."
        }
      ]
    },
    {
      version: "v1.5.0",
      badge: "Feature",
      date: "14.07.26",
      changes: [
        {
          type: "New Feature",
          title: "Quran Foundation API Interactive Navigation",
          description: "Integrated interactive Discord UI buttons for flipping through verse translations and playing recitation audio inline."
        }
      ]
    },
    {
      version: "v1.0.0",
      date: "12.07.26",
      changes: [
        {
          type: "Initial Release",
          title: "Makka Live Bot & Web Dashboard Launch",
          description: "Initial release of the Discord audio streaming engine and companion web control dashboard."
        }
      ]
    }
  ]
};

const ChangelogModal = {
  storageKey: "makka_live_last_version",
  data: null,

  /**
   * Initialize modal bindings and check version
   */
  async init() {
    this.setupEventListeners();
    await this.checkAndShowChangelog(false);
  },

  /**
   * Update all changelog badge pills with the active version string
   */
  updateBadgePills(version) {
    if (!version) return;
    const pills = document.querySelectorAll(".changelog-badge-pill");
    pills.forEach((pill) => {
      pill.textContent = version;
    });
  },

  /**
   * Fetch changes.json with timestamp bust and static fallback
   */
  async fetchChanges() {
    if (this.data) return this.data;
    try {
      const response = await fetch("changes.json?t=" + Date.now());
      if (response && response.ok) {
        this.data = await response.json();
        return this.data;
      }
    } catch (error) {
      console.info("[ChangelogModal] fetch failed or blocked (file:// protocol), using fallback dataset");
    }
    this.data = CHANGELOG_DATA_FALLBACK;
    return this.data;
  },

  /**
   * Check if current version is newer than last seen version, or force open
   */
  async checkAndShowChangelog(forceOpen = false) {
    const data = await this.fetchChanges();
    if (!data) return;

    const lastSeenVersion = localStorage.getItem(this.storageKey);
    const currentVersion = data.currentVersion || "v2.0.0";

    if (forceOpen || !lastSeenVersion || lastSeenVersion !== currentVersion) {
      this.render(data);
      this.open();
    }
  },

  /**
   * Render changelog data into modal DOM
   */
  render(data) {
    const titleBadge = document.getElementById("changelog-version-badge");
    const bodyEl = document.getElementById("changelog-modal-body");

    if (titleBadge) {
      titleBadge.textContent = data.currentVersion || "Latest";
    }
    this.updateBadgePills(data.currentVersion);

    if (!bodyEl) return;

    const history = data.history || [];
    if (history.length === 0) {
      bodyEl.innerHTML = '<p style="text-align: center; color: var(--text-dim);">No changelog details available.</p>';
      return;
    }

    const latest = history[0];
    const olderVersions = history.slice(1);

    let html = `
      <div class="changelog-version-section">
        <div class="changelog-version-header">
          <div class="changelog-version-title">
            <span>Version ${this.escapeHtml(latest.version)}</span>
            <span class="changelog-tag ${this.getTagClass(latest.badge || "Latest")}">${this.escapeHtml(latest.badge || "Latest")}</span>
          </div>
          <span class="changelog-date">${this.escapeHtml(latest.date || "")}</span>
        </div>
        <div class="changelog-items-list">
          ${(latest.changes || []).map(change => `
            <div class="changelog-item">
              <div class="changelog-item-title-row">
                <span class="changelog-tag ${this.getTagClass(change.type)}">${this.escapeHtml(change.type || "Update")}</span>
                <span class="changelog-item-title">${this.escapeHtml(change.title || "")}</span>
              </div>
              <p class="changelog-item-desc">${this.escapeHtml(change.description || "")}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    // Render older versions accordion if available
    if (olderVersions.length > 0) {
      html += `
        <button id="changelog-history-toggle" class="changelog-history-toggle" type="button" aria-expanded="false">
          <span><i class="fa-solid fa-clock-rotate-left"></i> View Earlier Updates (${olderVersions.length} versions)</span>
          <i class="fa-solid fa-chevron-down changelog-chevron"></i>
        </button>
        <div id="changelog-history-list" class="changelog-history-list">
          ${olderVersions.map(ver => `
            <div class="changelog-history-item">
              <div class="changelog-history-header">
                <div class="changelog-history-version">
                  <span>${this.escapeHtml(ver.version)}</span>
                  ${ver.badge ? `<span class="changelog-tag ${this.getTagClass(ver.badge)}">${this.escapeHtml(ver.badge)}</span>` : ""}
                </div>
                <span class="changelog-date">${this.escapeHtml(ver.date || "")}</span>
              </div>
              <div class="changelog-items-list">
                ${(ver.changes || []).map(change => `
                  <div class="changelog-item">
                    <div class="changelog-item-title-row">
                      <span class="changelog-tag ${this.getTagClass(change.type)}">${this.escapeHtml(change.type || "Update")}</span>
                      <span class="changelog-item-title">${this.escapeHtml(change.title || "")}</span>
                    </div>
                    <p class="changelog-item-desc">${this.escapeHtml(change.description || "")}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    bodyEl.innerHTML = html;

    // Attach accordion toggle listener
    const historyToggle = document.getElementById("changelog-history-toggle");
    const historyList = document.getElementById("changelog-history-list");
    if (historyToggle && historyList) {
      historyToggle.addEventListener("click", () => {
        const isOpen = historyList.classList.toggle("open");
        historyToggle.classList.toggle("active", isOpen);
        historyToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    // Attach doc viewer click if within dashboard doc system
    const docLink = document.getElementById("changelog-doc-link");
    if (docLink && typeof window.loadDoc === "function" && typeof window.toggleDocView === "function") {
      docLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.close();
        window.toggleDocView(true);
        window.loadDoc("doc/DOCUMENTATION.md");
      });
    }
  },

  /**
   * Helper to get CSS class for a change badge/tag
   */
  getTagClass(type) {
    if (!type) return "enhancement";
    const lower = type.toLowerCase();
    if (lower.includes("feature")) return "new-feature";
    if (lower.includes("fix") || lower.includes("bug")) return "fix";
    if (lower.includes("security")) return "security";
    if (lower.includes("major")) return "major";
    if (lower.includes("ui") || lower.includes("ux")) return "ui-ux";
    if (lower.includes("refactor")) return "refactor";
    if (lower.includes("doc")) return "docs";
    return "enhancement";
  },

  /**
   * Basic HTML escaping for safe rendering
   */
  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  /**
   * Setup modal event listeners with robust global delegation
   */
  setupEventListeners() {
    const handleDismiss = () => {
      this.close();
      if (this.data && this.data.currentVersion) {
        localStorage.setItem(this.storageKey, this.data.currentVersion);
      }
    };

    // Global click delegation for all triggers & modal actions
    document.addEventListener("click", (e) => {
      // 1. Check if clicking a changelog trigger button / link
      const trigger = e.target.closest("#view-changelog-link, #desktop-changelog-btn, .view-changelog-btn, [data-open-changelog]");
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        this.checkAndShowChangelog(true);
        return;
      }

      // 2. Check if clicking close / got it buttons
      const closeBtn = e.target.closest("#close-changelog-modal, #changelog-modal-got-it-btn");
      if (closeBtn) {
        e.preventDefault();
        handleDismiss();
        return;
      }

      // 3. Backdrop dismiss
      const modal = document.getElementById("changelog-modal");
      if (modal && e.target === modal) {
        handleDismiss();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById("changelog-modal");
      if (e.key === "Escape" && modal && modal.style.display !== "none") {
        handleDismiss();
      }
    });
  },

  /**
   * Open the Changelog Modal
   */
  open() {
    const modal = document.getElementById("changelog-modal");
    if (modal) {
      modal.style.setProperty("display", "flex", "important");
      document.body.style.overflow = "hidden";
    }
  },

  /**
   * Close the Changelog Modal
   */
  close() {
    const modal = document.getElementById("changelog-modal");
    if (modal) {
      modal.style.setProperty("display", "none", "important");
      document.body.style.overflow = "";
    }
  }
};

// Export to window for accessibility sitewide
window.ChangelogModal = ChangelogModal;

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    ChangelogModal.init();
  });
} else {
  ChangelogModal.init();
}
