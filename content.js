let overlay;
let lastActivityTime = Date.now();
let isActive = false;

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
    <p>⏰</p>
    <p>It's time to go back to work.</p>
    <button id="leaveButton" style="margin-top: 20px; padding: 10px 20px; font-size: 18px;">Leave Facebook</button>
  `;
    document.body.appendChild(overlay);

    document.getElementById('leaveButton').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "leaveFacebook" });
    });
}

function updateActiveState() {
    const currentTime = Date.now();
    if (currentTime - lastActivityTime < 60000) { // 1 minute of inactivity
        if (!isActive) {
            isActive = true;
            chrome.runtime.sendMessage({ action: "setActive", isActive: true });
        }
    } else {
        if (isActive) {
            isActive = false;
            chrome.runtime.sendMessage({ action: "setActive", isActive: false });
        }
    }
}

// Event listeners for user activity
['mousemove', 'keydown', 'scroll', 'click'].forEach(eventType => {
    document.addEventListener(eventType, () => {
        lastActivityTime = Date.now();
        updateActiveState();
    });
});

// Start updating active state
setInterval(updateActiveState, 60000); // Check activity every minute

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showOverlay") {
        createOverlay();
    }
});

// Notify background script when the page is loaded
chrome.runtime.sendMessage({ action: "pageLoaded" });