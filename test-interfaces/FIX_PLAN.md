# Implementation Gaps - Detailed Fix Plan

## Overview
The tool detected 47 issues but missed several expected checks. This document outlines what needs to be fixed and how we'll use the Appian core repo to identify correct selectors.

---

## 🔴 Critical Gaps (High Priority)

### 1. Icon Alt Text Checks (5 missing detections)

**Expected Violations:**
- Standalone icon in link with no altText
- Standalone icon button with no accessibilityText
- Standalone informational icon with no altText
- Decorative icon WITH altText (should be empty)
- Icon with text conveying extra info

**Current Implementation:**
```javascript
// checks-squad.js lines ~280-300
$('svg[role="img"], img, [class*="Icon---"]').forEach(el => {
  // Check for alt text
});
```

**Problem:**
- Selectors may not match Appian's icon components
- Not distinguishing between standalone vs. icon-with-text
- Not checking for decorative icons with unnecessary alt text

**Fix Needed:**
1. Find correct CSS class patterns for:
   - `a!iconField`
   - `a!richTextIcon`
   - SVG icons in buttons/links
2. Detect standalone vs. adjacent text patterns
3. Check for redundant alt text on decorative icons

**Appian Repo Analysis Required:**
- Search for icon component class names
- Understand icon rendering patterns
- Identify how `altText` parameter maps to DOM attributes

---

### 2. Chart Label Check (1 missing detection)

**Expected Violation:**
- Chart with no label parameter

**Current Implementation:**
```javascript
// checks-squad.js lines ~307-312
$('[class*="Chart---"],[class*="BarChart---"],[class*="LineChart---"],...').forEach(el => {
  if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
    add(el, 'error', 'Squad: Charts', 'Chart is missing an accessible label', ...);
});
```

**Problem:**
- Selector may not match actual chart component classes
- May not be checking the right element in the chart hierarchy

**Fix Needed:**
1. Find correct CSS class patterns for all chart types:
   - `a!barChartField`
   - `a!columnChartField`
   - `a!lineChartField`
   - `a!pieChartField`
   - `a!areaChartField`
2. Identify which element in the chart DOM tree should have the label

**Appian Repo Analysis Required:**
- Search for chart component class names
- Understand chart DOM structure
- Identify where `label` parameter is rendered

---

### 3. Progress Bar Label Check (1 missing detection)

**Expected Violation:**
- Progress bar with no label

**Current Implementation:**
```javascript
// checks-wcag.js lines ~33-37
$('[role="progressbar"]').forEach(el => {
  if (!el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label'))
    add(el, 'error', 'WCAG: Progress', getSail(el) + ' is missing an accessible label', ...);
});
```

**Problem:**
- Check exists but didn't fire
- May be checking wrong element or progress bar has a label
- Contrast check found the progress bar, so selector works

**Fix Needed:**
1. Verify selector is correct
2. Check if progress bar in test has a label (may be false positive in expected list)
3. Ensure we're checking the right element

**Appian Repo Analysis Required:**
- Confirm `a!progressBarField` class patterns
- Verify where `label` parameter is rendered

---

### 4. Breadcrumb Accessibility Text (1 missing detection)

**Expected Violation:**
- Breadcrumb with no accessibilityText identifying current page

**Current Implementation:**
```javascript
// checks-squad.js lines ~250-255
$('[class*="Breadcrumb---"]').forEach(el => {
  if (!el.getAttribute('aria-label') && !el.querySelector('[aria-current="page"]'))
    add(el, 'warning', 'Squad: Breadcrumbs', 'Breadcrumb missing accessibilityText', ...);
});
```

**Problem:**
- Selector may not match Appian breadcrumb component
- May not be present in test interface

**Fix Needed:**
1. Find correct CSS class pattern for breadcrumb component
2. Verify breadcrumb exists in test interface
3. Check for both `accessibilityText` and `aria-current="page"`

**Appian Repo Analysis Required:**
- Search for breadcrumb component class names
- Understand breadcrumb DOM structure

---

## 🟡 Medium Priority Gaps

### 5. Autocomplete/InputPurpose Check (1 missing detection)

**Expected Violation:**
- Personal info field missing `inputPurpose` (autocomplete attribute)

**Current Implementation:**
```javascript
// checks-squad.js lines ~95-105
$('input[type="text"], input[type="email"], input[type="tel"]').forEach(el => {
  const label = (el.getAttribute('aria-label') || '').toLowerCase();
  if (/name|email|phone|address|city|state|zip|postal|country/.test(label)) {
    if (!el.getAttribute('autocomplete'))
      add(el, 'warning', 'Squad: Forms', 'Personal info field missing autocomplete', ...);
  }
});
```

**Problem:**
- Check exists but may not be firing
- Label detection may not match test interface labels
- May need to check placeholder text too

**Fix Needed:**
1. Expand label detection to include:
   - Placeholder text
   - Associated label elements
   - Field instructions
2. Add more personal info keywords
3. Verify autocomplete attribute mapping

**Appian Repo Analysis Required:**
- Confirm how `inputPurpose` maps to `autocomplete` attribute
- Identify common label patterns for personal info fields

---

### 6. Required Field aria-required Check (1 missing detection)

**Expected Violation:**
- Required field without `required` parameter (should have `aria-required="true"`)

