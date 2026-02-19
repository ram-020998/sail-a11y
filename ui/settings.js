const MODULES = [
  { key: 'squadLevel', label: 'Squad-Level', checks: [
    { cat: 'Squad: Forms',        sev: 'error',   wcag: '1.3.1, 4.1.2', desc: 'Form inputs missing accessible labels' },
    { cat: 'Squad: Forms',        sev: 'error',   wcag: '1.3.1, 4.1.2', desc: 'Groups (role="group") missing group label' },
    { cat: 'Squad: Forms',        sev: 'warning', wcag: '1.3.1, 3.3.2', desc: 'Placeholder-only inputs, collapsed labels, duplicate labels' },
    { cat: 'Squad: Forms',        sev: 'warning', wcag: '1.3.1',        desc: 'Required field legend missing' },
    { cat: 'Squad: Forms',        sev: 'warning', wcag: '1.3.1',        desc: 'Single checkbox with redundant group label' },
    { cat: 'Squad: Validations',  sev: 'warning', wcag: '3.3.1',        desc: 'Required inputs missing aria-required' },
    { cat: 'Squad: Validations',  sev: 'warning', wcag: '3.3.1',        desc: 'Validation messages missing field name' },
    { cat: 'Squad: Grids',        sev: 'warning', wcag: '1.3.1',        desc: 'Grid missing label, instructions, or selection a11y' },
    { cat: 'Squad: Grids',        sev: 'warning', wcag: '1.3.1, 2.5.8', desc: 'Empty grid columns, missing row headers, small click targets' },
    { cat: 'Squad: Grids',        sev: 'warning', wcag: '1.3.1',        desc: 'Simulated grids (column layouts)' },
    { cat: 'Squad: Headings',     sev: 'warning', wcag: '1.3.1',        desc: 'Heading levels skipped or empty headings' },
    { cat: 'Squad: Headings',     sev: 'warning', wcag: '1.3.1',        desc: 'Bold text that should be a semantic heading' },
    { cat: 'Squad: Lists',        sev: 'warning', wcag: '1.3.1',        desc: 'Visual bullets instead of semantic lists' },
    { cat: 'Squad: Breadcrumbs',  sev: 'error',   wcag: '1.3.1',        desc: 'Breadcrumb missing accessibilityText' },
    { cat: 'Squad: Links',        sev: 'error',   wcag: '4.1.2, 2.4.4', desc: 'Links missing accessible name' },
    { cat: 'Squad: Links',        sev: 'warning', wcag: '1.4.1',        desc: 'Inline links relying only on color' },
    { cat: 'Squad: Links',        sev: 'warning', wcag: '2.4.4',        desc: 'Adjacent duplicate links' },
    { cat: 'Squad: Cards',        sev: 'error',   wcag: '1.3.1',        desc: 'Card choice/group missing group label' },
    { cat: 'Squad: Cards',        sev: 'warning', wcag: '4.1.2',        desc: 'Selected card state or nested interactive controls' },
    { cat: 'Squad: Cards',        sev: 'warning', wcag: '4.1.2',        desc: 'Linked card label review' },
    { cat: 'Squad: File Upload',  sev: 'warning', wcag: '1.3.1, 3.3.2', desc: 'File upload missing label or instructions' },
    { cat: 'Squad: Date & Time',  sev: 'error',   wcag: '4.1.2',        desc: 'a!dateTimeField must not be used' },
    { cat: 'Squad: Dynamic',      sev: 'warning', wcag: '4.1.3',        desc: 'Dynamic messages not announced to screen readers' },
    { cat: 'Squad: Charts',       sev: 'error',   wcag: '1.1.1',        desc: 'Charts missing accessible label' },
    { cat: 'Squad: Icons',        sev: 'error',   wcag: '1.1.1',        desc: 'Icons/stamps missing accessibilityText' },
    { cat: 'Squad: Images',       sev: 'error',   wcag: '1.1.1',        desc: 'Images missing alternative text' },
    { cat: 'Squad: Images',       sev: 'warning', wcag: '1.4.5',        desc: 'Images that may contain text' },
    { cat: 'Squad: Tooltips',     sev: 'warning', wcag: '1.3.1',        desc: 'Tooltips not keyboard accessible or conveying essential info' },
    { cat: 'Squad: Contrast',     sev: 'error',   wcag: '1.4.3',        desc: 'Text color contrast below WCAG minimum (4.5:1 / 3:1)' },
  ]},
  { key: 'wcagExtended', label: 'WCAG Extended', checks: [
    { cat: 'WCAG: Progress',  sev: 'error',   wcag: '4.1.2', desc: 'Progress bars missing accessible label' },
    { cat: 'WCAG: Regions',   sev: 'warning', wcag: '1.3.1', desc: 'Regions/sections missing label' },
    { cat: 'WCAG: Tabs',      sev: 'warning', wcag: '4.1.2', desc: 'Tab groups missing label or ARIA states' },
    { cat: 'WCAG: Dialogs',   sev: 'error',   wcag: '4.1.2', desc: 'Dialogs missing accessible label' },
    { cat: 'WCAG: Tables',    sev: 'error',   wcag: '1.3.1', desc: 'Tables missing label or column headers' },
    { cat: 'WCAG: Frames',    sev: 'error',   wcag: '4.1.2', desc: 'iFrames missing title attribute' },
    { cat: 'WCAG: Nesting',   sev: 'error',   wcag: '4.1.2', desc: 'Interactive elements nested inside each other' },
    { cat: 'WCAG: Buttons',   sev: 'error',   wcag: '4.1.2', desc: 'Buttons missing accessible name' },
  ]},
  { key: 'appianPlatform', label: 'Appian Platform', checks: [
    { cat: 'Appian: Cards',   sev: 'warning', wcag: '4.1.2', desc: 'Interactive cards missing ARIA role' },
    { cat: 'Appian: Stamps',  sev: 'warning', wcag: '1.1.1', desc: 'Stamp/icon fields missing accessibilityText' },
    { cat: 'Appian: Dynamic', sev: 'warning', wcag: '4.1.3', desc: 'Dynamic messages missing announceBehavior' },
  ]},
  { key: 'reviewRequired', label: 'Review Required', checks: [
    { cat: 'Review: Names',       sev: 'warning', wcag: '4.1.2', desc: 'Multiple buttons/links with identical names' },
    { cat: 'Review: A11y Text',   sev: 'warning', wcag: '4.1.2', desc: 'accessibilityText duplicates the label' },
    { cat: 'Review: Instructions', sev: 'warning', wcag: '1.3.1', desc: 'Rich text before inputs may be unassociated' },
    { cat: 'Review: Icons',       sev: 'warning', wcag: '1.1.1', desc: 'Icon alt text duplicates adjacent text' },
    { cat: 'Review: Labels',      sev: 'warning', wcag: '4.1.2', desc: 'Generic or confusing labels' },
    { cat: 'Review: Labels',      sev: 'error',   wcag: '4.1.2', desc: 'Internal variable names used as labels' },
    { cat: 'Review: Page',        sev: 'error',   wcag: '2.4.2', desc: 'Page missing or non-descriptive title' },
    { cat: 'Review: Target Size', sev: 'warning', wcag: '2.5.8', desc: 'Click targets smaller than 24×24px' },
  ]}
];

