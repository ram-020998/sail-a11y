# SAIL A11y Chrome Extension — Steering Document

> Use this document at the start of every new Kiro session to restore full project context.

---

## 1. What This Project Is

A Chrome Manifest V3 extension that audits accessibility in **Appian SAIL** applications. It provides:

- **One-click scan** — finds a11y issues and renders an in-page results panel
- **8 visualizer overlays** — tab order, headings, landmarks, ARIA, alt text, links, language, text spacing
- **Workflow recorder** — records multi-step user flows, deduplicates issues across steps, captures per-step screenshots, exports an axe-DevTools-style HTML report
- **Settings page** — toggle individual check modules and scope options on/off

The target users are Appian developers and QA engineers auditing SAIL-based interfaces.

---

## 2. Project Location

```
/Users/ramaswamy.u/repo/sail-a11y/
```

---

## 3. Architecture

```
popup.html / popup.js          ← Extension popup UI, injects scripts
background.js                  ← Service worker (screenshot capture via chrome.tabs.captureVisibleTab)
settings.html / settings.js    ← Options page for toggling checks

core.js                        ← SailA11y module (shared helpers, SAIL detection, UI utils)
  ↓
checks-core.js                 ← SailA11yChecks.runCoreChecks()     — forms, images, headings, tables, buttons, links, dialogs
checks-appian.js               ← SailA11yChecks.runAppianChecks()   — 23 Appian-specific checks
checks-review.js               ← SailA11yChecks.runReviewChecks()   — placeholder-only, collapsed labels, duplicates, grid targets
checks-jira.js                 ← SailA11yChecks.runJiraChecks()     — 13 JIRA-derived checks
checks-contrast.js             ← SailA11yChecks.runContrastCheck()  — WCAG color contrast
  ↓
scanner.js                     ← One-shot scan, renders in-page panel
recorder.js                    ← Workflow recording, dedup, per-step screenshots, HTML export
visualizers.js                 ← 8 overlay visualization modes
```

### Injection Order (critical — must be exact)

**Scanner:** `core.js` → `checks-core.js` → `checks-appian.js` → `checks-review.js` → `checks-jira.js` → `checks-contrast.js` → `scanner.js`

**Recorder:** Same but `recorder.js` instead of `scanner.js`

**Visualizers:** `core.js` → `visualizers.js` (with `window.__sailA11yVisMode` set first)

### Settings Flow

```
popup.js
  → chrome.storage.local.get('sailA11ySettings')
  → injects as window.__sailA11ySettings via chrome.scripting.executeScript
  → scanner.js / recorder.js read S.coreChecks, S.appianChecks, etc.
```

Settings keys (all default `true`): `coreChecks`, `appianChecks`, `reviewChecks`, `jiraChecks`, `contrastCheck`, `dialogOnly`, `skipSiteNav`

### Screenshot Flow

```
recorder.js captureStep()
  → chrome.runtime.sendMessage({ type: 'captureScreenshot' })
  → background.js receives, calls chrome.tabs.captureVisibleTab()
  → responds with data URL
  → recorder stores in stepScreenshots[stepNum]
  → export embeds per-issue screenshot from its step
```

---

## 4. File Inventory (with line counts)

| File | Lines | Purpose |
|------|-------|---------|
| `manifest.json` | 25 | Manifest V3, permissions: activeTab, scripting, storage |
| `background.js` | 8 | Service worker — screenshot capture on message |
| `core.js` | ~240 | `SailA11y` module — DOM helpers, SAIL detection, contrast, UI, element forensics |
| `checks-core.js` | 120 | Core a11y checks (forms, images, headings, tables, buttons, links, dialogs) |
| `checks-appian.js` | 160 | 23 Appian-specific checks |
| `checks-review.js` | 83 | Heuristic/review checks |
| `checks-jira.js` | 161 | 13 JIRA-derived checks |
| `checks-contrast.js` | 21 | Color contrast check |
| `scanner.js` | ~95 | One-shot scan + in-page results panel |
| `recorder.js` | ~210 | Workflow recorder + dedup + per-step screenshots + HTML export |
| `visualizers.js` | 162 | 8 overlay modes |
| `popup.js` | ~105 | Popup controller — inject scripts, manage recording state |
| `popup.html` | ~60 | Popup UI |
| `settings.js` | ~20 | Settings page logic |
| `settings.html` | ~50 | Settings page UI |

---

## 5. Critical Design Rules (MUST follow)

### Styling
- **ALL styles must be INLINE** — Appian's CSS overrides class-based and stylesheet styles. Every DOM element created by the extension uses `style.cssText` or `style.setProperty(..., 'important')`.

