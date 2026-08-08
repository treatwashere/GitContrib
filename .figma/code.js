figma.showUI(__html__, { width: 440, height: 560 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-repo' || msg.repo) {
    const repo = msg.repo || "treatwashere/GitContrib";
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=100&anon=true`);
      if (!response.ok) throw new Error("Failed to fetch repository contributors");
      const contributors = await response.json();

      const widgetFrame = figma.createFrame();
      widgetFrame.name = `Contributors (${repo})`;
      widgetFrame.resize(420, 260);
      widgetFrame.fills = [{ type: 'SOLID', color: { r: 0.05, g: 0.065, b: 0.09 } }];
      widgetFrame.cornerRadius = 8;

      let x = 14;
      let y = 14;
      const avatarSize = 36;
      const gap = 8;
      const maxColumns = 8;
      let col = 0;

      for (const user of contributors) {
        if (!user.avatar_url) continue;

        const avatar = figma.createEllipse();
        avatar.resize(avatarSize, avatarSize);
        avatar.x = x;
        avatar.y = y;
        avatar.name = user.login || "Anonymous";

        try {
          const imgResponse = await fetch(user.avatar_url);
          const arrayBuffer = await imgResponse.arrayBuffer();
          const imageHash = figma.createImage(new Uint8Array(arrayBuffer)).hash;

          avatar.fills = [{
            type: 'IMAGE',
            scaleMode: 'FILL',
            imageHash: imageHash
          }];
        } catch (e) {
          // Fallback fill if image fetch fails
          avatar.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
        }

        widgetFrame.appendChild(avatar);

        col++;
        if (col >= maxColumns) {
          col = 0;
          x = 14;
          y += avatarSize + gap;
        } else {
          x += avatarSize + gap;
        }
      }

      figma.viewport.scrollAndZoomIntoView([widgetFrame]);
      figma.notify(`Imported contributors for ${repo}!`);
    } catch (err) {
      figma.notify(`Error: ${err.message}`, { error: true });
    }
  }
};