const status = document.getElementById('status');
const startBtn = document.getElementById('startRec');
const stopBtn = document.getElementById('stopRec');
const exportBtn = document.getElementById('exportRec');

const CHECK_FILES = ['core.js', 'checks/checks-squad.js', 'checks/checks-wcag.js', 'checks/checks-appian.js', 'checks/checks-review.js'];

async function getTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function inject(tabId, files, cb) {
  chrome.scripting.executeScript({ target: { tabId }, files }, cb);
}

function injectSettings(tabId, cb) {
  chrome.storage.local.get('sailA11ySettings', ({ sailA11ySettings }) => {
    const s = sailA11ySettings || {};
    chrome.scripting.executeScript({ target: { tabId }, func: settings => { window.__sailA11ySettings = settings; }, args: [s] }, cb);
  });
}

// Visualizer buttons
document.querySelectorAll('[data-viz]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const tab = await getTab();
    chrome.scripting.executeScript({ target: { tabId: tab.id }, func: m => { window.__sailA11yVisMode = m; }, args: [btn.dataset.viz] }, () => {
      inject(tab.id, ['core.js', 'visualizers.js'], () => window.close());
    });
  });
});

// Run scan
document.getElementById('run').addEventListener('click', async () => {
  status.textContent = 'Scanning…';
  const tab = await getTab();
  injectSettings(tab.id, () => {
    inject(tab.id, [...CHECK_FILES, 'scanner.js'], results => {
      if (chrome.runtime.lastError) { status.textContent = 'Error: ' + chrome.runtime.lastError.message; return; }
      const r = results?.[0]?.result;
      status.textContent = r ? `${r.errors} errors, ${r.warnings} warnings found` : 'Done';
    });
  });
});

// Clear
document.getElementById('clear').addEventListener('click', async () => {
  const tab = await getTab();
  chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => {
    document.getElementById('sail-a11y-panel')?.remove();
    document.getElementById('sail-a11y-viz-panel')?.remove();
    document.querySelectorAll('[data-a11y-issue]').forEach(e => { e.style.outline = ''; e.style.outlineOffset = ''; e.removeAttribute('data-a11y-issue'); });
    document.querySelectorAll('[data-a11y-viz]').forEach(e => e.remove());
  }});
  status.textContent = 'Cleared';
});

// Check recording state
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => window.__sailA11yRecording || false }, results => {
    if (results?.[0]?.result) {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      status.innerHTML = '<span class="rec-dot"></span>Recording workflow…';
    }
  });
});

// Start recording
startBtn.addEventListener('click', async () => {
  const tab = await getTab();
  injectSettings(tab.id, () => {
    inject(tab.id, [...CHECK_FILES, 'recorder.js'], () => {
      if (chrome.runtime.lastError) { status.textContent = 'Error: ' + chrome.runtime.lastError.message; return; }
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      exportBtn.style.display = 'none';
      status.innerHTML = '<span class="rec-dot"></span>Recording… navigate through your workflow';
    });
  });
});

// Stop recording
stopBtn.addEventListener('click', async () => {
  const tab = await getTab();
  chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => window.__sailA11yStopRecording ? window.__sailA11yStopRecording() : null }, results => {
    const r = results?.[0]?.result;
    stopBtn.style.display = 'none';
    startBtn.style.display = 'block';
    exportBtn.style.display = 'block';
    status.textContent = r ? `Done: ${r.steps} steps, ${r.totalErrors} errors, ${r.totalWarnings} warnings` : 'Recording stopped';
  });
});

// Export
exportBtn.addEventListener('click', async () => {
  const tab = await getTab();
  chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => window.__sailA11yExportReport ? window.__sailA11yExportReport() : null }, results => {
    const html = results?.[0]?.result;
    if (!html) { status.textContent = 'No report data'; return; }
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sail-a11y-report-' + new Date().toISOString().slice(0,10) + '.html';
    a.click();
    URL.revokeObjectURL(url);
    status.textContent = 'Report downloaded';
  });
});

// Settings
document.getElementById('settings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage ? chrome.runtime.openOptionsPage() : chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
});
