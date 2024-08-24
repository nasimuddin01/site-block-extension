let startTime = Date.now();
let overlay;

function createOverlay() {
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.color = 'white';
    overlay.style.fontSize = '24px';
    overlay.innerHTML = `
    <h1>Time's up!</h1>
    <p>It's time to go back to work.</p>
    <button id="closeOverlay" style="margin-top: 20px; padding: 10px 20px; font-size: 18px;">Close Facebook</button>
  `;
    document.body.appendChild(overlay);

    document.getElementById('closeOverlay').addEventListener('click', () => {
        window.close();
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showOverlay") {
        createOverlay();
    }
});

setInterval(() => {
    chrome.storage.sync.get(['timeLimit'], (result) => {
        const timeSpent = (Date.now() - startTime) / 60000; // Convert to minutes
        if (timeSpent >= result.timeLimit) {
            createOverlay();
        }
    });
}, 60000); // Check every minute