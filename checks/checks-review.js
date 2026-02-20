/**
 * SAIL A11y — Review Required Checks
 * Items requiring human judgment
 * Depends on: core.js (SailA11y)
 */
'use strict';

window.SailA11yChecks = window.SailA11yChecks || {};

SailA11yChecks.runReviewChecks = function(issues, addFn) {
  const { $, isInsideGrid } = SailA11y;
  const add = addFn;

  // Duplicate buttons/links
  const btnNames = {};
  $('button,[role="button"],a[href],[role="link"]').forEach(el => {
    if (el.getAttribute('aria-hidden') === 'true' || !el.offsetWidth) return;
    const name = (el.getAttribute('aria-label') || el.textContent?.trim() || '').slice(0,50).toLowerCase();
    if (!name || name.length < 2) return;
    (btnNames[name] = btnNames[name] || []).push(el);
  });
  Object.entries(btnNames).forEach(([name, els]) => {
    if (els.length > 1) els.forEach(el => {
      if (!el.getAttribute('aria-describedby'))
        add(el, 'warning', 'Review: Names',
          'Duplicate ' + (el.matches('a,[role="link"]') ? 'link' : 'button') + ' name "' + name.slice(0,30) + '" — ' + els.length + ' instances',
          'Add "accessibilityText" to each to provide unique context.');
    });
  });

  // Redundant accessibilityText
  $('[aria-describedby]').forEach(el => {
    const descEl = document.getElementById(el.getAttribute('aria-describedby'));
    if (!descEl) return;
    const d = descEl.textContent?.trim().toLowerCase(), l = (el.getAttribute('aria-label') || '').trim().toLowerCase();
    if (d && d.length > 1 && l && (d === l || l.includes(d) || d.includes(l)))
      add(el, 'warning', 'Review: A11y Text', 'accessibilityText duplicates the label — remove or make unique',
        'Remove accessibilityText or add context not already on screen.');
  });

  // Rich text before input
  $('[class*="FieldLayout---"]').forEach(field => {
    if (!field.querySelector('input,select,textarea')) return;
    let wrapper = field;
    while (wrapper.parentElement && !wrapper.parentElement.matches('[class*="ColumnLayout---"],[class*="FormLayout---"],[class*="SectionLayout---"],form,body'))
      wrapper = wrapper.parentElement;
    const prev = wrapper.previousElementSibling || field.previousElementSibling;
    if (!prev) return;
    const rt = prev.matches?.('[class*="RichText---"]') ? prev : prev.querySelector?.('[class*="RichText---"]');
    if (!rt) return;
    const t = rt.textContent?.trim();
    if (t && t.length > 20 && /enter|select|provide|choose|must|should|format|example|e\.g\.|note:/i.test(t))
      add(field, 'warning', 'Review: Instructions', 'Rich text before input may be unassociated instructions',
        'Use the "instructions" parameter instead of rich text above the field.');
  });
  $('table,[role="grid"]').forEach(grid => {
    const prev = grid.previousElementSibling;
    if (!prev) return;
    const rt = prev.matches?.('[class*="RichText---"]') ? prev : prev.querySelector?.('[class*="RichText---"]');
    if (rt && rt.textContent?.trim().length > 20)
      add(grid, 'warning', 'Review: Instructions', 'Rich text before grid may be unassociated instructions',
        'Use the "instructions" parameter on a!gridField.');
  });

  // Decorative icons with duplicate alt
  $('a svg[aria-label], a img[alt], button svg[aria-label], button img[alt]').forEach(el => {
    const iconText = (el.getAttribute('aria-label') || el.getAttribute('alt') || '').trim().toLowerCase();
    if (!iconText) return;
    const parent = el.closest('a,button'), clone = parent.cloneNode(true);
    clone.querySelectorAll('svg,img').forEach(i => i.remove());
    const pt = clone.textContent?.trim().toLowerCase();
    if (pt && (iconText === pt || pt.includes(iconText)))
      add(el, 'warning', 'Review: Icons', 'Icon alt "' + iconText.slice(0,25) + '" duplicates adjacent text',
        'Set altText: "" or aria-hidden="true" on the icon.');
  });

  // Generic/confusing labels
  const genericRe = /^(rich text|image|stamp|icon|text|label|field|content|div|span|section)$/i;
  const internalRe = /^(acs_|AS_|ri!|rule!|local!|pv!|cons!)/;
  $('[aria-label]').forEach(el => {
    const l = el.getAttribute('aria-label').trim();
    if (!l) return;
    if (genericRe.test(l))
      add(el, 'warning', 'Review: Labels', 'Generic label "' + l + '"', 'Provide a meaningful label or set accessibilityText: "".');
    else if (internalRe.test(l))
      add(el, 'error', 'Review: Labels', 'Internal variable name as label: "' + l.slice(0,30) + '"', 'Replace with a user-friendly description.');
  });

  // Page title
  const pt = document.title?.trim();
  if (!pt) add(document.documentElement, 'error', 'Review: Page', 'Page has no title', 'Set a descriptive site page name in Appian.');
  else if (pt.length < 5 || /^(appian|home|page|untitled|new tab)$/i.test(pt))
    add(document.documentElement, 'warning', 'Review: Page', 'Page title "' + pt.slice(0,30) + '" may not be descriptive',
      'Set a descriptive name for each site page.');

  // Target size < 24x24px non-grid
  $('a[href],button,[role="button"],[role="link"]').forEach(el => {
    if (el.getAttribute('aria-hidden') === 'true' || isInsideGrid(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.width < 24 && r.height < 24)
      add(el, 'warning', 'Review: Target Size', 'Element is ' + Math.round(r.width) + 'x' + Math.round(r.height) + 'px — below 24x24px',
        'Add padding or use a larger element.');
  });
};
