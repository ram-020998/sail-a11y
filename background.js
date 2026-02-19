chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'captureScreenshot' && sender.tab) {
    chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }, dataUrl => {
      sendResponse(dataUrl || '');
    });
    return true; // async
  }
});
