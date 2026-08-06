
(async function () {
  // 1. Locate current script tag to extract configuration attributes
  const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).pop();
const repo = currentScript.getAttribute("data-repo") || "octocat/Hello-World";
const theme = currentScript.getAttribute("data-theme") || "dark";
const lang = currentScript.getAttribute("data-lang") || "en";

  // 2. Localization map for top bar text
const i18n = {
    en: { title: "Contributors", error: "Failed to load contributors." },
    es: { title: "Colaboradores", error: "Error al cargar colaboradores." },
    fr: { title: "Contributeurs", error: "Échec du chargement." },
    de: { title: "Mitwirkende", error: "Fehler beim Laden." }
    en: { title: "Contributors", viewRepo: "View Repository" },
    es: { title: "Colaboradores", viewRepo: "Ver Repositorio" },
    fr: { title: "Contributeurs", viewRepo: "Voir le Dépôt" },
    de: { title: "Mitwirkende", viewRepo: "Repository Anzeigen" },
    it: { title: "Contribuenti", viewRepo: "Vedi Repository" },
    ja: { title: "貢献者", viewRepo: "リポジトリを表示" },
    ko: { title: "기여 자", viewRepo: "리포지토리 보기" },
    "zh-CN": { title: "贡献者", viewRepo: "查看代码库" },
    "zh-TW": { title: "貢獻者", viewRepo: "檢視儲存庫" },
    pt: { title: "Contribuidores", viewRepo: "Ver Repositório" },
    ru: { title: "Участники", viewRepo: "Просмотреть репозиторий" }
};

  const labels = i18n[lang] || i18n.en;

  // 3. Create host container
  const container = document.createElement("div");
  container.className = "gitcontrib-widget-root";
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    border: 1px solid #30363d;
    border-radius: 6px;
    background-color: #0d1117;
    color: #c9d1d9;
    overflow: hidden;
    max-width: 100%;
    box-sizing: border-box;
  `;

  // Apply light theme adjustments if requested
  const isLight = theme.toLowerCase().includes("light") || theme === "noborder_light" || theme === "gruvbox_light" || theme === "catppuccin_latte";
  if (isLight) {
    container.style.backgroundColor = "#ffffff";
    container.style.color = "#24292f";
    container.style.borderColor = "#d0d7de";
  }

  // Inject widget structure including the top bar and View Repository button
  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid ${isLight ? '#d0d7de' : '#30363d'}; background-color: ${isLight ? '#f6f8fa' : '#161b22'};">
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style="opacity: 0.8;">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
        <span style="font-weight: 600; font-size: 13px;">${labels.title}</span>
        <span id="gitcontrib-count" style="font-size: 11px; padding: 2px 7px; border-radius: 12px; font-family: monospace; background-color: ${isLight ? '#afb8c133' : '#6e768166'};">...</span>
     </div>

      <a 
        href="https://github.com/${repo}" 
        target="_blank" 
        rel="noopener noreferrer" 
        style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; color: ${isLight ? '#0969da' : '#58a6ff'}; text-decoration: none;"
        onmouseover="this.style.textDecoration='underline'"
        onmouseout="this.style.textDecoration='none'"
      >
        <span>${labels.viewRepo}</span>
        <svg height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-2.19l4.72 4.72a.75.75 0 1 1-1.06 1.06L4 4.56v2.19a.75.75 0 0 1-1.5 0v-3.5C2.5 2.336 2.836 2 3.25 2ZM2 6c0-.552.448-1 1-1h1a.75.75 0 0 1 0 1.5H3v6.5h6.5v-1a.75.75 0 0 1 1.5 0v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6Z"></path>
        </svg>
      </a>
    </div>

    <div id="gitcontrib-list" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 14px;">
      <span style="font-size: 12px; opacity: 0.6;">Loading contributors...</span>
   </div>
 `;


  // Insert script inline relative to current element
  currentScript.parentNode.insertBefore(container, currentScript.nextSibling);

  // 4. Fetch GitHub API Contributor Data
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=30`);
    if (!response.ok) throw new Error("Failed to fetch repository data");

    const contributors = await response.json();
    const countBadge = container.querySelector("#gitcontrib-count");
    const listContainer = container.querySelector("#gitcontrib-list");

  const repoPath = repo.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const grid = wrapper.querySelector("#gh-grid-avatars");
  const badge = wrapper.querySelector("#gh-badge-count");
    countBadge.textContent = contributors.length;
    listContainer.innerHTML = "";

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
    contributors.forEach(user => {
      const avatarLink = document.createElement("a");
      avatarLink.href = user.html_url;
      avatarLink.target = "_blank";
      avatarLink.rel = "noopener noreferrer";
      avatarLink.title = `${user.login} (${user.contributions} contributions)`;
      avatarLink.style.display = "inline-block";

      const img = document.createElement("img");
      img.src = user.avatar_url;
      img.alt = user.login;
      img.width = 36;
      img.height = 36;
      img.style.cssText = "border-radius: 50%; border: 1px solid transparent; transition: transform 0.15s ease;";
      img.onmouseover = () => { img.style.transform = "scale(1.15)"; };
      img.onmouseout = () => { img.style.transform = "scale(1)"; };

      avatarLink.appendChild(img);
      listContainer.appendChild(avatarLink);
    });
  } catch (err) {
    const listContainer = container.querySelector("#gitcontrib-list");
    if (listContainer) {
      listContainer.innerHTML = `<span style="font-size: 12px; color: #f85149;">Failed to load contributors for ${repo}</span>`;
}
}

  loadContributors();
})();=