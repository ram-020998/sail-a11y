/**
 * SAIL A11y — Appian Platform Checks
 * Appian-specific patterns not covered in Squad-Level
 * Depends on: core.js (SailA11y)
 */
'use strict';

window.SailA11yChecks = window.SailA11yChecks || {};

SailA11yChecks.runAppianChecks = function(issues, addFn) {
  const { $ } = SailA11y;
  const add = addFn;

  // Clickable cards missing role
  $('[class*="CardLayout"],[class*="card"]').forEach(el => {
    if ((el.onclick || el.style.cursor === 'pointer') && !el.getAttribute('role'))
      add(el, 'warning', 'Appian: Cards', 'a!cardLayout is interactive but missing an ARIA role',
        'Add "accessibilityText" to describe the card action.');
  });

  // Stamp/icon fields
  $('[class*="StampWidget"],[class*="IconWidget"]').forEach(el => {
    if (el.getAttribute('aria-hidden') !== 'true' && !el.getAttribute('aria-label'))
      add(el, 'warning', 'Appian: Stamps', 'Stamp/icon field is missing accessibilityText',
        'Add "accessibilityText" or hide with "showWhen".');
  });

  // Dynamic messages (announceBehavior)
  $('[role="alert"], [role="status"], [class*="MessageBanner---"]').forEach(el => {
    if (el.getAttribute('aria-live') || el.closest('[aria-live]') || el.getAttribute('role') === 'alert' || el.getAttribute('role') === 'status') return;
    add(el, 'warning', 'Appian: Dynamic', 'Dynamic message may need announceBehavior',
      'Use a!messageBanner with "announceBehavior" parameter.');
  });
};
