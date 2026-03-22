(function() {
    let GITHUB_USERNAME = "Cookie-Cat21";

    async function initCalendar() {
        const data = await chrome.storage.sync.get(['username']);
        if (data.username) GITHUB_USERNAME = data.username;

        const widget = document.getElementById('commit-glow-widget');
        if (!widget) return;

        widget.innerHTML = `
            <div class="glow-widget-container">
                <div class="glow-header">
                    <span class="glow-dot"></span>
                    <span class="glow-username">${GITHUB_USERNAME}</span>
                </div>
                <div id="calendar-target" class="calendar">
                    <div class="loading-msg">Summoning...</div>
                </div>
            </div>
        `;

        const target = document.getElementById('calendar-target');
        if (typeof GitHubCalendar === 'function') {
            GitHubCalendar(target, GITHUB_USERNAME, {
                responsive: true,
                tooltips: true,
                global_stats: false, // We'll handle stats ourselves if needed
                proxy: (username) => fetch(`https://api.bloggify.net/gh-calendar/?username=${username}`).then(r => r.text())
            }).then(() => {
                // Post-processing to strip away library-level UI junk
                const junkSelectors = [
                    '.contrib-column',
                    '.text-gray',
                    '.float-left',
                    '.float-right',
                    'a[href*="github.com"]',
                    '.ContributionCalendar-label'
                ];
                
                junkSelectors.forEach(sel => {
                    target.querySelectorAll(sel).forEach(el => el.remove());
                });

                // Clean up the target container
                target.style.border = 'none';
                target.style.background = 'transparent';
                
                target.querySelector('.loading-msg')?.remove();
            }).catch(() => showFallback(target));
        } else {
            showFallback(target);
        }
    }

    function showFallback(target) {
        target.innerHTML = `<img src="https://ghchart.rshah.org/${GITHUB_USERNAME}" style="width:100%; border-radius:12px; opacity:0.8;" alt="GitHub Contributions">`;
    }

    // Initialize after a slight delay to ensure MYNT assets are ready
    setTimeout(initCalendar, 500);

})();
