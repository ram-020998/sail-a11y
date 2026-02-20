/**
 * SAIL A11y — WCAG Extended Checks
 * Additional WCAG checks not covered in Squad-Level
 * Depends on: core.js (SailA11y global)
 */
'use strict';

window.SailA11yChecks = window.SailA11yChecks || {};

SailA11yChecks.runWcagChecks = function(issues, addFn) {
  const { $, isInsideGrid, getSail } = SailA11y;
  const add = addFn;

  // Buttons need name
  $('button,[role="button"]').forEach(el => {
    if (el.getAttribute('aria-hidden') === 'true') return;
    if (!(el.textContent.trim() || el.getAttribute('aria-label') || el.getAttribute('title'))) {
      const inGrid = isInsideGrid(el);
      add(el, inGrid ? 'warning' : 'error', 'WCAG: Buttons', getSail(el) + ' is missing an accessible name',
        inGrid ? 'Add "accessibilityText" to the button in your grid column.'
          : 'Add visible "label" or "accessibilityText" to your ' + getSail(el) + '.');
    }
  });

  // Tables
  $('table').forEach(el => {
    if (!el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label') && !el.querySelector('caption'))
      add(el, 'error', 'WCAG: Tables', getSail(el) + ' is missing an accessible label', 'Add the "label" parameter to your ' + getSail(el) + '.');
    if (!el.querySelector('th'))
      add(el, 'warning', 'WCAG: Tables', getSail(el) + ' has no column headers', 'Ensure "showHeader: true" on your ' + getSail(el) + '.');
  });

  // Progress bars
  $('[role="progressbar"]').forEach(el => {
    if (el.getAttribute('aria-labelledby') || el.getAttribute('aria-label')) return;
    const field = el.closest('[class*="FieldLayout"]');
    if (field?.querySelector('[class*="field_label"]')?.textContent?.trim()) return;
    add(el, 'error', 'WCAG: Progress', getSail(el) + ' is missing an accessible label', 'Add "label" or "accessibilityText".');
  });

  // Regions
  $('[role="region"],section').forEach(el => {
    if (!el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label'))
      add(el, 'warning', 'WCAG: Regions', getSail(el) + ' region is missing a label', 'Add "label" to your ' + getSail(el) + '.');
  });

  // Tabs
  $('[role="tablist"]').forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
      add(el, 'warning', 'WCAG: Tabs', getSail(el) + ' tab group is missing a label', 'Add "accessibilityText" to your tab layout.');
  });
  $('[role="tab"]').forEach(el => {
    if (!el.getAttribute('aria-selected')) add(el, 'warning', 'WCAG: Tabs', 'Tab is missing aria-selected state', 'Typically handled by Appian automatically.');
    if (!el.getAttribute('aria-controls')) add(el, 'warning', 'WCAG: Tabs', 'Tab is missing aria-controls', 'Typically handled by Appian automatically.');
  });

  // Dialogs
  $('[role="dialog"],[role="alertdialog"],dialog').forEach(el => {
    if (!el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label'))
      add(el, 'error', 'WCAG: Dialogs', 'Dialog is missing an accessible label', 'Use the "title" parameter on your dialog component.');
  });

  // iFrame missing title
  $('iframe').forEach(el => {
    if (el.getAttribute('aria-hidden') !== 'true' && !el.getAttribute('title') && !el.getAttribute('aria-label') && !el.id?.match(/^appian/i))
      add(el, 'error', 'WCAG: Frames', 'iFrame is missing a title', 'Add title="..." describing its content.');
  });

  // Interactive nesting
  $('a a, a button, button a, button button, [role="link"] [role="link"], [role="button"] [role="button"]').forEach(el => {
    if (!el.closest('[class*="CardLayout---"]'))
      add(el, 'error', 'WCAG: Nesting', 'Interactive element nested inside another interactive',
        'Restructure — buttons/links must not contain other buttons/links.');
  });
};
