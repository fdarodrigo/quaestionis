document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-button');
  const languageButton = document.getElementById('language-button');
  const languageIcon = document.getElementById('language-icon');
  const languageText = document.getElementById('language-text');
  const instructionText = document.getElementById('instruction-text');
  
  chrome.storage.local.get(['buttonState', 'language'], function (result) {
      console.log('Restored state:', result);
      const buttonState = result.buttonState || 'start';
      const language = result.language || 'en';

      toggleButton.classList.add(buttonState === 'start' ? 'button-start' : 'button-stop');
      toggleButton.textContent = buttonState === 'start' ? (language === 'pt' ? 'Iniciar' : 'Start') : (language === 'pt' ? 'Parar' : 'Stop');
      toggleButton.dataset.lang = language;
      setLanguage(language);
  });

  toggleButton.addEventListener('click', function () {
      if (toggleButton.classList.contains('button-start')) {
          startSelection();
      } else {
          stopSelection();
      }
  });

  languageButton.addEventListener('click', function () {
      if (languageText.innerText === 'English') {
          setLanguage('pt');
      } else {
          setLanguage('en');
      }
  });

  function startSelection() {
      console.log('Selection started');
      toggleButton.classList.remove('button-start');
      toggleButton.classList.add('button-stop');
      toggleButton.textContent = toggleButton.dataset.lang === 'pt' ? 'Parar' : 'Stop';

      chrome.storage.local.set({ buttonState: 'stop' }, function () {
          console.log('State saved as stop');
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' });
      });
  }

  function stopSelection() {
      console.log('Selection stopped');
      toggleButton.classList.remove('button-stop');
      toggleButton.classList.add('button-start');
      toggleButton.textContent = toggleButton.dataset.lang === 'pt' ? 'Iniciar' : 'Start';

      chrome.storage.local.set({ buttonState: 'start' }, function () {
          console.log('State saved as start');
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSelection' });
      });
  }

  function setLanguage(lang) {
      chrome.storage.local.set({ language: lang }, function () {
          console.log('Language saved:', lang);
      });

      if (lang === 'pt') {
          languageIcon.src = 'icons/pt.png';
          languageText.innerText = 'Português';
          instructionText.innerText = 'Selecione um bloco de texto na página.';
      } else {
          languageIcon.src = 'icons/en.png';
          languageText.innerText = 'English';
          instructionText.innerText = 'Select a block of text on the page.';
      }

      toggleButton.dataset.lang = lang;
      chrome.storage.local.get('buttonState', function(result) {
          const buttonState = result.buttonState || 'start';
          toggleButton.textContent = buttonState === 'start' ? (lang === 'pt' ? 'Iniciar' : 'Start') : (lang === 'pt' ? 'Parar' : 'Stop');
      });
  }
});
