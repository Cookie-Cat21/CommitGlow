(function() {
    let GITHUB_USERNAME = "Cookie-Cat21";

    // 1. Clock & Date Logic
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}`;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
    }

    // 2. Wallpaper Logic (Fetch a beautiful random forest/tech background)
    function setWallpaper() {
        const keywords = "forest,mist,nature,supercar,dark";
        const url = `https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1920`; // Default beautiful forest
        document.getElementById('bg-body').style.backgroundImage = `url('${url}')`;
        
        // Optional: Professional random pull
        // fetch(`https://source.unsplash.com/featured/1920x1080?${keywords}`)
        //    .then(res => document.getElementById('bg-body').style.backgroundImage = `url('${res.url}')`);
    }

    // 3. Stats Logic (Simulated Brave Stats)
    function updateStats() {
        // Since we can't access real Brave stats, we generate realistic ones based on time
        const startStats = { trackers: 12000, bandwidth: 1.2, time: 10 };
        const now = new Date();
        const daysSinceJan = now.getDate() + (now.getMonth() * 30);
        
        document.getElementById('stat-trackers').textContent = (startStats.trackers + (daysSinceJan * 42)).toLocaleString();
        document.getElementById('stat-bandwidth').textContent = (startStats.bandwidth + (daysSinceJan * 0.05)).toFixed(1) + " GB";
        document.getElementById('stat-time').textContent = (startStats.time + (daysSinceJan * 2)) + " min";
    }

    // 4. GitHub Calendar Logic
    async function initCalendar() {
        const data = await chrome.storage.sync.get(['username']);
        if (data.username) GITHUB_USERNAME = data.username;

        const widget = document.getElementById('commit-glow-widget');
        widget.innerHTML = `
            <div class="widget-container">
                <div class="widget-header">
                    <div class="title">CommitGlow: ${GITHUB_USERNAME}</div>
                </div>
                <div id="calendar-target" class="calendar">
                    <div class="loading-msg">Fetching glow...</div>
                </div>
            </div>
        `;

        const target = document.getElementById('calendar-target');
        if (typeof GitHubCalendar === 'function') {
            GitHubCalendar(target, GITHUB_USERNAME, {
                responsive: true,
                tooltips: true,
                global_stats: true,
                proxy: (username) => fetch(`https://api.bloggify.net/gh-calendar/?username=${username}`).then(r => r.text())
            }).then(() => {
                target.querySelector('.loading-msg')?.remove();
            }).catch(() => showFallback(target));
        } else {
            showFallback(target);
        }
    }

    function showFallback(target) {
        target.innerHTML = `<img src="https://ghchart.rshah.org/${GITHUB_USERNAME}" class="fallback-img" alt="GitHub Contributions">`;
    }

    // Run Everything
    updateClock();
    setWallpaper();
    updateStats();
    initCalendar();
    setInterval(updateClock, 1000);

})();
