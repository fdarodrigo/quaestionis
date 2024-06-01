let selectionEnabled = false;

function textSelectionHandler() {
    if (!selectionEnabled) return;

    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.runtime.sendMessage({ action: 'textSelected', text: selectedText });
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'startSelection') {
        selectionEnabled = true;
        document.addEventListener('mouseup', textSelectionHandler);
        console.log('Text selection started');
    } else if (message.action === 'stopSelection') {
        selectionEnabled = false;
        document.removeEventListener('mouseup', textSelectionHandler);
        console.log('Text selection stopped');
    }
});
