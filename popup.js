document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['timeLimit'], (result) => {
        document.getElementById('timeLimit').value = result.timeLimit;
    });

    document.getElementById('save').addEventListener('click', () => {
        const newLimit = document.getElementById('timeLimit').value;
        chrome.storage.sync.set({ timeLimit: parseInt(newLimit) }, () => {
            alert('Time limit updated!');
        });
    });
});