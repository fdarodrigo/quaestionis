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

      setLanguage(language, function() {
          setButtonState(buttonState, language);
      });
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
      setButtonState('stop', toggleButton.dataset.lang);
      chrome.storage.local.set({ buttonState: 'stop' }, function () {
          console.log('State saved as stop');
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' });
      });
  }

  function stopSelection() {
      console.log('Selection stopped');
      setButtonState('start', toggleButton.dataset.lang);
      chrome.storage.local.set({ buttonState: 'start' }, function () {
          console.log('State saved as start');
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSelection' });
      });
  }

  function setButtonState(state, lang) {
      toggleButton.classList.remove('button-start', 'button-stop');
      toggleButton.classList.add(state === 'start' ? 'button-start' : 'button-stop');
      toggleButton.textContent = state === 'start' ? (lang === 'pt' ? 'Iniciar' : 'Start') : (lang === 'pt' ? 'Parar' : 'Stop');
      toggleButton.dataset.lang = lang;
  }

  function setLanguage(lang, callback) {
      chrome.storage.local.set({ language: lang }, function () {
          console.log('Language saved:', lang);
      });

      languageIcon.src = lang === 'pt' ? 'icons/pt.png' : 'icons/en.png';
      languageText.innerText = lang === 'pt' ? 'Português' : 'English';
      instructionText.innerText = lang === 'pt' ? 'Selecione um bloco de texto na página.' : 'Select a block of text on the page.';

      chrome.storage.local.get('buttonState', function(result) {
          const buttonState = result.buttonState || 'start';
          setButtonState(buttonState, lang);
          if (callback) callback();
      });
  }
});