### SAIL-Specific
- Error messages must reference **SAIL component names and parameters** (e.g., `a!textField`, `"label"`, `"accessibilityText"`)
- Components inside **grid cells** should NOT be flagged for missing labels — downgrade to warnings
- **Appian site tab navigation** must be excluded from all checks and visualizers (detected via `isInsideSiteNav()`)
- Appian platform **iframes** with `id` starting with `"appian"` must be skipped
- When a **dialog/popup** is open, only scan its contents (auto-scope via `getScope()` in core.js)
- **Inline text links** should NOT be flagged for target size (WCAG 2.5.8 exemption)

### Panels
- All panels must be **draggable** (via `makeDraggable()` in core.js)

### Recorder
- Workflow recording **deduplicates** issues across steps via fingerprint (`sev|cat|sail|msg`)
- Each step captures a **screenshot** via background service worker
- Export report is a **downloaded HTML file** (not blob URL — CSP blocks inline scripts in blob URLs)

### Export Report
- **No inline event handlers** (`onclick`, etc.) — Chrome extension CSP blocks them even in downloaded files opened from `file://` in some contexts. Use `addEventListener` in `<script>` blocks.
- **Escape `</`** in all JSON/string data embedded in `<script>` tags — use `safeJSON()` pattern: `JSON.stringify(x).replace(/<\//g, '<\\/')`
- Layout: left sidebar with grouped issue list + right detail panel with per-step screenshot (highlighted element), element location (CSS selector), element source code (truncated outerHTML), severity, category, SAIL component, step info

### core.js Guard
```js
if (typeof SailA11y === 'undefined') {
  var SailA11y = (() => { ... })();
}
```
This prevents re-injection crashes when popup injects scripts multiple times. Uses `var` (not `const`) intentionally.

### Highlight Visibility
- Use `el.style.setProperty('outline', '...', 'important')` — plain `el.style.outline = ...` gets overridden by Appian CSS
- `onClose` cleanup uses `document.querySelectorAll` (not scoped `$`) + `removeProperty`

---

## 6. Key Functions Reference

### core.js — `SailA11y` module

| Function | Purpose |
|----------|---------|
| `$(selector, ctx)` | querySelectorAll scoped to open dialog (via `getScope()`) |
| `isInsideGrid(el)` | Returns true if element is inside a table cell / grid cell |
| `isInsideSiteNav(el)` | Returns true if inside Appian site navigation (12+ class patterns) |
| `isGridSelectionCheckbox(el)` | Detects grid row selection checkboxes |
| `hasLabel(el)` | Checks aria-label, aria-labelledby, associated `<label>` |
| `sailName(el)` | Walks up 6 parents looking for `---` class pattern, returns component name |
| `sailContext(el)` | Returns `{ component, sail }` using `SAIL_MAP` |
| `getSail(el)` | Shorthand — returns SAIL component string |
| `parseColor(s)` | Parses `rgb()/rgba()` string to `[r,g,b]` |
| `luminance([r,g,b])` | WCAG relative luminance |
| `getBackgroundColor(el)` | Walks up DOM to find non-transparent background |
| `contrastRatio(fg, bg)` | WCAG contrast ratio |
| `createPanel(id, title, html, opts)` | Creates draggable fixed panel |
| `makeDraggable(panel)` | Adds drag behavior to panel's `[data-drag-handle]` |
| `showToast(text, ms)` | Temporary notification |
| `cleanup()` | Removes panels and issue highlights |
| `badge(el, text, bg, fg, css)` | Positions a label badge near element |
| `outline(el, color, label)` | Draws outline overlay around element |
| `getUniqueSelector(el)` | Builds unique CSS selector path (like axe-core) |
| `getElementSource(el)` | Truncated outerHTML (max 300 chars) |
| `getElementRect(el)` | Bounding rect `{ x, y, w, h }` for screenshot overlay |

### recorder.js — Key globals

| Variable | Purpose |
|----------|---------|
| `allSteps[]` | Array of step objects with issues, timestamps, labels |
| `seenFingerprints` | Set for dedup across steps |
| `stepScreenshots{}` | Map of stepNum → screenshot data URL |
| `window.__sailA11yStopRecording()` | Stops recording, returns summary |
| `window.__sailA11yExportReport()` | Generates and returns HTML report string |

---

## 7. Manifest Permissions

```json
{
  "permissions": ["activeTab", "scripting", "storage"],
  "background": { "service_worker": "background.js" }
}
```

- `activeTab` — inject scripts into current tab
- `scripting` — `chrome.scripting.executeScript`
- `storage` — `chrome.storage.local` for settings

---

## 8. Known Gotchas & Past Bugs

