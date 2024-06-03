document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle-button');
    const closeButton = document.getElementById('close-button');
  
    chrome.storage.local.get(['buttonState', 'language'], function (result) {
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
  
    closeButton.addEventListener('click', function () {
      window.close();
    });
  
    function startSelection() {
      console.log('Selection started');
      toggleButton.classList.remove('button-start');
      toggleButton.classList.add('button-stop');
      toggleButton.textContent = toggleButton.dataset.lang === 'pt' ? 'Parar' : 'Stop';
  
      chrome.storage.local.set({ buttonState: 'stop' });
  
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelection' });
      });
    }
  
    function stopSelection() {
      console.log('Selection stopped');
      toggleButton.classList.remove('button-stop');
      toggleButton.classList.add('button-start');
      toggleButton.textContent = toggleButton.dataset.lang === 'pt' ? 'Iniciar' : 'Start';
  
      chrome.storage.local.set({ buttonState: 'start' });
  
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSelection' });
      });
    }

    setLanguage('en');
  });