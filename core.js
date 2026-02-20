/**
 * SAIL A11y Checker — Shared Core Module
 * Provides DOM helpers, SAIL component detection, and UI utilities
 * used by scanner.js, recorder.js, and visualizers.js.
 */
'use strict';

if (typeof SailA11y === 'undefined') {
var SailA11y = (() => {

  // --- DOM Helpers ---

  const getScope = () => {
    if (window.__sailA11ySettings?.dialogOnly === false) return document;
    return document.querySelector('[role="dialog"]:not([aria-hidden="true"]), [role="alertdialog"]:not([aria-hidden="true"]), dialog[open], [class*="Dialog---"]:not([aria-hidden="true"])') || document;
  };

  const $ = (selector, ctx) => [...(ctx || getScope()).querySelectorAll(selector)];

  const isInsideGrid = el =>
    !!el.closest('td, th, [role="cell"], [role="gridcell"], [role="rowheader"], [role="columnheader"]');

  const isInsideSiteNav = el =>
    !!el.closest('[class*="VirtualNavigation"], [class*="TabButtonGroup---tab_button_group"], [class*="SitesNav"], [class*="SitePages"], [class*="LeftNav"], [class*="site-nav"], [class*="SiteNav"], [class*="TopNav"], [class*="SITE_HEADER"], [class*="SiteHeader"], [class*="NAVIGATION_MENU"], [class*="NavigationMenu"], [class*="SiteTabs"]');

  const isGridSelectionCheckbox = el =>
    !!(el.closest('[class*="---no_label"]') || el.closest('[class*="row_selection"]') || el.closest('[class*="headerCell_selection"]'));

  const hasLabel = el =>
    el.getAttribute('aria-label') ||
    el.getAttribute('aria-labelledby') ||
    (el.id && document.querySelector('label[for="' + el.id + '"]'));

  // --- SAIL Component Detection ---

  const SAIL_MAP = {
    'ButtonWidget': 'a!buttonWidget', 'Button': 'a!buttonWidget',
    'SubmitButton': 'a!buttonWidgetSubmit',
    'LinkField': 'a!linkField', 'Link': 'a!linkField',
    'CardLayout': 'a!cardLayout', 'CardWidget': 'a!cardLayout',
    'CheckboxGroup': 'a!checkboxField',
    'RadioButtonGroup': 'a!radioButtonField', 'RadioGroup': 'a!radioButtonField',
    'DropdownField': 'a!dropdownField', 'Dropdown': 'a!dropdownField',
    'TextField': 'a!textField', 'TextInput': 'a!textField',
    'ParagraphField': 'a!paragraphField',
    'IntegerField': 'a!integerField', 'DecimalField': 'a!decimalField',
    'DateField': 'a!dateField', 'DateTimeField': 'a!dateTimeField',
    'PickerField': 'a!pickerFieldUsers',
    'ImageField': 'a!imageField', 'Image': 'a!imageField',
    'DocumentImage': 'a!documentImage', 'WebImage': 'a!webImage',
    'StampField': 'a!stampField',
    'IconField': 'a!iconField', 'Icon': 'a!iconField',
    'RichTextIcon': 'a!richTextIcon', 'RichText': 'a!richTextDisplayField',
    'GridField': 'a!gridField', 'Grid': 'a!gridField',
    'PagingGrid': 'a!gridField', 'RecordGrid': 'a!recordGrid',
    'TabLayout': 'a!tabLayout (or similar)', 'Tabs': 'a!tabLayout (or similar)',
    'SectionLayout': 'a!sectionLayout', 'Section': 'a!sectionLayout',
    'BoxLayout': 'a!boxLayout',
    'ColumnLayout': 'a!columnsLayout', 'SideBySide': 'a!sideBySideLayout',
    'Milestone': 'a!milestoneField', 'ProgressBar': 'a!progressBarField',
    'BillboardLayout': 'a!billboardLayout',
    'HeaderContent': 'a!headerContentLayout',
    'FormLayout': 'a!formLayout',
    'RecordHeader': 'Record Header', 'SitePages': 'Site Page',
    'elements': 'Appian base element',
  };

  function sailName(el) {
    let node = el;
    for (let i = 0; i < 6 && node; i++) {
      const cls = [...(node.classList || [])].find(c => c.includes('---'));
      if (cls) return cls.split('---')[0];
      node = node.parentElement;
    }
    return null;
  }

  function sailContext(el) {
    const name = sailName(el);
    if (!name) return { component: el.tagName.toLowerCase(), sail: el.tagName.toLowerCase() };
    return { component: name, sail: SAIL_MAP[name] || name };
  }

  function getSail(el) {
    return sailContext(el).sail;
  }

  // --- Contrast Utilities ---

  const parseColor = s => {
    const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  };

  const luminance = ([r, g, b]) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const getBackgroundColor = el => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parseColor(getComputedStyle(n).backgroundColor);
      if (c && (c[0] || c[1] || c[2])) return c;
      n = n.parentElement;
    }
    return [255, 255, 255];
  };

  const contrastRatio = (fg, bg) => {
    const l1 = luminance(fg), l2 = luminance(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  // --- UI Utilities (inline styles only) ---

  function createPanel(id, title, contentHtml, opts = {}) {
    const width = opts.width || 480;
    const panel = document.createElement('div');
    panel.id = id;
    panel.style.cssText = 'position:fixed;top:20px;right:20px;width:' + width + 'px;max-height:' + (opts.maxHeight || '80vh') + ';min-height:120px;background:#1a202c;color:#e2e8f0;font:13px system-ui,sans-serif;z-index:2147483647;border-radius:8px;box-shadow:0 4px 24px rgba(0,0,0,.5);display:flex;flex-direction:column;border:1px solid #4a5568;overflow:hidden';

    panel.innerHTML =
      '<div data-drag-handle style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#2d3748;border-radius:8px 8px 0 0;flex-shrink:0;cursor:move;user-select:none">'
      + '<span style="font-size:15px;font-weight:700">' + title + '</span>'
      + '<button data-close-btn style="background:none;border:none;color:#a0aec0;cursor:pointer;font-size:20px;line-height:1">✕</button></div>'
      + '<div style="overflow-y:auto;padding:12px 16px">' + contentHtml + '</div>';

    document.body.appendChild(panel);
    makeDraggable(panel);

    panel.querySelector('[data-close-btn]').addEventListener('click', () => {
      if (opts.onClose) opts.onClose();
      panel.remove();
    });

    return panel;
  }

  function makeDraggable(panel) {
    const handle = panel.querySelector('[data-drag-handle]');
    if (!handle) return;
    let dx = 0, dy = 0, mx = 0, my = 0;
    handle.addEventListener('mousedown', e => {
      if (e.target.tagName === 'BUTTON') return;
      mx = e.clientX; my = e.clientY;
      const move = e2 => {
        dx = mx - e2.clientX; dy = my - e2.clientY;
        mx = e2.clientX; my = e2.clientY;
        panel.style.top = (panel.offsetTop - dy) + 'px';
        panel.style.left = (panel.offsetLeft - dx) + 'px';
        panel.style.right = 'auto';
      };
      const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  function showToast(text, durationMs = 3000) {
    const toast = document.createElement('div');
    toast.textContent = text;
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a202c;color:#e2e8f0;padding:10px 20px;border-radius:8px;font:13px system-ui,sans-serif;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.3);border:1px solid #e53e3e;transition:opacity .5s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, durationMs);
  }

  function cleanup() {
    document.getElementById('sail-a11y-panel')?.remove();
    $('[data-a11y-issue]').forEach(el => {
      el.style.outline = ''; el.style.outlineOffset = ''; el.removeAttribute('data-a11y-issue');
    });
    $('[data-a11y-viz]').forEach(e => e.remove());
  }

  // --- Viz Helpers ---

  function badge(el, text, bg, fg = '#fff', extraCss = '') {
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) return null;
    const d = document.createElement('div');
    d.setAttribute('data-a11y-viz', '1');
    d.textContent = text;
    d.style.cssText = 'position:fixed;z-index:2147483646;font:bold 11px system-ui,sans-serif;padding:2px 5px;border-radius:3px;pointer-events:none;white-space:nowrap;'
      + 'background:' + bg + ';color:' + fg + ';left:' + rect.left + 'px;top:' + rect.top + 'px;' + extraCss;
    document.body.appendChild(d);
    return d;
  }

  function outline(el, color, label) {
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) return;
    const d = document.createElement('div');
    d.setAttribute('data-a11y-viz', '1');
    d.style.cssText = 'position:fixed;z-index:2147483645;border:2px solid ' + color + ';border-radius:3px;pointer-events:none;'
      + 'left:' + rect.left + 'px;top:' + rect.top + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;';
    document.body.appendChild(d);
    if (label) badge(el, label, color, '#fff', 'transform:translateY(-100%);font-size:10px;');
  }

  // --- Element Forensics (like axe-core) ---
  function getUniqueSelector(el) {
    if (el.id) return '#' + CSS.escape(el.id);
    const parts = [];
    while (el && el !== document.documentElement) {
      let sel = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        const cls = el.className.trim().split(/\s+/).filter(c => !c.includes('---')).slice(0, 2);
        if (cls.length) sel += '.' + cls.map(c => CSS.escape(c)).join('.');
      }
      if (el.parentElement) {
        const sibs = [...el.parentElement.children].filter(s => s.tagName === el.tagName);
        if (sibs.length > 1) sel += ':nth-child(' + ([...el.parentElement.children].indexOf(el) + 1) + ')';
      }
      parts.unshift(sel);
      if (document.querySelectorAll(parts.join(' > ')).length === 1) break;
      el = el.parentElement;
    }
    return parts.join(' > ');
  }

  function getElementSource(el) {
    const clone = el.cloneNode(false);
    let html = clone.outerHTML || '';
    if (html.length > 300) html = html.slice(0, 300) + '…>';
    return html;
  }

  function getElementRect(el) {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  }

  // --- Public API ---
  return {
    $, getScope, isInsideGrid, isInsideSiteNav, isGridSelectionCheckbox, hasLabel,
    sailName, sailContext, getSail, SAIL_MAP,
    parseColor, luminance, getBackgroundColor, contrastRatio,
    createPanel, makeDraggable, showToast, cleanup,
    badge, outline,
    getUniqueSelector, getElementSource, getElementRect,
  };

})();
}
