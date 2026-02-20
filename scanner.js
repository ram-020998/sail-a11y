/**
 * SAIL A11y Scanner — Runs all checks and renders results panel.
 * Depends on: core.js, checks-core.js, checks-appian.js, checks-review.js, checks-jira.js, checks-contrast.js
 * Reads: window.__sailA11ySettings (injected by popup.js)
 */
(() => {
  'use strict';
  const S = window.__sailA11ySettings || {};
  const { $, sailContext, getSail, isInsideSiteNav, createPanel, cleanup, getScope } = SailA11y;

  cleanup();

  const issues = [];
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const disabledCats = S.disabledCats || [];

  console.log('[SAIL A11y] Scanner starting...', {
    settings: S,
    disabledCats,
    checksAvailable: !!window.SailA11yChecks,
    scope: getScope()
  });

  function add(el, sev, cat, msg, fix) {
    if (S.skipSiteNav !== false && isInsideSiteNav(el)) return;
    if (disabledCats.includes(cat)) return;
    const ctx = sailContext(el);
    const text = el.textContent?.trim().slice(0, 40);
    const tag = el.tagName.toLowerCase();
    const id = el.id ? ' id="' + el.id + '"' : '';
    const role = el.getAttribute('role') ? ' role="' + el.getAttribute('role') + '"' : '';
    const elDesc = '&lt;' + tag + esc(id + role) + '&gt;' + (text ? ' "' + esc(text) + '"' : ' (empty)');
    issues.push({ el, sev, cat, msg: esc(msg), fix: esc(fix || ''), sail: esc(ctx.sail), component: ctx.component, elDesc });
  }

  // Run enabled check modules
  if (S.squadLevel !== false) SailA11yChecks.runSquadChecks(issues, add);
  if (S.wcagExtended !== false) SailA11yChecks.runWcagChecks(issues, add);
  if (S.appianPlatform !== false) SailA11yChecks.runAppianChecks(issues, add);
  if (S.reviewRequired !== false) SailA11yChecks.runReviewChecks(issues, add);

  console.log('[SAIL A11y] Checks complete. Issues found:', issues.length);
  if (issues.length === 0) {
    console.log('[SAIL A11y] No issues found. Possible reasons:');
    console.log('  - Page content is still loading');
    console.log('  - All elements are inside site navigation (excluded by default)');
    console.log('  - Check modules are disabled in settings');
    console.log('  - Page has no accessibility issues (unlikely)');
  }

  // Highlight issues on page
  issues.forEach(i => {
    i.el.style.setProperty('outline', '3px solid ' + (i.sev === 'error' ? '#e53e3e' : '#d69e2e'), 'important');
    i.el.style.setProperty('outline-offset', '2px', 'important');
    i.el.setAttribute('data-a11y-issue', i.msg.slice(0, 60));
  });

  // Sort issues by DOM position (top to bottom on page)
  issues.sort((a, b) => {
    const ra = a.el.getBoundingClientRect(), rb = b.el.getBoundingClientRect();
    return (ra.top - rb.top) || (ra.left - rb.left);
  });

  // Build panel HTML
  const errs = issues.filter(i => i.sev === 'error').length;
  const warns = issues.length - errs;
  const catSet = [...new Set(issues.map(i => i.cat))].sort();

  let html = '<div style="display:flex;gap:12px;margin-bottom:10px">'
    + '<span style="padding:6px 10px;border-radius:4px;font-weight:600;font-size:12px;background:#e53e3e33;color:#fc8181">❌ ' + errs + ' errors</span>'
    + '<span style="padding:6px 10px;border-radius:4px;font-weight:600;font-size:12px;background:#d69e2e33;color:#f6e05e">⚠️ ' + warns + ' warnings</span></div>';

  // Filter controls
  html += '<div style="display:flex;gap:8px;margin-bottom:12px">'
    + '<select id="sa11y-sev-filter" style="flex:1;padding:5px 8px;border-radius:4px;background:#2d3748;color:#e2e8f0;border:1px solid #4a5568;font-size:11px">'
    + '<option value="all">All Severities</option><option value="error">Errors Only</option><option value="warning">Warnings Only</option></select>'
    + '<select id="sa11y-cat-filter" style="flex:1;padding:5px 8px;border-radius:4px;background:#2d3748;color:#e2e8f0;border:1px solid #4a5568;font-size:11px">'
    + '<option value="all">All Categories</option>' + catSet.map(c => '<option value="' + c + '">' + c + '</option>').join('') + '</select></div>';

  if (issues.length === 0) {
    html += '<div style="padding:20px 0;text-align:center;color:#68d391;font-weight:600">✅ No accessibility issues found!</div>';
  }

  html += '<div id="sa11y-issues">';
  issues.forEach((issue, idx) => {
    const tagBg = issue.sev === 'error' ? '#e53e3e' : '#d69e2e';
    const catShort = issue.cat.replace(/^(Squad|WCAG|Appian|Review):\s*/, '');
    html += '<div data-idx="' + idx + '" data-sev="' + issue.sev + '" data-cat="' + issue.cat + '" style="padding:10px 12px;margin-bottom:8px;border-radius:6px;background:#2d3748;cursor:pointer;font-size:12px;border-left:3px solid ' + tagBg + '">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">'
      + '<div style="display:flex;align-items:center;gap:6px">'
      + '<span style="display:inline-block;font-size:10px;padding:1px 6px;border-radius:3px;font-weight:600;text-transform:uppercase;background:' + tagBg + ';color:#fff">' + issue.sev + '</span>'
      + '<span style="color:#90cdf4;font-weight:600;font-size:11px">' + issue.sail + '</span></div>'
      + '<span style="font-size:9px;padding:2px 6px;border-radius:3px;background:#4a5568;color:#a0aec0;white-space:nowrap">' + esc(catShort) + '</span></div>'
      + '<div style="color:#e2e8f0;margin-bottom:6px;word-break:break-word">' + issue.msg + '</div>'
      + '<div style="color:#718096;font-size:11px;font-family:monospace;margin-bottom:6px;word-break:break-all">' + issue.elDesc + '</div>'
      + '<div style="color:#a0aec0;font-size:11px;line-height:1.4;padding:6px 8px;background:#1a202c;border-radius:4px;word-break:break-word">💡 ' + issue.fix + '</div>'
      + '</div>';
  });
  html += '</div>';

  const panel = createPanel('sail-a11y-panel', '⚡ SAIL A11y — ' + issues.length + ' issues', html, {
    onClose() {
      document.querySelectorAll('[data-a11y-issue]').forEach(e => { e.style.removeProperty('outline'); e.style.removeProperty('outline-offset'); e.removeAttribute('data-a11y-issue'); });
    }
  });

  // Filter logic
  const applyFilters = () => {
    const sev = panel.querySelector('#sa11y-sev-filter').value;
    const cat = panel.querySelector('#sa11y-cat-filter').value;
    panel.querySelectorAll('[data-idx]').forEach(card => {
      const show = (sev === 'all' || card.dataset.sev === sev) && (cat === 'all' || card.dataset.cat === cat);
      card.style.display = show ? '' : 'none';
    });
  };
  panel.querySelector('#sa11y-sev-filter').addEventListener('change', applyFilters);
  panel.querySelector('#sa11y-cat-filter').addEventListener('change', applyFilters);

  // Click-to-highlight
  panel.querySelectorAll('[data-idx]').forEach(item => {
    item.addEventListener('mouseover', () => { item.style.background = '#4a5568'; });
    item.addEventListener('mouseout', () => { item.style.background = '#2d3748'; });
    item.addEventListener('click', () => {
      const el = issues[+item.dataset.idx]?.el;
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const color = issues[+item.dataset.idx].sev === 'error' ? '#e53e3e' : '#d69e2e';
      el.style.cssText += ';outline:4px solid #ff0 !important;outline-offset:3px !important;box-shadow:0 0 0 8px rgba(255,255,0,0.4) !important;';
      setTimeout(() => { el.style.setProperty('outline', '3px solid ' + color, 'important'); el.style.setProperty('outline-offset', '2px', 'important'); el.style.removeProperty('box-shadow'); }, 1200);
    });
  });

  return { errors: errs, warnings: warns };
})();
