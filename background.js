// background.js

let recognition;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in this) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log('Heard:', transcript);

    if (transcript.includes('play')) {
      sendCommand('play');
    } else if (transcript.includes('pause')) {
      sendCommand('pause');
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended.');
    // The user will have to restart it via the popup.
  };

} else {
  console.error('Speech Recognition API not supported.');
}


// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'start') {
    if (recognition) {
      try {
        recognition.start();
        console.log('Speech recognition started.');
        sendResponse({ status: 'started' });
      } catch (e) {
        console.error("Recognition start error:", e);
        sendResponse({ status: 'error', message: 'Recognition might already be active.' });
      }
    } else {
      sendResponse({ status: 'error', message: 'Speech recognition not supported.' });
    }
  } else if (request.command === 'stop') {
    if (recognition) {
      recognition.stop();
      console.log('Speech recognition stopped.');
      sendResponse({ status: 'stopped' });
    }
  }
  return true; // Keep the message channel open for the asynchronous response
});

function sendCommand(command) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.id) {
        // Inject the content script into the active tab.
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js'],
        }, () => {
            // After the script is injected, send the command.
            // It's fine if the script is already injected.
            chrome.tabs.sendMessage(activeTab.id, { command: command });
        });
    }
  });
}
