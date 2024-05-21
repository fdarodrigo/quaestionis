document.addEventListener('DOMContentLoaded', function() {
    const languageButton = document.getElementById('language-button');
    const languageIcon = document.getElementById('language-icon');
    const languageText = document.getElementById('language-text');
    const instructionText = document.getElementById('instruction-text');
    const messageText = document.getElementById('message-text');
    const languageLabel = document.getElementById('language-label');
    const toggleLabel = document.getElementById('toggle-label');

    const messages = {
        en: {
            instruction: "Select a block of text on the page.",
            message: "You can start selecting the text.",
            languageLabel: "Change language",
            toggleLabel: "Start selection"
        },
        pt: {
            instruction: "Selecione um bloco de texto na página.",
            message: "Você pode começar a selecionar o texto.",
            languageLabel: "Mudar idioma",
            toggleLabel: "Iniciar seleção"
        }
    };

    languageButton.addEventListener('click', function() {
        if (languageText.innerText === "English") {
            languageIcon.src = "icons/pt.png";
            languageIcon.alt = "Portuguese";
            languageText.innerText = "Português";
            instructionText.innerText = messages.pt.instruction;
            messageText.innerText = messages.pt.message;
            languageLabel.innerText = messages.pt.languageLabel;
            toggleLabel.innerText = messages.pt.toggleLabel;
        } else {
            languageIcon.src = "icons/en.png";
            languageIcon.alt = "English";
            languageText.innerText = "English";
            instructionText.innerText = messages.en.instruction;
            messageText.innerText = messages.en.message;
            languageLabel.innerText = messages.en.languageLabel;
            toggleLabel.innerText = messages.en.toggleLabel;
        }
    });
});
