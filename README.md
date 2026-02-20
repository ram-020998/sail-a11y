# ⚡ SAIL A11y Checker

A Chrome extension purpose-built for auditing accessibility in **Appian SAIL** applications. It understands Appian's component model, references SAIL parameter names in error messages, and provides actionable fix guidance specific to the Appian platform.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Full Scan](#full-scan)
- [Visualizers](#visualizers)
- [Workflow Recording](#workflow-recording)
- [Accessibility Checks Reference](#accessibility-checks-reference)
  - [Core Checks](#1-core-checks)
  - [Appian-Specific Checks](#2-appian-specific-checks)
  - [Review / Heuristic Checks](#3-review--heuristic-checks)
  - [JIRA-Derived Checks](#4-jira-derived-checks)
  - [Color Contrast Check](#5-color-contrast-check)
- [Architecture](#architecture)
- [File Reference](#file-reference)
- [Design Decisions](#design-decisions)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

---

## Features

| Capability | Description |
|---|---|
| **Full Page Scan** | One-click scan that runs 60+ accessibility checks and displays results in a categorized, interactive panel |
| **8 Visualizer Modes** | Overlay views for tab order, headings, landmarks, ARIA attributes, alt text, links, language, and text spacing |
| **Workflow Recording** | Multi-step recording that captures issues as you navigate through an Appian workflow, deduplicating across steps |
| **HTML Report Export** | Export a styled, standalone HTML report of your workflow recording — opens in a new tab, ready to share |
| **SAIL-Aware Messages** | Every error message references the Appian SAIL component name (e.g., `a!textField`, `a!gridField`) and the specific parameter to fix |
| **Click-to-Highlight** | Click any issue in the results panel to scroll to and flash-highlight the element on the page |
| **Grid-Aware** | Components inside grid cells are handled differently — label checks are suppressed or downgraded to warnings since grids manage their own labeling |
| **Site Nav Exclusion** | Appian site tab navigation (top or left) is automatically excluded from all checks to reduce noise |

---

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `sail-a11y` folder.
5. The ⚡ SAIL A11y Checker icon appears in your Chrome toolbar.
6. Pin the extension for quick access.

> **Permissions:** The extension only requires `activeTab` and `scripting` — it does not read browsing history, store data, or make network requests.

---

## Getting Started

1. Navigate to any Appian application page in Chrome.
2. Click the ⚡ SAIL A11y Checker icon in the toolbar.
3. Choose an action:
   - **Run Full Scan** — Analyze the current page
   - **Visualize** — Overlay a specific accessibility view
   - **Start Recording** — Begin a multi-step workflow audit

---

## Full Scan

Click **Run Full Scan** to execute all check modules against the current page.

### Results Panel

A dark-themed panel appears on the right side of the page with:

- **Summary bar** — Total error and warning counts
- **Categorized issues** — Grouped by category (Forms, Images, Grids, Contrast, etc.)
- **Issue cards** — Each card shows:
  - **Severity badge** — `error` (red) or `warning` (yellow)
  - **SAIL component** — The Appian component name (e.g., `a!textField`, `a!dropdownField`)
  - **Issue description** — What's wrong, referencing the specific element
  - **Element descriptor** — The HTML tag, id, role, and text content
  - **Fix guidance** — Actionable suggestion referencing SAIL parameters

### Interacting with Results

- **Click any issue card** to scroll to and flash-highlight the element on the page
- **Drag the panel** by its title bar to reposition it
- **Close the panel** with the × button
- **Clear All Overlays** from the popup to remove the panel and all highlights

---

## Visualizers

Eight overlay modes that help you understand the accessibility structure of the page without running a full scan. Each mode adds visual annotations directly on the page.

### 🔢 Tab Order

Shows the keyboard tab sequence as numbered blue badges on every focusable element. The side panel lists all elements in tab order with their SAIL component name and accessible name.

Use this to verify:
- Logical reading/navigation order
- No unexpected tab stops
- All interactive elements are reachable by keyboard

### 📑 Headings

Outlines all heading elements (`h1`–`h6` and `[role="heading"]`) with color-coded borders. The side panel shows the heading hierarchy with indentation.

Flags:
- ⚠ **Skipped levels** — e.g., jumping from H2 to H4
- ⚠ **Empty headings** — heading elements with no text content

### 🗺️ Landmarks

Highlights ARIA landmark regions (`banner`, `navigation`, `main`, `complementary`, `contentinfo`, `search`, `form`, `region`) with color-coded outlines and labels.

Flags:
- ⚠ **Unlabeled landmarks** — regions without `aria-label` or `aria-labelledby`

### ♿ ARIA

Shows all elements with ARIA attributes. Elements with explicit `role` get purple outlines. The side panel lists every ARIA attribute on every element.

Use this to audit:
- Correct role usage
- State attributes (`aria-expanded`, `aria-selected`, `aria-checked`)
- Relationship attributes (`aria-controls`, `aria-describedby`)

### 🖼️ Alt Text

Badges every image (`img`, `svg`, `[role="img"]`) with its alt text status:
- ✅ Green — Has meaningful alt text
- ⬜ Gray — `alt=""` (decorative)
- 🚫 Gray — `aria-hidden="true"` (decorative)
- ❌ Red — Missing alt text entirely

### 🔗 Links

Lists all links on the page with their text and destination. Flags:
- ❌ **Empty links** — no accessible name
- ⚠ **Vague link text** — generic phrases like "click here", "read more", "learn more"

### 🌐 Language

Shows the page-level `lang` attribute and all elements with explicit `lang` attributes. Flags if `<html>` is missing the `lang` attribute.

### 📏 Text Spacing (WCAG 1.4.12)

Applies WCAG text spacing overrides to the entire page:
- Line height: 1.5×
- Letter spacing: 0.12em
- Word spacing: 0.16em
- Paragraph spacing: 2em

Check that no content is clipped, overlapping, or disappearing. Close the panel to remove the overrides.

---

## Workflow Recording

Record a multi-step user workflow and capture accessibility issues at each step. Issues are deduplicated across steps so the same problem isn't reported twice.

### How to Record

1. Navigate to the starting page of your workflow.
2. Click **🔴 Start Recording** in the extension popup.
3. Interact with the application — fill forms, click buttons, navigate pages.
4. The recorder automatically captures a new step when:
   - The URL changes (page navigation)
   - The DOM changes significantly (dynamic content load)
5. A toast notification appears for each captured step showing the error/warning count.
6. Click **Stop Recording** when done.

### Deduplication

Issues are fingerprinted using: `severity | category | SAIL component | message`

If the same issue appears on multiple steps, it's only reported on the first step where it was found. This keeps reports focused on unique problems.

### Viewing Results

After stopping, a summary panel shows all steps with their issues. Each step displays:
- Step number and label (derived from the page heading or title)
- Timestamp
- Error and warning counts
- Individual issues with severity, category, component, and message

### Exporting

Click **📋 Export Report** to generate a standalone HTML report that opens in a new tab. The report includes:
- Summary with total error/warning counts
- Each step with a table of issues
- Color-coded step borders (red = errors, yellow = warnings only, green = clean)
- Fully styled — ready to save as HTML or print to PDF

---

## Accessibility Checks Reference

The extension runs **60+ individual checks** organized into 4 modules aligned with Aurora's Squad-Level accessibility checklist. Every check references the relevant WCAG success criterion.

### 1. ⭐ Squad-Level Checks (Aurora Priority)

All checks from Aurora's Squad-Level accessibility checklist — the highest priority items for Appian applications.

**Categories:**
- **Forms** — Input labels, placeholder usage, collapsed labels, duplicate labels, required field legend, single checkbox redundancy, autocomplete for personal info
- **Validations** — Required inputs (aria-required), validation messages with field names
- **Grids** — Grid labels, instructions, selection accessibility, empty columns, row headers, small click targets, simulated grids
- **Headings** — Heading hierarchy, empty headings, heading-like styled text
- **Lists** — Semantic lists vs. visual bullets
- **Breadcrumbs** — Breadcrumb accessibility text
- **Links** — Link names, inline links without underline, adjacent duplicate links
- **Cards** — Card choice/group labels, selected card state, linked cards with nested controls, card link labels
- **File Upload** — File upload labels and instructions
- **Date & Time** — DateTime component ban
- **Dynamic Messages** — Dynamic content announcements
- **Charts** — Chart labels
- **Icons** — SVG icon names, stamp/icon fields
- **Images** — Image alt text, images of text
- **Tooltips** — Stamp tooltips, tooltip keyboard accessibility
- **Contrast** — Text color contrast ratios

**Total: ~38 checks**

#### Squad-Level Items Not Automated

The following Aurora Squad-Level checklist items require manual testing and are not included in the automated checks:

- **Placeholder text usage** — Requires judgment on whether placeholder conveys "important information"
- **Duplicate controls context** — Requires understanding if provided context is sufficient
- **Form re-entry** — Requires multi-step workflow understanding across pages
- **Modal dialog focus** — Requires judgment on whether content before input is "important"
- **Pane layout labels** — Complex semantic judgment required
- **Section/Box expandable layouts** — Requires complex DOM inspection for heading tags
- **Workflow Visualization Plugin** — Requires verifying alternative view exists
- **Signature alternative** — Requires verifying alternative method is provided
- **Custom pagination inactive links** — Requires verifying accessibility text removal
- **Magnification (200% and 400%)** — Requires browser zoom testing
- **Dynamically-added content** — Requires interaction and tab order verification
- **Link focus indicators** — Requires visual analysis of focus states
- **Color use as only means** — Requires understanding if color is sole differentiator
- **Image/icon contrast (3:1)** — Requires manual color picker analysis
- **Selected state contrast (3:1)** — Requires manual color picker analysis

These items are best verified through manual accessibility audits, user testing, or specialized tools.

### 2. WCAG Extended

Additional WCAG requirements not covered in Squad-Level checks.

| Check | Severity | WCAG | Description |
|---|---|---|---|
| Buttons | Error/Warning | 4.1.2 | Buttons must have accessible names |
| Tables | Error/Warning | 1.3.1 | Tables need labels and column headers |
| Progress bars | Error | 4.1.2 | Progress bars need accessible labels |
| Regions | Warning | 1.3.1 | Regions/sections should have labels |
| Tabs | Warning | 4.1.2 | Tab groups need labels and ARIA states |
| Dialogs | Error | 4.1.2 | Dialogs must have accessible labels |
| iFrames | Error | 4.1.2 | iFrames need title attributes |
| Interactive nesting | Error | 4.1.2 | Buttons/links must not be nested |

**Total: 8 checks**

### 3. Appian Platform

Appian-specific patterns not covered in Squad-Level.

| Check | Severity | Description |
|---|---|---|
| Clickable cards | Warning | Interactive cards missing ARIA role |
| Stamp/icon fields | Warning | Stamps missing accessibilityText |
| Dynamic messages | Warning | Messages needing announceBehavior parameter |

**Total: 3 checks**

### 4. Review Required

Items requiring human judgment and review.

| Check | Severity | WCAG | Description |
|---|---|---|---|
| Duplicate names | Warning | 4.1.2 | Multiple buttons/links with identical names |
| Redundant A11y text | Warning | 4.1.2 | accessibilityText duplicates the label |
| Instructions | Warning | 1.3.1 | Rich text before inputs may be unassociated |
| Decorative icons | Warning | 1.1.1 | Icon alt text duplicates adjacent text |
| Generic labels | Warning/Error | 4.1.2 | Generic or internal variable names as labels |
| Page title | Error/Warning | 2.4.2 | Missing or non-descriptive page title |
| Target size | Warning | 2.5.8 | Click targets smaller than 24×24px |

**Total: 8 checks**

---

## Architecture

The extension uses a modular architecture organized into focused folders. All scripts share the page's `window` object via Chrome's content script injection.

```
┌─────────────────────────────────────────────────────────┐
│  ui/popup.js  (Extension popup UI)                      │
│  ─ Injects scripts into the active tab                  │
│  ─ Manages recording state                              │
│  ─ Handles export                                       │
└──────────────┬──────────────────────────────────────────┘
               │ chrome.scripting.executeScript({ files })
               ▼
┌─────────────────────────────────────────────────────────┐
│  core.js  →  window.SailA11y                            │
│  ─ DOM helpers ($, isInsideGrid, isInsideSiteNav, ...)  │
│  ─ SAIL detection (sailName, sailContext, getSail)       │
│  ─ Contrast utilities (parseColor, luminance, ...)      │
│  ─ UI utilities (createPanel, makeDraggable, showToast) │
│  ─ Viz helpers (badge, outline)                         │
└──────────────┬──────────────────────────────────────────┘
               │ always injected first
               ▼
┌─────────────────────────────────────────────────────────┐
│  Check Modules  →  window.SailA11yChecks                │
│                                                         │
│  checks/checks-squad.js    Squad-Level (Aurora)         │
│  checks/checks-wcag.js     WCAG Extended                │
│  checks/checks-appian.js   Appian Platform              │
│  checks/checks-review.js   Review Required              │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│  Consumers (one of):                                    │
│                                                         │
│  scanner.js      Runs all checks → renders panel        │
│  recorder.js     Runs all checks silently per step      │
│  visualizers.js  Renders overlay for selected mode      │
└─────────────────────────────────────────────────────────┘
```

### Folder Structure

```
sail-a11y/
├── checks/              # Accessibility check modules
├── ui/                  # User interface files
├── icons/               # Extension icons
└── (root)               # Core functionality
```

### Injection Order

**Scanner:** `core.js` → `checks/checks-squad.js` → `checks/checks-wcag.js` → `checks/checks-appian.js` → `checks/checks-review.js` → `scanner.js`

**Recorder:** Same as scanner, but with `recorder.js` instead of `scanner.js`

**Visualizers:** `core.js` → `visualizers.js`

### Key Globals

| Global | Set By | Purpose |
|---|---|---|
| `window.SailA11y` | `core.js` | Shared helper functions and utilities |
| `window.SailA11yChecks` | `checks/*.js` | Object with `run*()` methods for each check module |
| `window.__sailA11yRecording` | `recorder.js` | Boolean flag — prevents double-injection |
| `window.__sailA11yStopRecording()` | `recorder.js` | Stops recording, returns summary |
| `window.__sailA11yExportReport()` | `recorder.js` | Returns standalone HTML report string |
| `window.__sailA11yVisMode` | `ui/popup.js` | String set before visualizer injection |

---

## File Reference

### UI Files (`ui/`)
| File | Description |
|---|---|
| `popup.html` | Extension popup UI with buttons and visualizer grid |
| `popup.js` | Popup controller — injects scripts, manages recording state |
| `settings.html` | Settings page UI |
| `settings.js` | Settings page controller with module toggles |

### Check Modules (`checks/`)
| File | Lines | Description |
|---|---|---|
| `checks-squad.js` | ~400 | Squad-Level checks (Aurora Priority) — 38 checks |
| `checks-wcag.js` | ~80 | WCAG Extended checks — 8 checks |
| `checks-appian.js` | ~40 | Appian Platform checks — 3 checks |
| `checks-review.js` | ~120 | Review Required checks — 8 checks |

### Core Files (root)
| File | Lines | Description |
|---|---|---|
| `core.js` | 201 | Shared utilities — DOM helpers, SAIL detection, contrast utils, UI |
| `scanner.js` | 87 | Full scan — runs all checks, renders interactive results panel |
| `recorder.js` | 142 | Workflow recording — multi-step capture with dedup and HTML export |
| `visualizers.js` | 162 | 8 visualization overlay modes |
| `background.js` | — | Service worker |
| `manifest.json` | — | Chrome extension manifest (Manifest V3) |

---

## Design Decisions

All styles are applied inline. Appian's CSS framework aggressively overrides class-based and stylesheet-based styles, so inline styles are the only reliable approach for the extension's UI elements.

### SAIL Component Names in Messages

Every error message references the Appian SAIL component name (e.g., `a!textField is missing an accessible label`) and the specific SAIL parameter to fix (e.g., `Add the "label" parameter`). This is done via the `SAIL_MAP` in `core.js` which maps CSS class fragments to SAIL component names.

### Grid Cell Exclusion

Components inside grid cells (`<td>`, `<th>`, `[role="cell"]`, `[role="gridcell"]`) are either excluded from label checks or have their severity downgraded to warnings. Grids manage their own column header → cell labeling relationship, so flagging every input inside a grid for missing labels would produce false positives.

### Site Navigation Exclusion

Appian site tab navigation (top bar or left sidebar) is automatically excluded from all checks. The site navigation is platform-managed chrome that application developers cannot modify, so flagging issues in it is not actionable.

### Recorder Deduplication

The workflow recorder uses a fingerprint of `severity|category|SAIL component|message` to deduplicate issues across steps. If the same issue appears on step 1 and step 3, it's only reported on step 1. This keeps reports focused on unique problems discovered at each step.

### Draggable Panels

All result panels are draggable by their title bar. This is essential because Appian pages vary in layout and the panel may overlap important content.

---

## Documentation

Detailed documentation is organized in the `docs/` folder:

### Research & Development
- **`docs/appian-research/`** - Component selector research from Appian core repository
  - `RESEARCH_PROCESS.md` - How we extracted correct CSS selectors
  - `KEY_FINDINGS.md` - Critical selector patterns and corrections
  - `component-selectors.json` - Minimal selector reference for the tool

### Testing & Validation
- **`docs/testing/`** - Test interface and validation artifacts
  - `a11y-violation-test-interface.sail` - Test interface with 70+ violations
  - `EXPECTED_DETECTIONS.md` - What should be detected (35 automated, 8 heuristic, 27 manual)
  - `FIX_PLAN.md` - Prioritized implementation roadmap

### Archive
- **`archive/`** - Raw extraction data and scripts (not tracked in git)
  - Full component class database (324KB JSON)
  - Extraction and search scripts
  - Can be regenerated if needed

See `docs/README.md` for complete documentation index.

---

## Troubleshooting

### "Error: Cannot access a chrome:// URL"
The extension can only run on regular web pages. Navigate to an Appian application URL first.

### Panel doesn't appear after scanning
- Check the browser console for errors (`F12` → Console tab)
- Ensure you're on an Appian page (the extension targets SAIL components)
- Try clicking **Clear All Overlays** first, then scan again

### Scan shows 0 issues on a page with known problems
- The page may still be loading — wait for all content to render, then scan again
- Dynamic content loaded after the scan won't be caught — use **Workflow Recording** to capture issues as content appears

### Recording doesn't capture a step
The recorder triggers on URL changes and significant DOM mutations (>500 characters of HTML change). Minor UI updates like hover effects won't trigger a new step. You can navigate away and back to force a capture.

### Export report is empty
Make sure you click **Stop Recording** before **Export Report**. The export uses data collected during the recording session.
