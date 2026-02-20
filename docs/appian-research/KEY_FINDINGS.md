# Key Findings from Appian Component Research

## Critical Selector Corrections

### FieldLayout Structure
```javascript
// Container
'[class*="FieldLayout"]' or '[class*="field_layout"]'

// Label element (CORRECT - not just "label")
'[class*="field_label"]'

// Instructions
'[class*="field_instructions"]'

// Required indicator
'[class*="required_indicator"]'
```

### Component-Specific Selectors

#### Icons
```javascript
'[class*="IconWidget"]'  // Not IconField
'[class*="ComplexSvgIcon"]'
'[class*="NewsEntryIconWidget"]'
```

#### Stamps
```javascript
'[class*="StampWidget"]'  // Not StampField
```

#### Charts (All wrapped in FieldLayout)
```javascript
'[class*="BarChart"]'
'[class*="LineChart"]'
'[class*="PieChart"]'
'[class*="ColumnChart"]'
'[class*="AreaChart"]'

// Check label via parent FieldLayout
chart.closest('[class*="FieldLayout"]')?.querySelector('[class*="field_label"]')
```

#### Progress Bars
```javascript
'[role="progressbar"]'
'[class*="ProgressBarWidget"]'
'[class*="ProgressBarField"]'

// Check label via parent FieldLayout
progressBar.closest('[class*="FieldLayout"]')?.querySelector('[class*="field_label"]')
```

#### Breadcrumbs
```javascript
'[class*="breadcrumb"]'  // LOWERCASE - not "Breadcrumb"
```

#### File Upload
```javascript
'[class*="FileUploadWidget"]'
'[class*="MultipleFileUploadWidget"]'
```

#### Buttons & Links
```javascript
'[class*="ButtonWidget"]'
'[class*="LinkField"]'
```

#### Cards
```javascript
'[class*="CardLayout"]'
```

#### Grids
```javascript
'[class*="GridField"]'
```

## Component Wrapping Pattern

Many components render inside FieldLayout, which provides the label/instructions structure:
- All chart types
- ProgressBarField
- Form inputs (TextField, DropdownField, CheckboxField, etc.)
- File upload widgets

**Implication:** When checking for labels on these components, query the parent FieldLayout container, not the component itself.

## Label Position Classes

FieldLayout supports different label positions:
- `label_above` - Label above the field (default)
- `label_column` - Label adjacent to field (side-by-side)
- `accessibilityhidden` - Label collapsed (visually hidden but accessible)

## Common False Positive Causes

1. **Using `[class*="label"]`** - Matches wrapper divs, not actual labels
   - ✅ Fix: Use `[class*="field_label"]`

2. **Checking component directly for label** - Component is wrapped in FieldLayout
   - ✅ Fix: Check `element.closest('[class*="FieldLayout"]')`

3. **Case sensitivity** - Some classes are lowercase (breadcrumbs)
   - ✅ Fix: Use exact casing from component source

## Module Prefix Pattern

Appian uses CSS modules with prefixes:
```
ComponentName---class_name
```

Examples:
- `FieldLayout---field_label`
- `FieldLayout---field_instructions`
- `ButtonWidget---button`

**Implication:** Use `[class*="field_label"]` to match both prefixed and non-prefixed versions.
