document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusEl = document.getElementById('status');

  // A simple state manager for the popup
  let isListening = false;

  toggleBtn.addEventListener('click', () => {
    if (isListening) {
      // Command to stop listening
      chrome.runtime.sendMessage({ command: 'stop' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            statusEl.textContent = 'Error stopping.';
            return;
        }
        if (response && response.status === 'stopped') {
          toggleBtn.textContent = 'Start Listening';
          statusEl.textContent = 'Status: Inactive';
          isListening = false;
        }
      });
    } else {
      // Command to start listening
      chrome.runtime.sendMessage({ command: 'start' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            statusEl.textContent = 'Error starting.';
            return;
        }
        if (response && response.status === 'started') {
          toggleBtn.textContent = 'Stop Listening';
          statusEl.textContent = 'Status: Listening...';
          isListening = true;
        } else {
          statusEl.textContent = `Status: ${response.message || 'Error'}`;
        }
      });
    }
  });
});
