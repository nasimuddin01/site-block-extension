let activeTabId = null;
let activeTimer = null;

function resetDailyUsage() {
    const today = new Date().toDateString();
    chrome.storage.sync.get(['lastResetDay'], (result) => {
        if (result.lastResetDay !== today) {
            chrome.storage.sync.set({ timeSpent: 0, lastResetDay: today });
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        timeLimit: 5, // Default time limit: 5 minutes
        timeSpent: 0,
        lastResetDay: new Date().toDateString(),
        isActive: false
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes('facebook.com')) {
            activeTabId = tab.id;
            resetDailyUsage();
        } else {
            activeTabId = null;
            stopActiveTimer();
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('facebook.com')) {
        activeTabId = tabId;
        resetDailyUsage();
    }
});

function startActiveTimer() {
    if (!activeTimer) {
        activeTimer = setInterval(() => {
            chrome.storage.sync.get(['timeSpent', 'timeLimit'], (result) => {
                const newTimeSpent = result.timeSpent + 1;
                chrome.storage.sync.set({ timeSpent: newTimeSpent });

                updatePopup(); // Update the popup every second

                if (newTimeSpent >= result.timeLimit * 60) {
                    if (activeTabId) {
                        chrome.tabs.sendMessage(activeTabId, { action: "showOverlay" });
                    }
                    stopActiveTimer();
                }
            });
        }, 1000);
    }
}

function stopActiveTimer() {
    if (activeTimer) {
        clearInterval(activeTimer);
        activeTimer = null;
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "leaveFacebook") {
        chrome.tabs.create({ url: 'about:newtab' }, () => {
            if (sender.tab && sender.tab.id) {
                chrome.tabs.remove(sender.tab.id);
            }
        });
        stopActiveTimer();
    } else if (request.action === "setActive") {
        if (sender.tab && sender.tab.id === activeTabId) {
            if (request.isActive) {
                startActiveTimer();
            } else {
                stopActiveTimer();
            }
        }
    } else if (request.action === "pageLoaded") {
        if (sender.tab && sender.tab.url && sender.tab.url.includes('facebook.com')) {
            activeTabId = sender.tab.id;
            resetDailyUsage();
        }
    }
});


function updatePopup() {
    chrome.storage.sync.get(['timeSpent'], (result) => {
        chrome.runtime.sendMessage({
            action: "updateTimeSpent",
            timeSpent: result.timeSpent || 0
        });
    });
}

chrome.action.onClicked.addListener((tab) => {
    updatePopup();
});


// Check and reset daily usage every hour
setInterval(resetDailyUsage, 3600000);