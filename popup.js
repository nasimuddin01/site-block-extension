document.addEventListener('DOMContentLoaded', () => {
    const timeSpentElement = document.getElementById('timeSpent');
    const timeLimitInput = document.getElementById('timeLimit');
    const saveButton = document.getElementById('save');

    // Load current values
    chrome.storage.sync.get(['timeLimit', 'timeSpent'], (result) => {
        timeLimitInput.value = result.timeLimit || 5;
        updateTimeSpent(result.timeSpent || 0);
    });

    // Save new time limit
    saveButton.addEventListener('click', () => {
        const newLimit = parseInt(timeLimitInput.value);
        if (newLimit > 0) {
            chrome.storage.sync.set({ timeLimit: newLimit }, () => {
                alert('Time limit updated!');
            });
        } else {
            alert('Please enter a valid time limit.');
        }
    });

    // Update time spent display
    function updateTimeSpent(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeSpentElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Listen for updates from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "updateTimeSpent") {
            updateTimeSpent(request.timeSpent);
        }
    });
});