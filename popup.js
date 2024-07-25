document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        const messageElement = document.getElementById('message');

        if (currentUrl.includes('myntra.com')) {
            messageElement.textContent = 'You are on a Myntra page. hello';
        } else {
            messageElement.textContent = 'This is not a Myntra page.';
        }
    });
});
