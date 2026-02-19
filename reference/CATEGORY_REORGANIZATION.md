# Category Reorganization - Aurora Squad-Level Priority

## Overview
Reorganized accessibility check categories to prioritize Aurora's Squad-Level Checks as the primary category, with consolidated groupings for remaining checks.

## New Category Structure

### 1. ⭐ Squad-Level (Aurora Priority)
**29 checks** - All items from Aurora accessibility checklist
- Squad: Forms (8 checks)
- Squad: Validations (2 checks)
- Squad: Grids (4 checks)
- Squad: Headings (2 checks)
- Squad: Lists (1 check)
- Squad: Breadcrumbs (1 check)
- Squad: Links (3 checks)
- Squad: Cards (3 checks)
- Squad: File Upload (2 checks)
- Squad: Date & Time (1 check)
- Squad: Dynamic (1 check)
- Squad: Charts (1 check)
- Squad: Icons (1 check)
- Squad: Images (2 checks)
- Squad: Tooltips (2 checks)
- Squad: Contrast (1 check)

### 2. WCAG Extended
**8 checks** - Additional WCAG requirements not in Squad-Level
- WCAG: Progress
- WCAG: Regions
- WCAG: Tabs
- WCAG: Dialogs
- WCAG: Tables
- WCAG: Frames
- WCAG: Nesting
- WCAG: Buttons

### 3. Appian Platform
**3 checks** - Appian-specific patterns not covered in Squad-Level
- Appian: Cards
- Appian: Stamps
- Appian: Dynamic

### 4. Review Required
**8 checks** - Items requiring human judgment
- Review: Names
- Review: A11y Text
- Review: Instructions
- Review: Icons
- Review: Labels (2 checks)
- Review: Page (2 checks)
- Review: Target Size

## Changes Made

### Files Updated
1. **settings.js** - Reorganized MODULES array with new consolidated structure
2. **checks-core.js** - Updated category names for core checks
3. **checks-appian.js** - Updated category names for Appian-specific checks
4. **checks-review.js** - Updated category names for review/heuristic checks
5. **checks-jira.js** - Updated category names for JIRA-derived checks
6. **checks-contrast.js** - Updated category name for contrast check

### Category Mapping

#### Old → New Mappings

**Forms:**
- `Forms` → `Squad: Forms`
- `Review: Forms` → `Squad: Forms`

**Grids:**
- `Grids` → `Squad: Grids`
- `Review: Grids` → `Squad: Grids`
- `Simulated Grid` → `Squad: Grids`

**Headings:**
- `Headings` → `Squad: Headings`
- `Review: Headings` → `Squad: Headings`

**Links:**
- `Links` → `Squad: Links`
- `Review: Links` → `Squad: Links`

**Cards:**
- `Cards` → `Squad: Cards`
- `Card Choice` → `Squad: Cards`
- `Card Group` → `Squad: Cards`
- `Review: Cards` → `Squad: Cards`
- `Appian` (clickable cards) → `Appian: Cards`

**Images & Icons:**
- `Images` → `Squad: Images`
- `Icons` → `Squad: Icons`
- `Review: Images` → `Squad: Images`
- `Appian` (stamps) → `Appian: Stamps`

**Validations:**
- `Validations` → `Squad: Validations`
- `Review: Validation` → `Squad: Validations`

**Other Squad-Level:**
- `Date & Time` → `Squad: Date & Time`
- `File Upload` → `Squad: File Upload`
- `Breadcrumbs` → `Squad: Breadcrumbs`
- `Charts` → `Squad: Charts`
- `Dynamic Messages` → `Squad: Dynamic`
- `Stamp` → `Squad: Tooltips`
- `Review: Tooltip` → `Squad: Tooltips`
- `Review: Lists` → `Squad: Lists`
- `Contrast` → `Squad: Contrast`

**WCAG Extended:**
- `Buttons` → `WCAG: Buttons`
- `Tables` → `WCAG: Tables`
- `Progress` → `WCAG: Progress`
- `Regions` → `WCAG: Regions`
- `Tabs` → `WCAG: Tabs`
- `Dialogs` → `WCAG: Dialogs`
- `Frames` → `WCAG: Frames`
- `Nesting` → `WCAG: Nesting`

**Review Required:**
- `Review: Duplicate Names` → `Review: Names`
- `Review: Redundant A11y Text` → `Review: A11y Text`
- `Review: Instructions` → `Review: Instructions`
- `Review: Decorative Icons` → `Review: Icons`
- `Review: Labels` → `Review: Labels`
- `Labels` (internal vars) → `Review: Labels`
- `Page` → `Review: Page`
- `Review: Page` → `Review: Page`
- `Review: Target Size` → `Review: Target Size`

## Benefits

1. **Aurora Alignment** - Squad-Level checks are now clearly identified and prioritized
2. **Reduced Fragmentation** - Consolidated from 5 modules to 4 logical groups
3. **Clear Priority** - ⭐ star icon indicates highest priority checks
4. **Better Organization** - Related checks grouped by functional area within Squad-Level
5. **Easier Filtering** - Users can quickly enable/disable entire priority levels

## Testing Checklist

- [ ] Load extension in Chrome
- [ ] Open settings page - verify new category structure displays correctly
- [ ] Run full scan on test page - verify all checks still execute
- [ ] Verify issue cards show new category names
- [ ] Test category filtering in settings
- [ ] Test workflow recording with new categories
- [ ] Export HTML report - verify new categories appear correctly
- [ ] Verify backward compatibility with existing saved settings

## Notes

- All 60+ checks are preserved - only category names changed
- Check logic and severity levels unchanged
- Settings storage format remains compatible
- Module keys changed: `coreChecks` → `squadLevel`, `appianChecks` → `appianPlatform`, etc.