**Current Implementation:**
```javascript
// Not explicitly checking for aria-required on required fields
```

**Problem:**
- Check doesn't exist
- We check for required field legend but not individual field attributes

**Fix Needed:**
1. Add check for fields with required indicator (asterisk) but no `aria-required="true"`
2. Look for `[class*="required"]` or `[class*="Required"]` on field layouts
3. Verify corresponding input has `aria-required="true"`

**Appian Repo Analysis Required:**
- Find CSS class patterns for required field indicators
- Verify how `required` parameter maps to `aria-required` attribute

---

### 7. File Upload Instructions Check (1 missing detection)

**Expected Violation:**
- File upload with no instructions parameter

**Current Implementation:**
```javascript
// checks-squad.js lines ~260-265
$('input[type="file"]').forEach(el => {
  if (!hasLabel(el))
    add(el, 'error', 'Squad: File Upload', 'File upload is missing a label', ...);
  // Missing: instructions check
});
```

**Problem:**
- Only checking for label, not instructions
- Need to check for instructions parameter

**Fix Needed:**
1. Add check for instructions on file upload fields
2. Look for instructions element near file upload
3. Verify file upload has helpful guidance

**Appian Repo Analysis Required:**
- Find how `instructions` parameter is rendered for file upload
- Identify instructions element class patterns

---

## 🟢 Low Priority / Investigation Needed

### 8. Heading Hierarchy Skip (1 missing detection)

**Expected Violation:**
- Heading levels skipped (H1 to H4)

**Current Implementation:**
```javascript
// checks-squad.js lines ~179-186
let prevLv = 0;
$('h1,h2,h3,h4,h5,h6,[role="heading"]').forEach(el => {
  const lv = el.getAttribute('aria-level') ? +el.getAttribute('aria-level') : +el.tagName?.[1];
  if (lv && prevLv && lv > prevLv + 1)
    add(el, 'warning', 'Squad: Headings', 'Heading level skipped from h' + prevLv + ' to h' + lv, ...);
});
```

**Problem:**
- Check exists but didn't fire
- Test interface may use styled text instead of semantic headings
- May be in excluded site navigation

**Fix Needed:**
1. Verify test interface actually has semantic headings
2. Check if headings are in site nav (excluded)
3. May be working correctly - styled text can't be detected

**Investigation Required:**
- Check actual HTML of test interface
- Verify heading elements exist and aren't excluded

---

### 9. Visual List Check (1 missing detection)

**Expected Violation:**
- Visual list using bullet characters instead of semantic list

**Current Implementation:**
```javascript
// checks-squad.js lines ~205-215
$('[class*="RichText---"]').forEach(el => {
  const t = el.textContent || '';
  if (/^[\s\n]*[•\-\*]\s+.+[\s\n]+[•\-\*]\s+/m.test(t))
    add(el, 'warning', 'Squad: Lists', 'Text uses bullet characters — use a!listField', ...);
});
```

**Problem:**
- Check exists but didn't fire
- Pattern may not match test interface list format
- May not be present in test interface

**Fix Needed:**
1. Verify test interface has visual list
2. Expand regex pattern to catch more list formats
3. May be working correctly if no visual list present

---

## 📋 Appian Repo Analysis Plan

### Phase 1: Component Class Name Discovery
Search Appian repo for:
1. Icon component rendering (`IconField`, `RichTextIcon`)
2. Chart component rendering (all chart types)
3. Progress bar component rendering
4. Breadcrumb component rendering
5. File upload component rendering

### Phase 2: Parameter-to-DOM Mapping
Identify how SAIL parameters map to DOM:
1. `altText` → `aria-label` or `alt` attribute
2. `accessibilityText` → `aria-label` or `aria-describedby`
3. `label` → `aria-label` or `aria-labelledby`
4. `instructions` → specific element with class pattern
5. `inputPurpose` → `autocomplete` attribute
6. `required` → `aria-required` attribute

### Phase 3: CSS Class Pattern Extraction
Extract exact class name patterns:
1. `[class*="IconField---"]` or similar
2. `[class*="BarChart---"]` or similar
3. `[class*="ProgressBar---"]` or similar
4. `[class*="Breadcrumb---"]` or similar
5. `[class*="FileUpload---"]` or similar

### Phase 4: DOM Structure Understanding
Understand component hierarchy:
1. Which element in the tree should have the label?
2. Where are instructions rendered relative to the input?
3. How are icons nested in buttons/links?
4. What's the relationship between field layout and input?

---

## 🎯 Success Criteria

After fixes, the tool should detect:
- **All 5 icon alt text violations**
- **Chart label violation**
- **Progress bar label violation** (if actually missing)
- **Breadcrumb accessibilityText violation** (if present)
- **Autocomplete violation**
- **Required field aria-required violation**
- **File upload instructions violation**

**Target Detection Rate: 80-90%** of automatable violations

---

## Next Steps

1. ✅ **This document created**
2. 🔄 **Analyze Appian repo** (`/Users/ramaswamy.u/repo/forkedAe/ae`)
   - Search for component class names
   - Extract CSS patterns
   - Understand DOM structures
3. 🔧 **Implement fixes** based on findings
4. ✅ **Test on test interface**
5. 📊 **Update ACTUAL_RESULTS.md** with new detection rate
