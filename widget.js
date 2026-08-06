(function () {
  const currentScript = document.currentScript;
  const repo = currentScript.getAttribute("data-repo") || "octocat/Hello-World";
  const theme = currentScript.getAttribute("data-theme") || "dark";
  const lang = currentScript.getAttribute("data-lang") || "en";

  const i18n = {
    en: { title: "Contributors", error: "Failed to load contributors." },
    es: { title: "Colaboradores", error: "Error al cargar colaboradores." },
    fr: { title: "Contributeurs", error: "Échec du chargement." },
    de: { title: "Mitwirkende", error: "Fehler beim Laden." }
  };

  const themes = {
    dark: { bg: "#0d1117", border: "#30363d", text: "#c9d1d9", headerBorder: "#21262d", badgeBg: "#21262d", badgeText: "#8b949e" },
    light: { bg: "#ffffff", border: "#d0d7de", text: "#24292f", headerBorder: "#d0d7de", badgeBg: "#afb8c133", badgeText: "#57606a" },
    dracula: { bg: "#282a36", border: "#6272a4", text: "#f8f8f2", headerBorder: "#44475a", badgeBg: "#44475a", badgeText: "#bd93f9" },
    nord: { bg: "#2e3440", border: "#4c566a", text: "#eceff4", headerBorder: "#3b4252", badgeBg: "#3b4252", badgeText: "#88c0d0" }
  };

  const t = i18n[lang] || i18n.en;
  const style = themes[theme] || themes.dark;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "width: 100%; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;";
  wrapper.innerHTML = `
    <style>
      .gh-widget-card {
        background-color: ${style.bg};
        border: 1px solid ${style.border};
        border-radius: 6px;
        padding: 16px;
        color: ${style.text};
      }
      .gh-widget-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 12px; padding-bottom: 8px;
        border-bottom: 1px solid ${style.headerBorder};
      }
      .gh-widget-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
      .gh-widget-badge {
        background-color: ${style.badgeBg}; color: ${style.badgeText};
        font-size: 12px; padding: 2px 8px; border-radius: 10px; border: 1px solid ${style.border};
      }
      .gh-widget-grid { display: flex; flex-wrap: wrap; gap: 8px; }
      .gh-widget-avatar-link { display: inline-block; transition: transform 0.15s ease; }
      .gh-widget-avatar-link:hover { transform: scale(1.15); }
      .gh-widget-avatar { width: 36px; height: 36px; border-radius: 50%; border: 1px solid ${style.border}; object-fit: cover; }
    </style>
    <div class="gh-widget-card">
      <div class="gh-widget-header">
        <div class="gh-widget-title">
          <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          ${t.title}
        </div>
        <span class="gh-widget-badge" id="gh-badge-count">...</span>
      </div>
      <div class="gh-widget-grid" id="gh-grid-avatars"></div>
    </div>
  `;

  currentScript.parentNode.insertBefore(wrapper, currentScript);

  const repoPath = repo.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const grid = wrapper.querySelector("#gh-grid-avatars");
  const badge = wrapper.querySelector("#gh-badge-count");

  async function loadContributors() {
    let page = 1;
    let allUsers = [];
    try {
      while (true) {
        const res = await fetch(`https://api.github.com/repos/${repoPath}/contributors?per_page=100&page=${page}`);
        if (!res.ok) break;
        const users = await res.json();
        if (!Array.isArray(users) || users.length === 0) break;
        allUsers = allUsers.concat(users);
        if (users.length < 100) break;
        page++;
      }
      badge.textContent = allUsers.length;
      grid.innerHTML = allUsers.map(u => `
        <a href="${u.html_url}" target="_blank" rel="noopener noreferrer" title="${u.login} (${u.contributions} commits)" class="gh-widget-avatar-link">
          <img src="${u.avatar_url}" alt="${u.login}" class="gh-widget-avatar" />
        </a>
      `).join("");
    } catch (err) {
      grid.innerHTML = `<span style="font-size: 12px; color: #ef4444;">${t.error}</span>`;
    }
  }

  loadContributors();
})();