let overlay;

function createOverlay() {
    if (overlay) return; // Prevent creating multiple overlays
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.color = 'white';
    overlay.style.fontSize = '24px';
    overlay.innerHTML = `
    <p>Time's up!</p>
    <p>It's time to go back to work.</p>
    <button id="leaveButton" style="margin-top: 20px; padding: 10px 20px; font-size: 18px;">Leave Facebook</button>
  `;
    document.body.appendChild(overlay);

    document.getElementById('leaveButton').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "leaveFacebook" });
    });
}

function checkTimeSpent() {
    chrome.storage.sync.get(['timeLimit', 'startTime'], (result) => {
        const currentTime = Date.now();
        const startTime = result.startTime || currentTime;
        const timeSpent = (currentTime - startTime) / 60000; // Convert to minutes

        if (timeSpent >= result.timeLimit) {
            createOverlay();
        } else {
            // Schedule the next check
            setTimeout(checkTimeSpent, 60000); // Check every minute
        }

        // Update the start time if it hasn't been set
        if (!result.startTime) {
            chrome.storage.sync.set({ startTime: startTime });
        }
    });
}

// Start checking time spent
checkTimeSpent();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showOverlay") {
        createOverlay();
    }
});
