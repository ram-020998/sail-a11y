# Accessibility Violation Test Interface - Checklist Mapping

This maps each section of `a11y-violation-test-interface.sail` to the checklist items it violates.

| Section | Checklist Category | Violation |
|---|---|---|
| 1 | Headings | Text heading not defined as semantic heading (uses richText instead of a!headingField) |
| 1 | Headings | Heading levels skipped (jumps from H1-level to H4) |
| 2 | Form Inputs | Input has no label parameter |
| 2 | Form Inputs | Placeholder text used as only source of important info |
| 2 | Form Inputs | No persistently visible label (COLLAPSED with no visual label) |
| 2 | Form Inputs | Label parameter doesn't match visible label |
| 2 | Form Inputs | Personal info field missing inputPurpose |
| 2 | Form Inputs | Duplicated controls with same name, no distinguishing context |
| 3 | Form Inputs | Checkbox choiceLabels are empty |
| 3 | Form Inputs | Multiple checkboxes with no group label |
| 3 | Form Inputs | Radio buttons with no group label |
| 4 | Validations | Required field without required parameter |
| 4 | Validations | Not using OOTB validation |
| 4 | Validations | Error message missing input name |
| 5 | Instructions | Visible instructions not using instructions parameter |
| 6 | Date & Time | a!dateTimeField used (prohibited component) |
| 7 | Lists | Visual list using bullet characters instead of semantic list |
| 8 | Grids | Grid has no label |
| 8 | Grids | Missing column header text |
| 8 | Grids | No rowHeader defined |
| 8 | Grids | Empty column used for spacing |
| 8 | Grids | Instructions not via grid instructions parameter |
| 8 | Grids | No accessibilityText warning about controls above grid |
| 8 | Grids | Row ordering links violate 24x24 target size |
| 8 | Grids | No single-click alternative for drag and drop |
| 9 | Section Layout | Expandable section with no label or labelHeadingTag |
| 9 | Box Layout | Expandable box with no label or labelHeadingTag |
| 10 | Pane Layout | No accessibilityText on pane |
| 11 | Cards | Card with link AND other controls inside |
| 11 | Cards | Card link has a label parameter value |
| 11 | Cards | Selected card has no "Selected" accessibilityText |
| 11 | Cards | Unselected card incorrectly marked as "Selected" |
| 12 | Card Choice Field | No label when multiple cards present |
| 13 | Links | Link in text uses only color to differentiate |
| 13 | Links | Selected link uses accessibilityText instead of icon altText |
| 14 | Breadcrumbs | No accessibilityText identifying breadcrumb or current page |
| 15 | Progress Bar | No label on progress bar |
| 16 | File Upload | No label on file upload |
| 16 | File Upload | No instructions on file upload |
| 17 | Signature | No alternative keyboard method for signature |
| 18 | Simulated Grid | No accessibilityText on cells with column header context |
| 19 | Custom Pagination | Disabled links have accessibilityText (should be null) |
| 19 | Custom Pagination | Active pagination links violate 24x24 target size |
| 20 | Icon | Standalone icon in link with no altText |
| 20 | Icon | Icon with text in link conveys extra info but no altText |
| 20 | Icon | Standalone icon button with no accessibilityText/tooltip |
| 20 | Icon | Icon with text in button adds info but no accessibilityText |
| 20 | Icon | Standalone informational icon with no altText |
| 20 | Icon | Decorative/redundant icon WITH altText (should have none) |
| 21 | Charts | No label on chart |
| 22 | Color Contrast - Text | Low contrast regular text (~1.6:1 vs 4.5:1 required) |
| 22 | Color Contrast - Text | Low contrast large text (~2.8:1 vs 3:1 required) |
| 22 | Color Contrast - Selected | Poor contrast between selected/unselected states |
| 23 | Color Use | Color is the only means of conveying information |
| 24 | Image of Text | Image contains embedded text |
| 25 | Modal Dialog | Focus moved to input when important info precedes it |
| 26 | Tooltip | Tooltip not accessible via keyboard |
| 26 | Stamp | Important info conveyed via tooltip/helpTooltip on stamp |
| 27 | Dynamically-Added Content | Content added before trigger in tab order |
| 27 | Dynamically-Added Content | No messageBanner announcement |
| 28 | Dynamic Status Messages | Not using a!messageBanner with announceBehavior |
| 29 | Magnification 200% | Content may overlap at 200% zoom |
| 29 | Magnification 400% | Requires horizontal scrolling at 400% zoom |
| 30 | Workflow Visualization | No alternative view provided |
| 31 | Forms | No required fields legend with asterisk |
| 31 | Forms | focusOnFirstInput not set to FALSE |
| 31 | Forms | User must re-enter previously provided info |
