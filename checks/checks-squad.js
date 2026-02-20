/**
 * SAIL A11y — Squad-Level Checks (Aurora Priority)
 * All checks from Aurora's Squad-Level accessibility checklist
 * Depends on: core.js (SailA11y global)
 */
'use strict';

window.SailA11yChecks = window.SailA11yChecks || {};

SailA11yChecks.runSquadChecks = function(issues, addFn) {
  const { $, isInsideGrid, isGridSelectionCheckbox, hasLabel, getSail, sailContext, parseColor, getBackgroundColor, contrastRatio } = SailA11y;
  const add = addFn;

  console.log('[SAIL A11y] Running Squad-Level checks...');

  // ========== FORMS ==========
  
  // Forms: inputs need labels
  $('input,select,textarea').forEach(el => {
    if (el.type === 'hidden' || el.getAttribute('aria-hidden') === 'true') return;
    if (isInsideGrid(el)) return;
    if (!hasLabel(el)) {
      const ctx = sailContext(el);
      add(el, 'error', 'Squad: Forms', ctx.sail + ' is missing an accessible label',
        'Add the "label" parameter to your ' + ctx.sail + '. If hidden visually, use "labelPosition: COLLAPSED".');
    }
  });

  // Forms: groups need labels
  $('[role="group"],[role="radiogroup"]').forEach(el => {
    if (el.getAttribute('aria-labelledby') || el.getAttribute('aria-label')) return;
    if (isInsideGrid(el) || isGridSelectionCheckbox(el)) return;
    const cn = el.className?.baseVal || el.className || '';
    if (typeof cn === 'string' && /CardGroup|CardChoice/i.test(cn)) return;
    const ctx = sailContext(el);
    add(el, 'error', 'Squad: Forms', ctx.sail + ' (role="' + el.getAttribute('role') + '") is missing a group label',
      'Add the "label" parameter to your ' + ctx.sail + '.');
  });

  // Placeholder as only info
  $('input[placeholder], textarea[placeholder]').forEach(el => {
    if (isInsideGrid(el)) return;
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return;
    const field = el.closest('[class*="FieldLayout"]');
    if (!field) return;
    
    // Check for field_label specifically (not just any element with "label" in class)
    const hasFieldLabel = field.querySelector('[class*="field_label"]');
    if (hasFieldLabel && hasFieldLabel.textContent?.trim()) return;
    
    // Check for instructions
    const hasInstructions = field.querySelector('[class*="instructions"]');
    if (hasInstructions && hasInstructions.textContent?.trim()) return;
    
    // Check for associated label element
    if (el.id && document.querySelector(`label[for="${el.id}"]`)) return;
    
    add(el, 'warning', 'Squad: Forms', 'Input uses placeholder with no visible label or instructions',
      'Add a "label" and use "instructions" for formats/ranges.');
  });

  // Collapsed label
  $('[class*="COLLAPSED"], [class*="collapsed"]').forEach(el => {
    const field = el.closest('[class*="FieldLayout"]');
    if (!field) return;
    const prev = field.previousElementSibling;
    if (!prev?.querySelector('h1,h2,h3,h4,h5,h6,[role="heading"]'))
      add(el, 'warning', 'Squad: Forms', 'Input has collapsed label — verify a visible heading precedes it',
        'When using labelPosition: COLLAPSED, a visible heading must precede the input.');
  });

  // Duplicate input labels
  const labelTexts = {};
  $('[class*="FieldLayout"]').forEach(field => {
    const cn = field.className?.baseVal || field.className || '';
    if (typeof cn === 'string' && cn.includes('accessibilityhidden')) return;
    if (!field.querySelector('input,select,textarea')) return;
    
    // Use field_label specifically
    const labelEl = field.querySelector('[class*="field_label"]');
    const label = labelEl?.textContent?.trim();
    if (label) (labelTexts[label] = labelTexts[label] || []).push(field);
  });
  Object.entries(labelTexts).forEach(([label, fields]) => {
    if (fields.length > 1) fields.forEach(field => {
      const input = field.querySelector('input,select,textarea');
      if (!input?.getAttribute('aria-describedby'))
        add(field, 'warning', 'Squad: Forms', 'Duplicate label "' + label.slice(0,30) + '" — needs accessibilityText',
          'Add "accessibilityText" to each to provide unique context.');
    });
  });

  // Required fields legend
  const hasReq = $('[class*="required_star"], [class*="---required"], [aria-required="true"]').length > 0;
  if (hasReq && !document.body.textContent.match(/required.*(asterisk|marked|\*)/i)) {
    const first = $('[class*="required_star"], [class*="---required"]')[0];
    if (first) add(first, 'warning', 'Squad: Forms', 'Page has required fields but no legend explaining the asterisk',
      'Add: "Required fields are marked with an asterisk (*)".');
  }

  // Single checkbox redundant label
  $('[class*="CheckboxGroup"]').forEach(el => {
    const choices = el.querySelectorAll('[class*="choice"], input[type="checkbox"]');
    if (choices.length !== 1) return;
    
    // Get group label from field_label
    const groupLabelEl = el.querySelector('[class*="field_label"]');
    const gl = (el.getAttribute('aria-label') || groupLabelEl?.textContent?.trim() || '').toLowerCase();
    
    const cl = (choices[0].closest('label')?.textContent?.trim() || choices[0].getAttribute('aria-label') || '').toLowerCase();
    if (gl && cl && gl === cl)
      add(el, 'warning', 'Squad: Forms', 'Single checkbox group/choice labels match: "' + gl.slice(0,25) + '"',
        'Set label: "" or use a different group label.');
  });

  // Autocomplete for personal fields
  $('input[type="text"], input[type="email"], input[type="tel"], input:not([type])').forEach(el => {
    if (isInsideGrid(el)) return;
    const label = (el.getAttribute('aria-label') || el.closest('label')?.textContent || '').toLowerCase();
    if (['name','email','phone','address','city','state','zip','country'].some(f => label.includes(f)) && !el.getAttribute('autocomplete'))
      add(el, 'warning', 'Squad: Forms', 'Personal info field may need inputPurpose', 'Set "inputPurpose" parameter (e.g., "NAME", "EMAIL").');
  });

  // ========== VALIDATIONS ==========

  // Required inputs
  $('[class*="required_star"], [class*="---required"]').forEach(el => {
    const input = el.closest('[class*="FieldLayout---"]')?.querySelector('input, select, textarea');
    if (input && !input.hasAttribute('required') && input.getAttribute('aria-required') !== 'true')
      add(input || el, 'warning', 'Squad: Validations', 'Input appears required but missing aria-required', 'Set "required: true" on the component.');
  });

  // Validation missing field name
  const genericErr = /^(a value is required|this field is required|invalid value|value is not valid|enter a valid|please enter|required field)/i;
  $('[role="alert"],[class*="validation"],[class*="error_message"],[class*="---error"]').forEach(el => {
    const t = el.textContent?.trim();
    if (t && t.length > 4 && t.length < 100 && genericErr.test(t))
      add(el, 'warning', 'Squad: Validations', 'Validation missing field name: "' + t.slice(0,40) + '"',
        'Include the field name in the message.');
  });

  // ========== GRIDS ==========

  // Grid instructions
  $('table[aria-labelledby], table[aria-label]').forEach(el => {
    if (!el.getAttribute('aria-describedby'))
      add(el, 'warning', 'Squad: Grids', 'Grid may be missing instructions', 'Use the "instructions" parameter on a!gridField.');
  });

  // Grid selection
  $('table[aria-labelledby], table[aria-label]').forEach(el => {
    const hasSel = el.querySelector('[class*="selection"], [class*="SelectionCheckbox"], input[type="checkbox"]');
    if (hasSel) {
      const label = el.getAttribute('aria-label') || '';
      if (!label.toLowerCase().includes('select') && !el.getAttribute('aria-describedby'))
        add(el, 'warning', 'Squad: Grids', 'Grid with row selection may need accessibilityText',
          'Add "accessibilityText" to warn about selection behavior.');
    }
  });

  // Grid empty columns
  $('table th, table [role="columnheader"]').forEach(th => {
    if (th.textContent.trim() || th.querySelector('input,button,a')) return;
    const idx = [...th.parentElement.children].indexOf(th);
    const tbody = th.closest('table')?.querySelector('tbody');
    if (tbody && [...tbody.querySelectorAll('tr')].every(row => {
      const cell = row.children[idx];
      return cell && !cell.textContent.trim() && !cell.querySelector('input,button,a,img,svg');
    })) add(th, 'error', 'Squad: Grids', 'Empty grid column — must not be used for spacing', 'Remove empty columns.');
  });

  // Grid row header
  $('table[aria-labelledby], table[aria-label]').forEach(el => {
    if (!el.querySelector('[role="rowheader"], th[scope="row"]'))
      add(el, 'warning', 'Squad: Grids', 'Grid has no row header defined', 'Set "rowHeader" parameter on a!gridField.');
  });

  // Small targets in grids
  $('td a, td button, [role="cell"] a, [role="cell"] button').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.width < 24 && r.height < 24)
      add(el, 'warning', 'Squad: Grids', 'Clickable element in grid may be too small (' + Math.round(r.width) + 'x' + Math.round(r.height) + 'px)',
        'WCAG requires 24x24px minimum. Add padding.');
  });

  // Simulated grid
  $('[class*="SideBySide---"], [class*="ColumnLayout---"]').forEach(el => {
    if (el.querySelectorAll('[class*="Column---"]').length < 3) return;
    if (el.parentElement?.querySelectorAll('[class*="SideBySide---"], [class*="ColumnLayout---"]').length > 1)
      add(el, 'warning', 'Squad: Grids', 'Layout may be a simulated grid', 'Use a!gridField for tabular data.');
  });

  // ========== HEADINGS ==========

  // Heading hierarchy
  let prevLv = 0;
  $('h1,h2,h3,h4,h5,h6,[role="heading"]').forEach(el => {
    const lv = el.getAttribute('aria-level') ? +el.getAttribute('aria-level') : +el.tagName?.[1];
    if (lv && prevLv && lv > prevLv + 1)
      add(el, 'warning', 'Squad: Headings', 'Heading level skipped from h' + prevLv + ' to h' + lv, 'Heading levels should not skip.');
    if (lv) prevLv = lv;
    if (!el.textContent.trim())
      add(el, 'error', 'Squad: Headings', 'Empty heading element found', 'Remove the empty heading or add text content.');
  });

  // Heading-like styled text
  let hcc = 0;
  $('[class*="RichText---"] span, [class*="RichText---"] strong, [class*="RichText---"] b').forEach(el => {
    if (hcc >= 100 || !el.offsetWidth) return;
    if (el.closest('h1,h2,h3,h4,h5,h6,[role="heading"]')) return;
    const t = el.textContent?.trim();
    if (!t || t.length > 60 || t.length < 3) return;
    hcc++;
    const s = getComputedStyle(el);
    if ((s.fontWeight >= 700 || s.fontWeight === 'bold') && parseFloat(s.fontSize) >= 16) {
      const p = el.closest('[class*="RichText---"]');
      if (p && p.textContent?.trim() === t)
        add(el, 'warning', 'Squad: Headings', 'Bold text "' + t.slice(0,30) + '" may need semantic heading',
          'Use a!sectionLayout(label: "' + t.slice(0,20) + '") instead.');
    }
  });

  // ========== LISTS ==========

  // Non-semantic lists
  $('[class*="RichText---"]').forEach(el => {
    if (el.innerHTML.match(/[•●○■▪▸►–—]\s/g)?.length >= 2 && !el.querySelector('ul,ol,[role="list"]'))
      add(el, 'warning', 'Squad: Lists', 'Text uses visual bullets instead of semantic lists', 'Use a!richTextBulletedList instead.');
  });

  // ========== BREADCRUMBS ==========

  $('[class*="Breadcrumb---"], nav[aria-label*="breadcrumb" i]').forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
      add(el, 'error', 'Squad: Breadcrumbs', 'Breadcrumb is missing accessibilityText', 'Add "accessibilityText" identifying it as breadcrumb.');
  });

  // ========== LINKS ==========

  // Links need text
  $('a[href],[role="link"]').forEach(el => {
    if (el.getAttribute('aria-hidden') === 'true') return;
    if (!(el.textContent.trim() || el.getAttribute('aria-label'))) {
      const inGrid = isInsideGrid(el);
      add(el, inGrid ? 'warning' : 'error', 'Squad: Links', getSail(el) + ' link is missing an accessible name',
        inGrid ? 'Add "accessibilityText" to the link in your grid column.'
          : 'Add visible text or "accessibilityText" to your ' + getSail(el) + '.');
    }
  });

  // Links without underline
  $('a[class*="richText"], a[class*="RichText"]').forEach(el => {
    const style = getComputedStyle(el);
    if (!style.textDecoration.includes('underline') && el.parentElement?.childNodes.length > 1)
      add(el, 'warning', 'Squad: Links', 'Inline link may rely only on color', 'Set linkStyle: INLINE for persistent underline.');
  });

  // Adjacent duplicate links
  const allLinks = $('a[href]');
  for (let i = 0; i < allLinks.length - 1; i++) {
    const a = allLinks[i], b = allLinks[i + 1];
    if (a.getAttribute('href') !== b.getAttribute('href')) continue;
    if (a.nextElementSibling === b || a.parentElement === b.parentElement || a.parentElement?.parentElement === b.parentElement?.parentElement)
      add(b, 'warning', 'Squad: Links', 'Adjacent link has same destination — consider combining',
        'Combine into one a!richTextItem(link: ..., text: {icon, text}).');
  }

  // ========== CARDS ==========

  // Card choice / group
  $('[class*="CardChoiceField---"]').forEach(el => {
    if (el.querySelectorAll('[class*="CardLayout---"]').length > 1 && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
      add(el, 'error', 'Squad: Cards', 'a!cardChoiceField missing group label', 'Add the "label" parameter.');
  });
  $('[class*="CardGroupLayout---"], [class*="CardGroup---"]').forEach(el => {
    if (el.querySelectorAll('[class*="CardLayout---"]').length > 1 && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
      add(el, 'error', 'Squad: Cards', 'a!cardGroupLayout missing group label', 'Add the "label" parameter.');
  });

  // Selected card state
  $('[class*="CardLayout---"]').forEach(el => {
    if ((el.classList.toString().includes('selected') || el.classList.toString().includes('active')) && !el.getAttribute('aria-label')?.toLowerCase().includes('selected'))
      add(el, 'warning', 'Squad: Cards', 'Selected card may be missing accessibilityText "Selected"', 'Set accessibilityText to "Selected" when active.');
  });

  // Linked cards with nested controls
  $('[class*="CardLayout---"]').forEach(el => {
    const isLinked = el.closest('a') || el.querySelector(':scope > a') || el.onclick;
    if (isLinked && el.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="link"]').length > 0)
      add(el, 'error', 'Squad: Cards', 'Linked card contains other interactive controls', 'Move interactive elements outside or remove the card link.');
  });

  // Card link label
  $('[class*="CardLayout---"]').forEach(el => {
    const link = el.closest('a');
    if (link?.getAttribute('aria-label'))
      add(el, 'warning', 'Squad: Cards', 'Linked card has a label on the link', 'Remove the label — card content should describe the destination.');
  });

  // ========== FILE UPLOAD ==========

  $('[class*="FileUpload---"]').forEach(el => {
    if (!el.closest('td') && !el.querySelector('[class*="label"]')?.textContent?.trim())
      add(el, 'warning', 'Squad: File Upload', 'a!fileUploadField may be missing a label', 'Add a "label" parameter.');
    if (!el.querySelector('[class*="instructions"]')?.textContent?.trim())
      add(el, 'warning', 'Squad: File Upload', 'a!fileUploadField is missing instructions', 'Add "instructions" with accepted file types.');
  });

  // ========== DATE & TIME ==========

  $('[class*="DateTimeField---"], [class*="DateTimePicker---"]').forEach(el => {
    add(el, 'error', 'Squad: Date & Time', 'a!dateTimeField must NOT be used',
      'Replace with separate a!dateField and a!timeField components.');
  });

  // ========== DYNAMIC MESSAGES ==========

  $('[role="alert"], [role="status"], [class*="MessageBanner---"]').forEach(el => {
    if (!el.getAttribute('aria-live') && !el.closest('[aria-live]') && el.getAttribute('role') !== 'alert' && el.getAttribute('role') !== 'status')
      add(el, 'warning', 'Squad: Dynamic', 'Dynamic message may not be announced', 'Use a!messageBanner with "announceBehavior".');
  });

  // ========== CHARTS ==========

  $('[class*="Chart---"],[class*="BarChart---"],[class*="LineChart---"],[class*="PieChart---"],[class*="ColumnChart---"],[class*="AreaChart---"]').forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
      add(el, 'error', 'Squad: Charts', 'Chart is missing an accessible label', 'Add the "label" parameter.');
  });

  // ========== ICONS ==========

  // SVG icons
  $('svg').forEach(el => {
    if (el.getAttribute('aria-hidden') === 'true') return;
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.querySelector('title')) {
      add(el, 'error', 'Squad: Icons', getSail(el) + ' icon is missing an accessible name',
        'Add "altText" or "accessibilityText". If decorative, use altText: "".');
    }
  });

  // ========== IMAGES ==========

  // Images: need alt
  $('img').forEach(el => {
    if (el.getAttribute('aria-hidden') === 'true') return;
    if (el.getAttribute('alt') === null) {
      const ctx = sailContext(el);
      add(el, 'error', 'Squad: Images', ctx.sail + ' is missing alternative text',
        'Add "altText" to your ' + ctx.sail + '. If decorative, set altText: "".');
    }
  });

  // Image of text
  $('img').forEach(el => {
    if (el.getAttribute('aria-hidden') === 'true') return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 100 && rect.height > 30 && rect.height < 200 && (el.src || '').toLowerCase().match(/banner|header|title|logo|badge|label|tag/))
      add(el, 'warning', 'Squad: Images', 'Image may contain text', 'Use actual text with CSS styling instead of images of text.');
  });

  // ========== TOOLTIPS ==========

  // Stamp tooltip
  $('[class*="StampField---"]').forEach(el => {
    if (el.getAttribute('title') || el.querySelector('[title]'))
      add(el, 'warning', 'Squad: Tooltips', 'a!stampField has a tooltip — verify it does not convey important info',
        'Remove tooltip and convey info through other means.');
  });

  // Tooltip keyboard (skip SAIL components)
  $('[title]:not(svg):not([role="img"])').forEach(el => {
    if (el.matches('a,button,input,select,textarea,[tabindex]')) return;
    if (el.closest('[class*="---"]')) return;
    add(el, 'warning', 'Squad: Tooltips', 'Element has tooltip but may not be keyboard accessible', 'Ensure element is focusable.');
  });

  // ========== CONTRAST ==========

  $('p,span,a,label,button,td,th,li,h1,h2,h3,h4,h5,h6').slice(0, 200).forEach(el => {
    if (!el.textContent.trim() || !el.offsetWidth) return;
    const s = getComputedStyle(el), fg = parseColor(s.color), bg = getBackgroundColor(el);
    if (!fg || !bg) return;
    const ratio = contrastRatio(fg, bg);
    const sz = parseFloat(s.fontSize), big = sz >= 24 || (sz >= 18.66 && +s.fontWeight >= 700);
    const min = big ? 3 : 4.5;
    if (ratio < min)
      add(el, 'error', 'Squad: Contrast',
        getSail(el) + ' has insufficient contrast (' + ratio.toFixed(2) + ':1)',
        'WCAG requires ' + min + ':1 minimum. Adjust text or background color.');
  });
};
