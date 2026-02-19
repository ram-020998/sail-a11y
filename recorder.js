/**
 * SAIL A11y Recorder — Workflow recording with dedup + HTML export.
 * Depends on: core.js, checks-core.js, checks-appian.js, checks-review.js, checks-jira.js, checks-contrast.js
 */
(() => {
  'use strict';
  if (window.__sailA11yRecording) return;
  window.__sailA11yRecording = true;

  const { $, sailContext, getSail, isInsideSiteNav, getUniqueSelector, getElementSource, getElementRect, createPanel, showToast } = SailA11y;
  const allSteps = [];
  const seenFingerprints = new Set();
  let stepNum = 0, scanTimeout = null, observer = null;

  const S = window.__sailA11ySettings || {};

  const disabledCats = S.disabledCats || [];

  function runSilentScan() {
    const issues = [];
    function add(el, sev, cat, msg) {
      if (S.skipSiteNav !== false && isInsideSiteNav(el)) return;
      if (disabledCats.includes(cat)) return;
      const text = el.textContent?.trim().slice(0, 40);
      const tag = el.tagName.toLowerCase();
      issues.push({ sev, cat, msg, sail: getSail(el),
        elDesc: '<' + tag + '>' + (text ? ' "' + text + '"' : ' (empty)'),
        selector: getUniqueSelector(el), source: getElementSource(el), rect: getElementRect(el) });
    }
    if (S.squadLevel !== false) SailA11yChecks.runSquadChecks(issues, add);
    if (S.wcagExtended !== false) SailA11yChecks.runWcagChecks(issues, add);
    if (S.appianPlatform !== false) SailA11yChecks.runAppianChecks(issues, add);
    if (S.reviewRequired !== false) SailA11yChecks.runReviewChecks(issues, add);
    return issues;
  }

  const stepScreenshots = {};

  function captureStep() {
    stepNum++;
    const sn = stepNum;
    const url = window.location.href;
    const sailTitle = document.querySelector('[class*="FormLayout---"] [class*="title"], [class*="SectionLayout---"] [class*="label"], h1, h2')?.textContent?.trim().slice(0, 60) || '';
    const stepLabel = sailTitle || document.title || 'Step ' + sn;

    const issues = runSilentScan();
    const newIssues = issues.filter(i => {
      const fp = i.sev + '|' + i.cat + '|' + i.sail + '|' + i.msg;
      if (seenFingerprints.has(fp)) return false;
      seenFingerprints.add(fp);
      return true;
    });
    const errs = newIssues.filter(i => i.sev === 'error').length;
    const warns = newIssues.length - errs;

    allSteps.push({ step: sn, label: stepLabel, url, timestamp: new Date().toISOString(), errors: errs, warnings: warns, issues: newIssues });
    showToast('🔴 Step ' + sn + ': ' + errs + ' errors, ' + warns + ' warnings — ' + stepLabel);

    // Capture screenshot for this step via background service worker
    try {
      chrome.runtime.sendMessage({ type: 'captureScreenshot' }, dataUrl => {
        if (dataUrl) stepScreenshots[sn] = dataUrl;
      });
    } catch(e) {}
  }

  captureStep();

  // Watch DOM changes
  let lastHTML = document.body.innerHTML.length;
  observer = new MutationObserver(() => {
    clearTimeout(scanTimeout);
    scanTimeout = setTimeout(() => {
      const newLen = document.body.innerHTML.length;
      if (Math.abs(newLen - lastHTML) > 500) { lastHTML = newLen; captureStep(); }
    }, 1500);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Watch URL changes
  let lastUrl = window.location.href;
  const urlCheck = setInterval(() => {
    if (window.location.href !== lastUrl) { lastUrl = window.location.href; setTimeout(captureStep, 2000); }
  }, 1000);

  // Stop recording
  window.__sailA11yStopRecording = () => {
    window.__sailA11yRecording = false;
    if (observer) observer.disconnect();
    clearInterval(urlCheck);
    clearTimeout(scanTimeout);

    const totalErrors = allSteps.reduce((s, st) => s + st.errors, 0);
    const totalWarnings = allSteps.reduce((s, st) => s + st.warnings, 0);

    let html = '<div style="display:flex;gap:12px;margin-bottom:14px">'
      + '<span style="padding:6px 10px;border-radius:4px;font-weight:600;font-size:12px;background:#e53e3e33;color:#fc8181">❌ ' + totalErrors + ' errors</span>'
      + '<span style="padding:6px 10px;border-radius:4px;font-weight:600;font-size:12px;background:#d69e2e33;color:#f6e05e">⚠️ ' + totalWarnings + ' warnings</span></div>';

    allSteps.forEach(step => {
      const c = step.errors > 0 ? '#e53e3e' : (step.warnings > 0 ? '#d69e2e' : '#48bb78');
      html += '<div style="margin-bottom:12px;border-left:3px solid ' + c + ';padding:10px 12px;background:#2d3748;border-radius:0 6px 6px 0">'
        + '<div style="font-weight:700;font-size:13px;margin-bottom:4px">Step ' + step.step + ': ' + step.label + '</div>'
        + '<div style="font-size:11px;color:#718096;margin-bottom:6px">' + step.timestamp.slice(11,19) + ' — ' + step.errors + 'E / ' + step.warnings + 'W</div>';
      if (step.issues.length === 0) { html += '<div style="color:#68d391;font-size:12px">✅ No issues</div>'; }
      else step.issues.forEach(i => {
        const bg = i.sev === 'error' ? '#e53e3e' : '#d69e2e';
        html += '<div style="padding:4px 8px;margin-bottom:3px;font-size:11px;border-radius:3px;background:#1a202c">'
          + '<span style="display:inline-block;font-size:9px;padding:1px 4px;border-radius:2px;margin-right:4px;font-weight:600;background:' + bg + ';color:#fff">' + i.sev + '</span>'
          + '<span style="color:#90cdf4">' + i.sail + '</span> — ' + i.msg + '</div>';
      });
      html += '</div>';
    });

    createPanel('sail-a11y-panel', '⚡ Workflow Report — ' + allSteps.length + ' steps', html, { width: 500, maxHeight: '85vh' });
    return { steps: allSteps.length, totalErrors, totalWarnings };
  };

  // Export HTML report
  window.__sailA11yExportReport = () => {
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const totalE = allSteps.reduce((s,st) => s + st.errors, 0);
    const totalW = allSteps.reduce((s,st) => s + st.warnings, 0);
    // Build per-step screenshot map (fallback to single screenshot from popup)
    const screenshots = {};
    allSteps.forEach(st => { screenshots[st.step] = stepScreenshots[st.step] || window.__sailA11yScreenshot || ''; });

    // Flatten all issues with step info
    const allIssues = [];
    allSteps.forEach(step => step.issues.forEach(i => allIssues.push({ ...i, step: step.step, stepLabel: step.label, timestamp: step.timestamp, screenshot: screenshots[step.step] || '' })));

    // Group by category+msg for sidebar
    const grouped = {};
    allIssues.forEach((i, idx) => {
      const key = i.cat + '|' + i.msg;
      if (!grouped[key]) grouped[key] = { msg: i.msg, cat: i.cat, sev: i.sev, sail: i.sail, items: [] };
      grouped[key].items.push({ ...i, idx });
    });
    const groups = Object.values(grouped);

    let h = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>SAIL A11y Workflow Report</title><style>'
      + '*{margin:0;padding:0;box-sizing:border-box}body{font:13px/1.5 system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;height:100vh;overflow:hidden}'
      + '.sidebar{width:340px;min-width:340px;background:#1e293b;border-right:1px solid #334155;overflow-y:auto;padding:16px}'
      + '.sidebar h1{font-size:16px;margin-bottom:4px}.sidebar .meta{color:#94a3b8;font-size:11px;margin-bottom:12px}'
      + '.summary{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}'
      + '.badge{padding:4px 10px;border-radius:4px;font-weight:700;font-size:11px}'
      + '.err-bg{background:#991b1b;color:#fca5a5}.warn-bg{background:#854d0e;color:#fde68a}.pass-bg{background:#166534;color:#86efac}'
      + '.issue-group{padding:10px 12px;margin-bottom:4px;border-radius:6px;cursor:pointer;border-left:3px solid #334155;background:#0f172a;font-size:12px}'
      + '.issue-group:hover,.issue-group.active{background:#334155}'
      + '.issue-group.sev-error{border-left-color:#ef4444}.issue-group.sev-warning{border-left-color:#eab308}'
      + '.issue-group .count{color:#94a3b8;font-size:11px}'
      + '.detail{flex:1;overflow-y:auto;padding:24px 32px}'
      + '.detail h2{font-size:18px;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #334155}'
      + '.detail-nav{display:flex;align-items:center;gap:12px;margin-bottom:16px;font-size:12px;color:#94a3b8}'
      + '.detail-nav button{background:#334155;color:#e2e8f0;border:1px solid #475569;border-radius:4px;padding:4px 10px;cursor:pointer;font-size:11px}'
      + '.detail-nav button:hover{background:#475569}'
      + '.screenshot-wrap{margin-bottom:20px;position:relative;display:inline-block;max-width:100%}'
      + '.screenshot-wrap img{max-width:100%;border-radius:6px;border:1px solid #334155}'
      + '.highlight-box{position:absolute;border:3px solid #ef4444;background:rgba(239,68,68,0.15);border-radius:2px;pointer-events:none}'
      + '.section-title{font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin:20px 0 8px}'
      + '.code-block{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:12px 16px;font-family:monospace;font-size:11px;line-height:1.6;overflow-x:auto;word-break:break-all;color:#c4b5fd;margin-bottom:16px}'
      + '.info-row{display:flex;gap:12px;margin-bottom:8px;font-size:12px}.info-label{color:#94a3b8;min-width:80px;font-weight:600}.info-value{color:#e2e8f0}'
      + '.sev-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700}'
      + '.sev-badge.error{background:#dc2626;color:#fff}.sev-badge.warning{background:#ca8a04;color:#fff}'
      + '</style></head><body>';

    // Sidebar
    h += '<div class="sidebar"><h1>⚡ SAIL A11y Report</h1>';
    h += '<div class="meta">' + new Date().toLocaleString() + ' · ' + allSteps.length + ' steps</div>';
    h += '<div class="summary"><span class="badge err-bg">❌ ' + totalE + ' errors</span><span class="badge warn-bg">⚠️ ' + totalW + ' warnings</span></div>';
    h += '<div style="font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:8px">Issues (' + allIssues.length + ')</div>';
    groups.forEach((g, gi) => {
      h += '<div class="issue-group sev-' + g.sev + '" data-group="' + gi + '">'
        + '<div style="margin-bottom:2px">' + esc(g.msg).slice(0, 60) + '</div>'
        + '<span class="count">' + g.items.length + ' issue' + (g.items.length > 1 ? 's' : '') + '</span></div>';
    });
    h += '</div>';

    // Detail panel
    h += '<div class="detail" id="detail">';
    h += '<div style="padding:40px 0;text-align:center;color:#64748b">← Select an issue from the sidebar</div>';
    h += '</div>';

    // Data + script (escape </ to prevent closing script tag)
    const safeJSON = s => JSON.stringify(s).replace(/<\//g, '<\\/');
    const dpr = window.devicePixelRatio || 1;
    h += '<script>const groups=' + safeJSON(groups.map(g => ({
      msg: g.msg, cat: g.cat, sev: g.sev, sail: g.sail,
      items: g.items.map(i => ({ sev: i.sev, cat: i.cat, msg: i.msg, sail: i.sail, selector: i.selector || '', source: i.source || '', rect: i.rect || null, step: i.step, stepLabel: i.stepLabel || '', timestamp: i.timestamp || '', screenshot: i.screenshot || '' }))
    }))) + ';\n';
    h += 'var dpr=' + dpr + ';\n';
    h += `let curGroup=0,curItem=0;
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function showGroup(gi,ii){curGroup=gi;curItem=ii||0;var g=groups[gi],item=g.items[curItem],d=document.getElementById("detail");
document.querySelectorAll(".issue-group").forEach(function(e,i){e.classList.toggle("active",i===gi);});
var html="<h2>"+esc(g.msg)+"<\\/h2>";
html+="<div class='detail-nav'><button id='prevBtn'>\\u2039 Prev<\\/button><span>"+(curItem+1)+" of "+g.items.length+"<\\/span><button id='nextBtn'>Next \\u203a<\\/button><\\/div>";
if(item.screenshot&&item.rect&&item.rect.w>0){html+="<div class='screenshot-wrap'><img id='ssImg' src='"+item.screenshot+"' />";
html+="<div id='hlBox' class='highlight-box'><\\/div><\\/div>";}
html+="<div class='section-title'>Issue Details<\\/div>";
html+="<div class='info-row'><span class='info-label'>Severity<\\/span><span class='info-value'><span class='sev-badge "+item.sev+"'>"+item.sev+"<\\/span><\\/span><\\/div>";
html+="<div class='info-row'><span class='info-label'>Category<\\/span><span class='info-value'>"+esc(item.cat)+"<\\/span><\\/div>";
html+="<div class='info-row'><span class='info-label'>Component<\\/span><span class='info-value' style='color:#7dd3fc'>"+esc(item.sail)+"<\\/span><\\/div>";
html+="<div class='info-row'><span class='info-label'>Found on<\\/span><span class='info-value'>Step "+item.step+": "+esc(item.stepLabel)+" ("+(item.timestamp||"").slice(11,19)+")<\\/span><\\/div>";
if(item.selector){html+="<div class='section-title'>Element Location<\\/div><div class='code-block'>"+esc(item.selector)+"<\\/div>";}
if(item.source){html+="<div class='section-title'>Element Source Code<\\/div><div class='code-block'>"+esc(item.source)+"<\\/div>";}
d.innerHTML=html;
var img=document.getElementById("ssImg"),hlBox=document.getElementById("hlBox");
if(img&&hlBox&&item.rect){var posBox=function(){var s=img.naturalWidth?img.width/(img.naturalWidth/dpr):1;hlBox.style.cssText="position:absolute;border:3px solid #ef4444;background:rgba(239,68,68,0.15);border-radius:2px;pointer-events:none;left:"+(item.rect.x*s)+"px;top:"+(item.rect.y*s)+"px;width:"+(item.rect.w*s)+"px;height:"+(item.rect.h*s)+"px";};if(img.complete&&img.naturalWidth)posBox();else img.addEventListener("load",posBox);}
var p=document.getElementById("prevBtn");if(p)p.addEventListener("click",function(){nav(-1);});
var n=document.getElementById("nextBtn");if(n)n.addEventListener("click",function(){nav(1);});}
function nav(dir){var g=groups[curGroup];curItem=Math.max(0,Math.min(g.items.length-1,curItem+dir));showGroup(curGroup,curItem);}
document.querySelectorAll(".issue-group").forEach(function(el,i){el.addEventListener("click",function(){showGroup(i);});});
if(groups.length)showGroup(0,0);
`;
    h += '<\/script></body></html>';
    return h;
  };
})();
