// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const video = document.querySelector('video');

  if (video) {
    if (request.command === 'play') {
      video.play();
      sendResponse({ status: 'played' });
    } else if (request.command === 'pause') {
      video.pause();
      sendResponse({ status: 'paused' });
    }
  } else {
    sendResponse({ status: 'error', message: 'No video element found on this page.' });
  }

  // Return true to indicate you wish to send a response asynchronously
  return true;
});
