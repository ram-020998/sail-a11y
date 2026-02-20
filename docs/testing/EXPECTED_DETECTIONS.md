# Expected Detections Analysis

This document maps the 70+ violations in the test interface to what our automated tool **should detect** vs. what requires **manual testing**.

## ✅ Should Be Detected (Automated) - ~35 violations

### Headings (2)
- ✅ Heading levels skipped (H1 to H4)
- ⚠️ Text heading not semantic (styled text vs h1-h6) - **PARTIAL** (only if no heading tags exist)

### Form Inputs (8)
- ✅ Input has no label parameter
- ✅ Placeholder text as only info (if no label/instructions)
- ✅ COLLAPSED label with no visual heading
- ✅ Duplicated controls with same name
- ✅ Personal info field missing autocomplete (inputPurpose)
- ✅ Checkbox with empty choiceLabels
- ✅ Multiple checkboxes with no group label
- ✅ Radio buttons with no group label

### Validations (2)
- ✅ Required field without aria-required
- ✅ Error message missing field name (if validation message exists)

### Instructions (2)
- ✅ Rich text before input (heuristic warning)
- ✅ Rich text before grid (heuristic warning)

### Lists (1)
- ✅ Visual list using bullet characters (heuristic)

### Grids (4)
- ✅ Grid has no label
- ✅ Missing column header text
- ✅ Empty column (heuristic based on width)
- ✅ Target size violations on row ordering links

### Section/Box Layout (2)
- ⚠️ Expandable section/box with no label - **PARTIAL** (complex DOM inspection)

### Cards (3)
- ✅ Card with link AND other controls
- ✅ Card link has label parameter (heuristic)
- ⚠️ Selected card missing "Selected" text - **PARTIAL** (requires state inspection)

### Card Choice (1)
- ✅ No label when multiple cards present

### Links (2)
- ✅ Link in text without underline (inline link check)
- ✅ Adjacent duplicate links

### Breadcrumbs (1)
- ✅ No accessibilityText on breadcrumb

### Progress Bar (1)
- ✅ No label on progress bar

### File Upload (2)
- ✅ No label on file upload
- ✅ No instructions on file upload

### Icons (5)
- ✅ Standalone icon in link with no altText
- ✅ Standalone icon button with no accessibilityText
- ✅ Standalone informational icon with no altText
- ✅ Decorative icon WITH altText (should be empty)
- ⚠️ Icon with text conveying extra info - **PARTIAL** (heuristic)

### Charts (1)
- ✅ No label on chart

### Color Contrast (2)
- ✅ Low contrast regular text (4.5:1)
- ✅ Low contrast large text (3:1)

### Forms - Required Legend (1)
- ✅ No required fields legend with asterisk

### Target Size (1)
- ✅ Elements < 24x24px (non-grid)

## ⚠️ Partially Detected (Heuristics) - ~8 violations

These generate **warnings** that require human review:

- Styled text that looks like heading (no semantic heading)
- Label parameter doesn't match visible label (requires SAIL code inspection)
- Rich text instructions (may be associated correctly)
- Empty grid columns (may be intentional)
- Card selected state (requires understanding selection logic)
- Icon conveying extra info (requires semantic understanding)
- Redundant accessibilityText (duplicate detection)
- Generic/internal variable labels

## ❌ Cannot Be Detected (Manual Testing Required) - ~27 violations

### SAIL Code Inspection Required
- Not using OOTB validation (requires SAIL code)
- a!dateTimeField used (requires SAIL code)
- Grid rowHeader not defined (requires SAIL code)
- Grid instructions parameter not used (requires SAIL code)
- Grid accessibilityText for controls above (requires SAIL code)
- No single-click alternative for drag/drop (requires SAIL code)
- Pane layout accessibilityText (requires SAIL code)
- Signature alternative method (requires SAIL code)
- Simulated grid cell accessibilityText (requires SAIL code)
- Custom pagination disabled link accessibilityText (requires SAIL code)
- focusOnFirstInput not FALSE (requires SAIL code)

### Visual/Interaction Testing Required
- Color as only means of conveying info (requires visual analysis)
- Selected state contrast (requires color picker)
- Image of text (requires visual inspection)
- Modal dialog focus order (requires interaction)
- Tooltip keyboard accessibility (requires keyboard testing)
- Stamp tooltip with important info (requires interaction)
- Dynamically-added content tab order (requires interaction)
- Dynamic messages announcement (requires screen reader)
- Magnification 200%/400% (requires zoom testing)
- Workflow visualization alternative (requires understanding context)
- Form re-entry requirement (requires multi-step workflow)

### Context/Judgment Required
- Link uses accessibilityText instead of icon altText (requires understanding intent)
- Unselected card marked as "Selected" (requires understanding state)

## 📊 Summary

| Category | Count | Percentage |
|---|---|---|
| **Automated Detection** | ~35 | ~50% |
| **Heuristic Warnings** | ~8 | ~11% |
| **Manual Testing Required** | ~27 | ~39% |
| **Total Violations** | ~70 | 100% |

## 🎯 Expected Test Results

When you run the tool on the test interface, you should see approximately:

- **35-40 errors/warnings** detected automatically
- **8-10 review warnings** requiring human judgment
- **~27 violations** will NOT be detected (require manual testing or SAIL code inspection)

This represents **~50-60% automated coverage** of the Aurora Squad-Level checklist, which is excellent for an automated tool. The remaining items require human judgment, SAIL code access, or interactive testing.
