document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle-button');

    toggleButton.addEventListener('click', function () {
        if (toggleButton.classList.contains('button-start')) {
            startSelection();
        } else {
            stopSelection();
        }
    });

    function startSelection() {
        console.log('Selection started');
        toggleButton.classList.remove('button-start');
        toggleButton.classList.add('button-stop');
        toggleButton.textContent = toggleButton.dataset.lang === 'pt' ? 'Parar' : 'Stop';

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' });
        });
    }

    function stopSelection() {
        console.log('Selection stopped');
        toggleButton.classList.remove('button-stop');
        toggleButton.classList.add('button-start');
        toggleButton.textContent = toggleButton.dataset.lang === 'pt' ? 'Iniciar' : 'Start';

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSelection' });
        });
    }

    const languageButton = document.getElementById('language-button');
    const languageIcon = document.getElementById('language-icon');
    const languageText = document.getElementById('language-text');
    const languageLabel = document.getElementById('language-label');
    const instructionText = document.getElementById('instruction-text');
    const messageText = document.getElementById('message-text');

    languageButton.addEventListener('click', function () {
        if (languageText.innerText === 'English') {
            setLanguage('pt');
        } else {
            setLanguage('en');
        }
    });

    function setLanguage(lang) {
        if (lang === 'pt') {
            languageIcon.src = 'icons/pt.png';
            languageText.innerText = 'Português';
            languageLabel.innerText = 'Mudar idioma';
            instructionText.innerText = 'Selecione um bloco de texto na página.';
            messageText.innerText = 'Você pode começar a selecionar o texto.';
            toggleButton.dataset.lang = 'pt';
            if (toggleButton.classList.contains('button-start')) {
                toggleButton.innerText = 'Iniciar';
            } else {
                toggleButton.innerText = 'Parar';
            }
        } else {
            languageIcon.src = 'icons/en.png';
            languageText.innerText = 'English';
            languageLabel.innerText = 'Change language';
            instructionText.innerText = 'Select a block of text on the page.';
            messageText.innerText = 'You can start selecting the text.';
            toggleButton.dataset.lang = 'en';
            if (toggleButton.classList.contains('button-start')) {
                toggleButton.innerText = 'Start';
            } else {
                toggleButton.innerText = 'Stop';
            }
        }
    }

    toggleButton.classList.add('button-start');
    toggleButton.textContent = 'Start';
    toggleButton.dataset.lang = 'en';

    setLanguage('en');
});
