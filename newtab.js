(function() {
    let GITHUB_USERNAME = "Cookie-Cat21";

    async function init() {
        const data = await chrome.storage.sync.get(['username']);
        if (data.username) GITHUB_USERNAME = data.username;

        const widget = document.getElementById('commit-glow-widget');
        
        // Create the widget structure inside the page (simulating the Shadow DOM container)
        widget.innerHTML = `
            <div class="widget-container" style="position: fixed; bottom: 20px; right: 20px;">
                <div class="widget-header">
                    <div class="title">CommitGlow: ${GITHUB_USERNAME}</div>
                </div>
                <div id="calendar-target" class="calendar">
                    <div class="loading-msg">Fetching glow...</div>
                </div>
            </div>
        `;

        const target = document.getElementById('calendar-target');
        
        try {
            if (typeof GitHubCalendar === 'function') {
                GitHubCalendar(target, GITHUB_USERNAME, {
                    responsive: true,
                    tooltips: true,
                    global_stats: true,
                    proxy: (username) => {
                        return fetch(`https://api.bloggify.net/gh-calendar/?username=${username}`)
                            .then(r => r.text());
                    }
                }).then(() => {
                    target.querySelector('.loading-msg')?.remove();
                }).catch(err => {
                    console.error("GitHubCalendar load error:", err);
                    showFallback(target);
                });
            } else {
                showFallback(target);
            }
        } catch (e) {
            showFallback(target);
        }
    }

    function showFallback(target) {
        target.innerHTML = `
            <img src="https://ghchart.rshah.org/${GITHUB_USERNAME}" style="width:100%; border-radius:6px; filter: brightness(0.8);" alt="GitHub Contributions">
            <div style="font-size:10px; color:#8b949e; text-align:center; margin-top:4px;">Static fallback active.</div>
        `;
    }

    init();
})();
