/**
 * SAIL A11y Visualizers — 8 overlay modes.
 * Depends on: core.js (SailA11y)
 */
(() => {
  'use strict';
  const MODE = window.__sailA11yVisMode;
  if (!MODE) return;

  const { $: _$, getSail, isInsideSiteNav, badge, outline, createPanel } = SailA11y;
  const $ = (sel, ctx) => _$(sel, ctx).filter(el => !isInsideSiteNav(el));

  // Cleanup previous
  document.querySelectorAll('[data-a11y-viz]').forEach(e => e.remove());

  function vizPanel(title, html) {
    createPanel('sail-a11y-viz-panel', title, html, {
      width: 420, maxHeight: '85vh',
      onClose() { document.querySelectorAll('[data-a11y-viz]').forEach(e => e.remove()); }
    });
    // Mark panel as viz so it gets cleaned up too
    const p = document.getElementById('sail-a11y-viz-panel');
    if (p) p.setAttribute('data-a11y-viz', '1');
  }

  // ===== TAB ORDER =====
  if (MODE === 'taborder') {
    const els = $('a[href],button,input,select,textarea,[tabindex]')
      .filter(el => el.tabIndex >= 0 && el.offsetWidth > 0 && el.getAttribute('aria-hidden') !== 'true' && getComputedStyle(el).visibility !== 'hidden')
      .sort((a, b) => { const d = (a.tabIndex || 0) - (b.tabIndex || 0); return d !== 0 ? d : (a.compareDocumentPosition(b) & 4 ? -1 : 1); });

    els.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      outline(el, '#4299e1', '');
      badge(el, String(i + 1), '#4299e1', '#fff', 'transform:translate(-50%,-100%);left:' + (r.left + r.width / 2) + 'px;border-radius:50%;width:20px;height:20px;text-align:center;line-height:16px;font-size:10px;padding:2px;');
    });

    vizPanel('🔢 Tab Order — ' + els.length + ' elements',
      '<div style="font-size:12px;color:#a0aec0;margin-bottom:8px">Blue badges show keyboard tab sequence</div>'
      + els.map((el, i) => '<div style="padding:3px 0;border-bottom:1px solid #2d3748;font-size:11px">'
        + '<span style="color:#4299e1;font-weight:700;margin-right:6px">' + (i+1) + '</span>'
        + '<span style="color:#90cdf4">' + getSail(el) + '</span> &lt;' + el.tagName.toLowerCase() + '&gt; '
        + (el.getAttribute('aria-label') || el.textContent?.trim().slice(0,30) || '(no label)') + '</div>').join(''));
  }

  // ===== HEADINGS =====
  else if (MODE === 'headings') {
    const headings = $('h1,h2,h3,h4,h5,h6,[role="heading"]');
    const colors = ['','#e53e3e','#dd6b20','#d69e2e','#38a169','#3182ce','#805ad5'];
    let html = '', prevLv = 0;
    headings.forEach(el => {
      const lv = el.getAttribute('aria-level') ? +el.getAttribute('aria-level') : +el.tagName?.[1] || 0;
      const text = el.textContent?.trim().slice(0,60) || '(empty)';
      const c = colors[lv] || '#a0aec0';
      const skip = prevLv && lv > prevLv + 1;
      outline(el, c, 'H' + lv);
      html += '<div style="padding:3px 0;padding-left:' + ((lv-1)*16) + 'px;border-bottom:1px solid #2d3748;font-size:12px">'
        + '<span style="color:' + c + ';font-weight:700">H' + lv + '</span> ' + text
        + (skip ? ' <span style="color:#e53e3e;font-size:10px">⚠ skipped</span>' : '')
        + (text === '(empty)' ? ' <span style="color:#e53e3e;font-size:10px">⚠ empty</span>' : '') + '</div>';
      prevLv = lv;
    });
    vizPanel('📑 Headings — ' + headings.length, html || '<div style="color:#a0aec0">No headings found</div>');
  }

  // ===== LANDMARKS =====
  else if (MODE === 'landmarks') {
    const sel = 'header,[role="banner"],nav,[role="navigation"],main,[role="main"],aside,[role="complementary"],footer,[role="contentinfo"],[role="search"],[role="form"],section[aria-label],section[aria-labelledby],[role="region"][aria-label],[role="region"][aria-labelledby]';
    const els = $(sel);
    const cMap = { banner:'#e53e3e', navigation:'#dd6b20', main:'#38a169', complementary:'#805ad5', contentinfo:'#3182ce', search:'#d69e2e', form:'#319795', region:'#718096' };
    const roleOf = el => el.getAttribute('role') || { HEADER:'banner', NAV:'navigation', MAIN:'main', ASIDE:'complementary', FOOTER:'contentinfo', SECTION:'region' }[el.tagName] || 'region';
    let html = '';
    els.forEach(el => {
      const role = roleOf(el), c = cMap[role] || '#718096';
      const label = el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') ? document.getElementById(el.getAttribute('aria-labelledby'))?.textContent?.trim() : '') || '';
      outline(el, c, role + (label ? ': ' + label.slice(0,25) : ''));
      html += '<div style="padding:4px 0;border-bottom:1px solid #2d3748;font-size:12px">'
        + '<span style="display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700;background:' + c + ';color:#fff;margin-right:6px">' + role + '</span>'
        + '<span style="color:#90cdf4">' + getSail(el) + '</span>'
        + (label ? ' — "' + label + '"' : ' <span style="color:#d69e2e;font-size:10px">⚠ no label</span>') + '</div>';
    });
    vizPanel('🗺️ Landmarks — ' + els.length, html || '<div style="color:#a0aec0">No landmarks found</div>');
  }

  // ===== ALT TEXT =====
  else if (MODE === 'alttext') {
    const imgs = $('img,svg,[role="img"]');
    let html = '';
    imgs.forEach(el => {
      const alt = el.getAttribute('alt'), ariaLabel = el.getAttribute('aria-label'), hidden = el.getAttribute('aria-hidden') === 'true';
      const title = el.querySelector?.('title')?.textContent;
      const text = alt ?? ariaLabel ?? title ?? null;
      const sail = getSail(el);
      if (hidden) { badge(el, '🚫 decorative', '#4a5568', '#a0aec0'); html += '<div style="padding:3px 0;border-bottom:1px solid #2d3748;font-size:11px;color:#718096"><span style="color:#90cdf4">' + sail + '</span> — decorative</div>'; }
      else if (text !== null && text !== '') { badge(el, '✅ ' + text.slice(0,30), '#276749'); html += '<div style="padding:3px 0;border-bottom:1px solid #2d3748;font-size:11px"><span style="color:#90cdf4">' + sail + '</span> — <span style="color:#68d391">"' + text.slice(0,50) + '"</span></div>'; }
      else if (alt === '') { badge(el, '⬜ alt=""', '#4a5568', '#a0aec0'); html += '<div style="padding:3px 0;border-bottom:1px solid #2d3748;font-size:11px;color:#718096"><span style="color:#90cdf4">' + sail + '</span> — alt="" (decorative)</div>'; }
      else { badge(el, '❌ NO ALT', '#e53e3e'); html += '<div style="padding:3px 0;border-bottom:1px solid #2d3748;font-size:11px"><span style="color:#90cdf4">' + sail + '</span> — <span style="color:#fc8181">MISSING</span></div>'; }
    });
    vizPanel('🖼️ Alt Text — ' + imgs.length + ' images', html || '<div style="color:#a0aec0">No images found</div>');
  }

  // ===== LINKS =====
  else if (MODE === 'links') {
    const links = $('a[href],[role="link"]');
    const vague = /^(click here|here|read more|more|learn more|link|this|download|details|info|view)$/i;
    let html = '';
    links.forEach(el => {
      const text = (el.textContent?.trim() || el.getAttribute('aria-label') || '').slice(0,60);
      const href = el.getAttribute('href') || '';
      const isEmpty = !text, isVague = vague.test(text);
      if (isEmpty) badge(el, '❌ empty link', '#e53e3e');
      else if (isVague) badge(el, '⚠ "' + text + '"', '#d69e2e', '#000');
      html += '<div style="padding:3px 0;border-bottom:1px solid #2d3748;font-size:11px"><span style="color:#90cdf4">' + getSail(el) + '</span> '
        + (isEmpty ? '<span style="color:#fc8181">❌ empty</span>' : isVague ? '<span style="color:#fbd38d">⚠ "' + text + '"</span>' : '"' + text + '"')
        + ' <span style="color:#4a5568;font-size:10px">→ ' + href.slice(0,40) + '</span></div>';
    });
    vizPanel('🔗 Links — ' + links.length, html || '<div style="color:#a0aec0">No links found</div>');
  }

  // ===== ARIA =====
  else if (MODE === 'aria') {
    const els = $('[role],[aria-label],[aria-labelledby],[aria-describedby],[aria-expanded],[aria-selected],[aria-checked],[aria-hidden],[aria-live],[aria-controls],[aria-haspopup],[aria-required],[aria-invalid],[aria-disabled],[aria-pressed],[aria-current],[aria-modal]');
    let html = '';
    els.forEach(el => {
      const attrs = [...el.attributes].filter(a => a.name === 'role' || a.name.startsWith('aria-'));
      if (!attrs.length) return;
      if (el.getAttribute('role')) outline(el, '#805ad5', el.getAttribute('role'));
      html += '<div style="padding:4px 0;border-bottom:1px solid #2d3748;font-size:11px"><span style="color:#90cdf4">' + getSail(el) + '</span> &lt;' + el.tagName.toLowerCase() + '&gt;'
        + '<div style="padding-left:12px;color:#d6bcfa">' + attrs.map(a => '<span style="color:#b794f4">' + a.name + '</span>=<span style="color:#68d391">"' + (a.value||'').slice(0,40) + '"</span>').join(' ') + '</div></div>';
    });
    vizPanel('♿ ARIA — ' + els.length + ' elements', html || '<div style="color:#a0aec0">No ARIA attributes found</div>');
  }

  // ===== TEXT SPACING =====
  else if (MODE === 'textspacing') {
    const style = document.createElement('style');
    style.setAttribute('data-a11y-viz', '1');
    style.textContent = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p, li, dd, dt, td, th, span, div, label, a, button { margin-bottom: 2em !important; }';
    document.head.appendChild(style);
    vizPanel('📏 Text Spacing (WCAG 1.4.12)',
      '<div style="font-size:12px;margin-bottom:10px">Overrides active. Check that:</div>'
      + '<ul style="font-size:12px;padding-left:16px;line-height:1.8"><li>No text clipped/overlapping</li><li>No content disappears</li><li>No horizontal scrollbar</li><li>Controls remain usable</li></ul>'
      + '<div style="font-size:11px;color:#a0aec0;margin-top:10px">Close panel to remove overrides.</div>');
  }

  // ===== LANGUAGE =====
  else if (MODE === 'lang') {
    const htmlLang = document.documentElement.getAttribute('lang');
    const els = $('[lang]');
    let html = '<div style="font-size:13px;margin-bottom:12px;padding:8px;border-radius:4px;background:' + (htmlLang ? '#27664233' : '#e53e3e33') + '">'
      + (htmlLang ? '✅ Page language: <strong>' + htmlLang + '</strong>' : '❌ <strong>Missing lang on &lt;html&gt;</strong>') + '</div>'
      + '<div style="font-size:12px;font-weight:700;margin-bottom:6px">Elements with lang (' + els.length + '):</div>';
    els.forEach(el => {
      html += '<div style="padding:2px 0;font-size:11px;border-bottom:1px solid #2d3748">&lt;' + el.tagName.toLowerCase() + '&gt; lang="<span style="color:#68d391">' + el.getAttribute('lang') + '</span>"'
        + (el.textContent?.trim() ? ' — "' + el.textContent.trim().slice(0,40) + '"' : '') + '</div>';
    });
    if (!htmlLang) html += '<div style="margin-top:10px;font-size:11px;color:#90cdf4">💡 Set at Appian environment level. Contact your admin.</div>';
    vizPanel('🌐 Language — ' + els.length + ' elements', html);
  }

  return MODE;
})();
