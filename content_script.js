let isSelecting = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'startSelection') {
        startSelection();
    } else if (request.action === 'stopSelection') {
        stopSelection();
    }
});

function startSelection() {
    if (!isSelecting) {
        document.addEventListener('mouseup', textSelectionHandler);
        isSelecting = true;
    }
}

function stopSelection() {
    if (isSelecting) {
        document.removeEventListener('mouseup', textSelectionHandler);
        isSelecting = false;
    }
}

function textSelectionHandler() {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.runtime.sendMessage({ action: 'textSelected', text: selectedText });
    }
}
