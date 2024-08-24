chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ timeLimit: 15 }); // Default time limit: 15 minutes
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('facebook.com')) {
        chrome.alarms.create('facebookTimer', { delayInMinutes: 1 });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'facebookTimer') {
        chrome.storage.sync.get(['timeLimit'], (result) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url.includes('facebook.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "showOverlay" });
                }
            });
        });
    }
});