const container = document.getElementById('modules');

MODULES.forEach(mod => {
  const div = document.createElement('div');
  div.className = 'module';

  let tableRows = '';
  mod.checks.forEach(c => {
    tableRows += '<tr><td><input type="checkbox" data-cat="' + c.cat + '" data-parent="' + mod.key + '" checked></td>'
      + '<td><span class="cat-label">' + c.cat + '</span></td>'
      + '<td><span class="sev sev-' + c.sev + '">' + c.sev + '</span></td>'
      + '<td><span class="wcag">' + c.wcag + '</span></td>'
      + '<td>' + c.desc + '</td></tr>';
  });

  div.innerHTML = '<div class="module-header">'
    + '<input type="checkbox" data-module="' + mod.key + '" checked>'
    + '<span class="title">' + mod.label + '</span>'
    + '<span class="count">(' + mod.checks.length + ' checks)</span>'
    + '<span class="arrow">▶</span></div>'
    + '<div class="grid-wrap"><table>'
    + '<tr><th></th><th>Category</th><th>Severity</th><th>WCAG</th><th>Description</th></tr>'
    + tableRows + '</table></div>';

  container.appendChild(div);

  const header = div.querySelector('.module-header');
  const gridWrap = div.querySelector('.grid-wrap');
  const arrow = div.querySelector('.arrow');
  header.addEventListener('click', e => {
    if (e.target.type === 'checkbox') return;
    gridWrap.classList.toggle('open');
    arrow.classList.toggle('open');
  });

  const modCb = div.querySelector('[data-module]');
  const catCbs = div.querySelectorAll('[data-cat]');
  modCb.addEventListener('change', () => {
    catCbs.forEach(cb => { cb.checked = modCb.checked; });
  });
  catCbs.forEach(cb => {
    cb.addEventListener('change', () => {
      modCb.checked = [...catCbs].every(c => c.checked);
    });
  });
});

// Load
chrome.storage.local.get('sailA11ySettings', ({ sailA11ySettings }) => {
  const s = sailA11ySettings || {};
  document.querySelectorAll('[data-module]').forEach(cb => {
    cb.checked = s[cb.dataset.module] !== false;
  });
  const dc = s.disabledCats || [];
  document.querySelectorAll('[data-cat]').forEach(cb => {
    cb.checked = s[cb.dataset.parent] !== false && !dc.includes(cb.dataset.cat);
  });
  document.querySelectorAll('.module').forEach(div => {
    const modCb = div.querySelector('[data-module]');
    const catCbs = div.querySelectorAll('[data-cat]');
    if (modCb.checked) modCb.checked = [...catCbs].every(c => c.checked);
  });
  document.querySelectorAll('[data-scope]').forEach(cb => {
    cb.checked = s[cb.dataset.scope] !== false;
  });
});

// Save
document.getElementById('save').addEventListener('click', () => {
  const s = {};
  document.querySelectorAll('[data-module]').forEach(cb => {
    const catCbs = document.querySelectorAll('[data-cat][data-parent="' + cb.dataset.module + '"]');
    s[cb.dataset.module] = [...catCbs].some(c => c.checked);
  });
  const dc = [];
  document.querySelectorAll('[data-cat]').forEach(cb => {
    if (!cb.checked) dc.push(cb.dataset.cat);
  });
  s.disabledCats = dc;
  document.querySelectorAll('[data-scope]').forEach(cb => {
    s[cb.dataset.scope] = cb.checked;
  });
  chrome.storage.local.set({ sailA11ySettings: s }, () => {
    document.getElementById('save').textContent = '✅ Saved!';
    setTimeout(() => { document.getElementById('save').textContent = 'Save Settings'; }, 1200);
  });
});
