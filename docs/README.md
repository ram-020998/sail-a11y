# Documentation

This folder contains research documentation and testing artifacts for the SAIL A11y Checker.

## Structure

### `appian-research/`
Research findings from analyzing Appian's core component repository.

**Files:**
- `RESEARCH_PROCESS.md` - Methodology and process documentation
- `KEY_FINDINGS.md` - Critical selector patterns and corrections
- `component-selectors.json` - Minimal selector reference (17 essential components)
- `APPIAN_REPO_FINDINGS.md` - Initial findings from manual analysis
- `COMPONENT_STRUCTURE_SUMMARY.md` - Component structure patterns

**Purpose:** Documents how we identified correct CSS selectors to fix false positives and improve detection accuracy.

### `testing/`
Test interface and validation documentation.

**Files:**
- `a11y-violation-test-interface.sail` - SAIL code with 70+ intentional violations
- `VIOLATION_MAP.md` - Maps violations to checklist items
- `EXPECTED_DETECTIONS.md` - Analysis of what should be detected (35 automated, 8 heuristic, 27 manual)
- `ACTUAL_RESULTS.md` - Comparison of expected vs actual detection results
- `FIX_PLAN.md` - Prioritized plan for fixing implementation gaps

**Purpose:** Validates tool accuracy and tracks implementation progress.

## Quick Reference

### For Developers Fixing Checks
1. Start with `appian-research/KEY_FINDINGS.md` for correct selectors
2. Reference `testing/FIX_PLAN.md` for prioritized fixes
3. Use `appian-research/component-selectors.json` for selector patterns

### For Understanding Research Process
1. Read `appian-research/RESEARCH_PROCESS.md` for methodology
2. See `appian-research/APPIAN_REPO_FINDINGS.md` for initial discoveries

### For Testing
1. Deploy `testing/a11y-violation-test-interface.sail` to Appian
2. Compare results against `testing/EXPECTED_DETECTIONS.md`
3. Update `testing/ACTUAL_RESULTS.md` with findings