| Issue | Root Cause | Fix Applied |
|-------|-----------|-------------|
| `<iframe>` rendering as HTML in scanner panel | Missing HTML escaping in `add()` | Added `esc()` function |
| Re-injection crash | `const SailA11y` can't be redeclared | Changed to `if (typeof === 'undefined') { var SailA11y = ... }` |
| Warning highlights not visible | Appian CSS overrides `style.outline` | Use `setProperty(..., 'important')` |
| Click-to-highlight flash not restoring | setTimeout callback used plain assignment | Use `setProperty` in callback |
| Target size false positive on inline links | Flagging when only one dimension < 24px | Only flag when BOTH width AND height < 24px |
| Placeholder-only false positive | Not checking aria-label/aria-labelledby/`<label>` | Added those checks before flagging |
| Export report right panel not updating on click | Inline `onclick` blocked by extension CSP | Replaced with `addEventListener` |
| Export report script not executing at all | `blob:chrome-extension://` URL inherits strict CSP | Changed to download HTML file instead |
| All issues showing same screenshot | Only one screenshot captured at stop time | Per-step screenshots via background service worker |
| `</script>` in issue data breaking report | Raw HTML in `source` field contains `</` | `safeJSON()` escapes `</` → `<\/` |

---

## 9. How to Validate Changes

After any code change, always run:

```bash
cd /Users/ramaswamy.u/repo/sail-a11y
node -c core.js && node -c checks-core.js && node -c checks-appian.js && \
node -c checks-review.js && node -c checks-jira.js && node -c checks-contrast.js && \
node -c scanner.js && node -c recorder.js && node -c visualizers.js && \
node -c popup.js && node -c settings.js && node -c background.js && echo "✅ All valid"
```

Then reload the extension in `chrome://extensions` and test.

---

## 10. Testing Workflow

1. Open any Appian SAIL application page
2. Click extension icon → "Run Full Scan" → verify panel appears with issues
3. Click issues in panel → verify element scrolls into view and flashes
4. Test visualizers (tab order, headings, etc.)
5. Start recording → navigate through 2-3 pages → stop → export
6. Open downloaded HTML report → verify:
   - Left sidebar lists grouped issues
   - Clicking an issue shows detail panel on right
   - Screenshot matches the step where issue was found
   - Element Location shows CSS selector
   - Element Source Code shows truncated HTML
   - Prev/Next navigation works within issue groups

---

## 11. Pending / Future Work

- [ ] Screenshot highlight box positioning needs scaling — the highlight uses absolute pixel coords from the page, but the screenshot image is scaled down in the report. Need to calculate scale factor from image natural size vs displayed size.
- [ ] Consider per-step screenshots stored more efficiently (currently full PNG data URLs embedded in HTML — large file sizes for multi-step recordings)
- [ ] Update README.md to document the new report format, background service worker, and screenshot feature
- [ ] Consider adding a "Rerun" button in the scanner panel
- [ ] Consider CSV/JSON export format option alongside HTML

---

## 12. Reference: axe-core Patterns Used

From `/Users/ramaswamy.u/repo/axe-core/lib/`:

- **`get-selector.js`** — Builds unique CSS selector by iterating up parent chain, using ID, least common features, nth-child. Our `getUniqueSelector()` follows the same approach.
- **`dq-element.js`** — Stores `outerHTML` (truncated), `selector`, `ancestry`, `xpath`. Our `getElementSource()` truncates at 300 chars like axe's `truncateElement()`.
- axe-core does NOT capture screenshots — that's done by the axe DevTools extension using `chrome.tabs.captureVisibleTab()`, which is what we do via `background.js`.

---

## 13. Quick Reference: Adding a New Check

1. Choose the appropriate check file (`checks-core.js`, `checks-appian.js`, `checks-review.js`, `checks-jira.js`, or `checks-contrast.js`)
2. Inside the `run*Checks` function, add your check using the pattern:

```js
$('your-selector').forEach(el => {
  // your condition
  add(el, 'error' or 'warning', 'Category Name',
    getSail(el) + ' description of the issue',
    'Fix: describe the SAIL parameter to use.');
});
```

3. The `add` function handles: site nav filtering, grid downgrading (if applicable), element context extraction
4. Validate with `node -c <file>` and test in browser

---

## 14. Quick Reference: File Modification Patterns

### To modify core.js:
- Add new helper functions before the `return { ... }` block
- Export them by adding to the return object
- Update destructuring in any consumer file that needs the new function

### To modify the export report:
- Edit `window.__sailA11yExportReport` in `recorder.js`
- The inline `<script>` in the report uses a template literal — be careful with backticks and `${}`
- Always use `safeJSON()` for any data embedded in `<script>` tags
- Use `addEventListener` instead of inline event handlers
- Test by recording a workflow and opening the downloaded HTML

### To add a new visualizer mode:
- Add a new `else if (MODE === 'yourmode')` block in `visualizers.js`
- Add a button in `popup.html` with `data-viz="yourmode"`
- The `$` in visualizers.js auto-filters out site nav elements
