chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ timeLimit: 15, startTime: null }); // Default time limit: 15 minutes
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('facebook.com')) {
        chrome.tabs.sendMessage(tabId, { action: "checkTimeSpent" });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "leaveFacebook") {
        chrome.tabs.create({ url: 'about:newtab' }, () => {
            chrome.tabs.remove(sender.tab.id);
        });
    }
});