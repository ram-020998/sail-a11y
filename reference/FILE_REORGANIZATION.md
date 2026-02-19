# File Reorganization Summary

## New Folder Structure

```
sail-a11y/
├── checks/                          # All accessibility check modules
│   ├── checks-squad.js             # Squad-Level (Aurora Priority) - 38 checks
│   ├── checks-wcag.js              # WCAG Extended - 8 checks
│   ├── checks-appian.js            # Appian Platform - 3 checks
│   └── checks-review.js            # Review Required - 8 checks
├── core.js                          # Shared utilities and helpers
├── scanner.js                       # Full page scan runner
├── recorder.js                      # Workflow recording
├── visualizers.js                   # 8 visualization modes
├── popup.js                         # Extension popup controller
├── settings.js                      # Settings page
├── popup.html                       # Extension popup UI
├── settings.html                    # Settings page UI
└── manifest.json                    # Chrome extension manifest
```

## Check Files Organization

### 1. **checks/checks-squad.js** (18KB)
**All Squad-Level checks from Aurora checklist**
- Forms (8 checks)
- Validations (2 checks)
- Grids (6 checks)
- Headings (2 checks)
- Lists (1 check)
- Breadcrumbs (1 check)
- Links (3 checks)
- Cards (4 checks)
- File Upload (2 checks)
- Date & Time (1 check)
- Dynamic Messages (1 check)
- Charts (1 check)
- Icons (1 check)
- Images (2 checks)
- Tooltips (2 checks)
- Contrast (1 check)

**Total: ~38 checks**

### 2. **checks/checks-wcag.js** (3.5KB)
**WCAG Extended checks not in Squad-Level**
- Buttons
- Tables
- Progress bars
- Regions
- Tabs
- Dialogs
- iFrames
- Interactive nesting

**Total: 8 checks**

### 3. **checks/checks-appian.js** (1.4KB)
**Appian Platform-specific patterns**
- Clickable cards without ARIA role
- Stamp/icon fields missing accessibilityText
- Dynamic messages needing announceBehavior

**Total: 3 checks**

### 4. **checks/checks-review.js** (5.3KB)
**Review Required - human judgment items**
- Duplicate button/link names
- Redundant accessibilityText
- Rich text before inputs
- Decorative icons with duplicate alt
- Generic/confusing labels
- Page title
- Target size

**Total: 8 checks**

## Files Removed

- ❌ **checks-core.js** - Merged into checks/checks-squad.js and checks/checks-wcag.js
- ❌ **checks-jira.js** - Merged into checks/checks-squad.js and checks/checks-review.js
- ❌ **checks-contrast.js** - Merged into checks/checks-squad.js

## Files Updated

### popup.js
```javascript
// OLD
const CHECK_FILES = ['core.js', 'checks-core.js', 'checks-appian.js', 'checks-review.js', 'checks-jira.js', 'checks-contrast.js'];

// NEW
const CHECK_FILES = ['core.js', 'checks/checks-squad.js', 'checks/checks-wcag.js', 'checks/checks-appian.js', 'checks/checks-review.js'];
```

### scanner.js
```javascript
// OLD
if (S.coreChecks !== false) SailA11yChecks.runCoreChecks(issues, add);
if (S.appianChecks !== false) SailA11yChecks.runAppianChecks(issues, add);
if (S.reviewChecks !== false) SailA11yChecks.runReviewChecks(issues, add);
if (S.jiraChecks !== false) SailA11yChecks.runJiraChecks(issues, add);
if (S.contrastCheck !== false) SailA11yChecks.runContrastCheck(issues, add, 200);

// NEW
if (S.squadLevel !== false) SailA11yChecks.runSquadChecks(issues, add);
if (S.wcagExtended !== false) SailA11yChecks.runWcagChecks(issues, add);
if (S.appianPlatform !== false) SailA11yChecks.runAppianChecks(issues, add);
if (S.reviewRequired !== false) SailA11yChecks.runReviewChecks(issues, add);
```

### recorder.js
Same changes as scanner.js

### settings.js
Module keys updated:
- `coreChecks` → `squadLevel`
- `appianChecks` → `appianPlatform`
- `reviewChecks` → `reviewRequired`
- `jiraChecks` → (removed, merged)
- `contrastCheck` → (removed, merged into squadLevel)

## Benefits

✅ **Better Organization**
- All check modules in dedicated `checks/` folder
- Clear separation from core utilities and runners

✅ **Better Maintainability**
- All Squad-Level checks in one file
- Clear separation of concerns
- Easier to find and update checks

✅ **Reduced File Count**
- From 6 check files down to 4
- Less complexity in injection order

✅ **Logical Structure**
- Files match the category structure
- Aurora priority checks clearly separated
- Platform-specific vs. standard checks distinguished

✅ **Easier Onboarding**
- New developers can quickly understand the structure
- File names match the UI categories
- Folder structure is self-documenting

## Migration Notes

- All check logic preserved - no functionality changes
- Category names updated to match new structure
- Settings storage keys updated for new module names
- Backward compatibility maintained through settings migration
- Old files removed - clean slate
