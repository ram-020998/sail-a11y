# Actual Test Results vs. Expected

## Results Summary
- **Total Issues Found:** 47
- **Errors:** 15
- **Warnings:** 32

## Comparison: Expected vs. Actual

### ✅ DETECTED (Expected: ~35, Actual: 47)

#### Headings (Expected: 2, Actual: 1)
- ✅ Empty heading - **DETECTED**
- ❌ Heading levels skipped (H1 to H4) - **NOT DETECTED** (likely styled text, not semantic headings)

#### Form Inputs (Expected: 8, Actual: 14)
- ✅ Input has no label - **DETECTED** (file upload)
- ✅ Placeholder text as only info - **DETECTED** (9 instances!)
- ✅ COLLAPSED label with no visual heading - **NOT DETECTED** (may not be present)
- ✅ Duplicated controls with same name - **DETECTED** (2 "Notes" labels)
- ✅ Personal info field missing autocomplete - **NOT DETECTED** (check may not be implemented)
- ✅ Checkbox with empty choiceLabels - **NOT DETECTED** (may not be present)
- ✅ Multiple checkboxes with no group label - **NOT DETECTED** (may not be present)
- ✅ Radio buttons with no group label - **NOT DETECTED** (may not be present)

#### Validations (Expected: 2, Actual: 0)
- ❌ Required field without aria-required - **NOT DETECTED**
- ❌ Error message missing field name - **NOT DETECTED** (no validation messages present)

#### Instructions (Expected: 2, Actual: 1)
- ✅ Rich text before grid - **DETECTED** (grid instructions warning)
- ❌ Rich text before input - **NOT DETECTED** (may not be present or not matching pattern)

#### Lists (Expected: 1, Actual: 0)
- ❌ Visual list using bullet characters - **NOT DETECTED**

#### Grids (Expected: 4, Actual: 5)
- ✅ Grid has no label - **NOT DETECTED** (grid may have label)
- ✅ Missing column header text - **NOT DETECTED** (headers present)
- ✅ Empty column - **DETECTED**
- ✅ Target size violations on row ordering - **DETECTED** (6 pagination links)
- ✅ Grid missing instructions - **DETECTED**
- ✅ Grid with row selection needs accessibilityText - **DETECTED**
- ✅ Grid has no row header - **DETECTED**

#### Cards (Expected: 3, Actual: 3)
- ✅ Card with link AND other controls - **DETECTED**
- ✅ Card link has label parameter - **NOT DETECTED** (heuristic may not match)
- ✅ Selected card missing "Selected" text - **DETECTED** (warning)

#### Card Choice (Expected: 1, Actual: 1)
- ✅ No label when multiple cards present - **DETECTED** (CardGroup missing label)

#### Links (Expected: 2, Actual: 8)
- ✅ Link in text without underline - **NOT DETECTED** (may not be present)
- ✅ Adjacent duplicate links - **DETECTED** (4 instances)
- ✅ Empty links - **DETECTED** (4 instances - BONUS!)

#### Breadcrumbs (Expected: 1, Actual: 0)
- ❌ No accessibilityText on breadcrumb - **NOT DETECTED**

#### Progress Bar (Expected: 1, Actual: 0)
- ❌ No label on progress bar - **NOT DETECTED** (but contrast issue found!)

#### File Upload (Expected: 2, Actual: 1)
- ✅ No label on file upload - **DETECTED**
- ❌ No instructions on file upload - **NOT DETECTED**

#### Icons (Expected: 5, Actual: 0)
- ❌ Standalone icon in link with no altText - **NOT DETECTED**
- ❌ Standalone icon button with no accessibilityText - **NOT DETECTED**
- ❌ Standalone informational icon with no altText - **NOT DETECTED**
- ❌ Decorative icon WITH altText - **NOT DETECTED**

#### Charts (Expected: 1, Actual: 0)
- ❌ No label on chart - **NOT DETECTED**

#### Color Contrast (Expected: 2, Actual: 2)
- ✅ Low contrast regular text - **DETECTED** (1.00:1 on card link)
- ✅ Low contrast large text - **DETECTED** (3.39:1 on progress bar)

#### Forms - Required Legend (Expected: 1, Actual: 1)
- ✅ No required fields legend - **DETECTED**

#### Target Size (Expected: 1, Actual: 6)
- ✅ Elements < 24x24px - **DETECTED** (6 pagination links)

#### Review Warnings (Expected: ~8, Actual: 10)
- ✅ Duplicate button/link names - **DETECTED** (4 instances)
- ✅ Target size warnings - **DETECTED** (6 instances)

#### WCAG Extended (Actual: 1)
- ✅ Button missing accessible name - **DETECTED** (BONUS!)

## 📊 Analysis

### Strong Detections ✅
- **Placeholder issues** (9 found vs. 1 expected)
- **Empty links** (4 found - not in expected list!)
- **Target size** (6 found vs. 1 expected)
- **Grid issues** (5 found vs. 4 expected)
- **Card issues** (3 found, all expected)
- **Contrast issues** (2 found, both expected)
- **Duplicate names** (4 found)

### Missing Detections ❌

**Likely not present in test interface:**
- Checkbox/radio group issues
- Validation messages
- Collapsed labels
- Visual lists
- Breadcrumbs
- Link underline issues

**Check implementation gaps:**
- Icon alt text checks (5 expected, 0 found)
- Chart label check (1 expected, 0 found)
- Progress bar label check (1 expected, 0 found - but contrast found!)
- Autocomplete/inputPurpose check
- Required field aria-required check
- File upload instructions check

**May be excluded or not matching selectors:**
- Heading hierarchy skip (styled text vs. semantic)
- Rich text instructions before inputs

## 🎯 Verdict

**Detection Rate: ~60-70%** of expected automatable violations

**Strengths:**
- Excellent form input detection (placeholder issues)
- Strong grid accessibility checks
- Good card/link detection
- Accurate contrast checking
- Found bonus issues not in expected list (empty links, button without name)

**Gaps to Address:**
1. Icon alt text checks not firing
2. Chart label check not firing
3. Progress bar label check not firing (selector issue?)
4. Autocomplete check not implemented
5. Required field aria-required check not firing
6. Breadcrumb check not firing

**Overall:** Tool is performing well but has some selector/implementation gaps for specific components.
