console.log('content_script.js iniciado')
document.addEventListener('mouseup', function() {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        if (selectedText.length > 200) {
            selectedText = selectedText.substring(0, 200);
        } else {
            console.log("Selecione um texto de até 200 caracteres")
        }
        chrome.runtime.sendMessage({ action: "textSelected", text: selectedText });
    }
});

