# Appian Component Research Process

## Objective
Extract CSS class patterns from Appian's core repository to fix false positives and improve detection accuracy in the SAIL A11y Checker.

## Problem Identified
The tool was using generic selectors like `[class*="label"]` which matched wrapper divs instead of actual label elements, causing false positives.

## Research Location
**Appian Core Repository:** `/Users/ramaswamy.u/repo/forkedAe/ae/appian-libraries/sail-client/src/components`

## Methodology

### 1. Manual Component Analysis
Analyzed key components to understand structure:

- **FieldLayout** (`FieldLayout/FieldLayout.jsx`, `FieldLayout.less`)
  - Discovered correct label class: `field_label` (not just "label")
  - Found label positions: ABOVE, ADJACENT, COLLAPSED
  - Instructions class: `field_instructions`
  - Required indicator: `required_indicator`

- **Chart Components** (`BarChart/BarChart.jsx`)
  - Discovered all charts are wrapped in FieldLayout
  - Chart labels should be checked via parent FieldLayout, not chart-specific classes

### 2. Automated Extraction Script
Created `extract-component-classes.py` to systematically extract CSS classes from all components:

**Script Logic:**
- Scans all 483 component directories
- Extracts CSS classes from `.less` files using regex: `\.([a-zA-Z_][a-zA-Z0-9_-]*)\s*\{`
- Extracts className references from `.jsx/.tsx` files using regex: `className[s]?[=:].*?['"\`]([^'"\`]+)['"\`]`
- Deduplicates and organizes by component
- Outputs JSON and markdown formats

**Results:**
- 481 components analyzed (99.6% coverage)
- 279 components with CSS classes
- 2,659 unique CSS classes extracted

### 3. Key Findings

#### Component Naming Corrections
- `IconWidget` (not IconField)
- `StampWidget` (not StampField)
- `BreadcrumbLayout` (class: `breadcrumbs` lowercase)
- `ProgressBarWidget` and `ProgressBarField` both exist

#### Critical Selectors
```javascript
// Field labels - CORRECT
field.querySelector('[class*="field_label"]')

// Field instructions
field.querySelector('[class*="field_instructions"]')

// Icons
$('[class*="IconWidget"]')

// Breadcrumbs
$('[class*="breadcrumb"]')  // lowercase!

// Charts (check parent FieldLayout)
chart.closest('[class*="FieldLayout"]')
```

#### Component Wrapping Pattern
Many components are wrapped in FieldLayout:
- All chart types (BarChart, LineChart, PieChart, etc.)
- ProgressBarField
- Form inputs (TextField, DropdownField, etc.)

This means label checks should look at the parent FieldLayout container, not the component itself.

## Files Generated

### Essential Reference (Kept)
- `docs/appian-research/component-selectors.json` - Minimal selector reference for the tool

### Research Documentation (Kept)
- `docs/appian-research/RESEARCH_PROCESS.md` - This document
- `docs/appian-research/KEY_FINDINGS.md` - Summary of critical discoveries

### Raw Data (Archived)
- Full component extraction data moved to temporary archive
- Can be regenerated if needed using the extraction script

## Application to Tool

### Fixes Applied
1. **Label Detection** - Changed from `[class*="label"]` to `[class*="field_label"]` in 4 locations
2. **Component Selectors** - Updated to use correct class names from extraction

### Remaining Fixes (TODO)
1. Icon checks - Use `[class*="IconWidget"]`
2. Chart checks - Check parent FieldLayout
3. Progress bar - Check parent FieldLayout
4. Breadcrumb - Use lowercase `[class*="breadcrumb"]`
5. Stamp - Use `[class*="StampWidget"]`

## Lessons Learned

1. **Don't assume class names** - Appian uses specific naming conventions that must be extracted from source
2. **Component wrapping matters** - Many components are wrapped in FieldLayout, affecting how we query for labels
3. **Module prefixes exist** - Classes often use `ComponentName---class_name` pattern
4. **Systematic extraction beats manual** - Automated extraction found patterns we would have missed

## Reproducibility

To re-extract component data:
```bash
cd /Users/ramaswamy.u/repo/sail-a11y
python3 extract-component-classes.py
```

This regenerates the full component class database from the Appian core repository.
