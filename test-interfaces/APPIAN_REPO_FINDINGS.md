# Appian Repo Analysis - Key Findings

## Priority 0: Field Layout & Label Detection

### ✅ FOUND: Correct CSS Class Patterns

**Location:** `/Users/ramaswamy.u/repo/forkedAe/ae/appian-libraries/sail-client/src/components/FieldLayout/`

### Field Layout Structure

**CSS Classes:**
- Field container: `FieldLayout---field_layout` or `field_layout`
- Label wrapper (ABOVE position): `FieldLayout---label_above` or `label_above`
- Label text element: `FieldLayout---field_label` or `field_label`
- Input wrapper: `FieldLayout---input_below` or `input_below`
- Label column (ADJACENT position): `FieldLayout---label_column` or `label_column`
- Input column (ADJACENT position): `FieldLayout---input_column` or `input_column`
- Instructions: `FieldLayout---field_instructions` or `field_instructions`
- Required indicator: `FieldLayout---required_indicator` or `required_indicator`
- Secondary label (Optional/Required text): `FieldLayout---secondary_label` or `secondary_label`

### Label Positions

From `FieldLayout.jsx` lines 300-310:

```javascript
case 'COLLAPSED':
  classnames = skin.accessibilityhidden;
  break;
case 'NONE':
  return null;
case 'ABOVE':
default:
  classnames = skin.label_above;
  break;
```

**Label Position Classes:**
1. **ABOVE** (default): `.label_above` wrapper with `.field_label` span inside
2. **ADJACENT**: `.label_column` with `.field_label` inside
3. **COLLAPSED**: `.accessibilityhidden` class (label hidden visually)
4. **NONE**: No label rendered
5. **JUSTIFIED**: Similar to ADJACENT

### Rendered HTML Structure

**ABOVE Position:**
```html
<div class="FieldLayout---field_layout" role="presentation">
  <div class="FieldLayout---label_above">
    <span class="FieldLayout---field_label" id="...">Label Text</span>
    <!-- Optional: help tooltip icon -->
    <!-- Optional: required asterisk -->
  </div>
  <div class="FieldLayout---input_below">
    <input ...>
  </div>
</div>
```

**ADJACENT Position:**
```html
<div class="FieldLayout---field_layout" role="presentation">
  <div class="FieldLayout---label_column">
    <label class="FieldLayout---field_label">Label Text</label>
  </div>
  <div class="FieldLayout---input_column">
    <input ...>
  </div>
</div>
```

**COLLAPSED Position:**
```html
<div class="FieldLayout---field_layout" role="presentation">
  <div class="FieldLayout---accessibilityhidden">
    <span class="FieldLayout---field_label">Label Text</span>
  </div>
  <div class="FieldLayout---input_below">
    <input ...>
  </div>
</div>
```

### Key Insights

1. **Class name pattern:** `FieldLayout---field_label` (with module prefix) or `field_label` (without)
2. **Element type:** Can be `<span>` or `<label>` depending on position
3. **Parent wrapper:** Always inside `.label_above`, `.label_column`, or `.accessibilityhidden`
4. **Visibility:** COLLAPSED labels have `.accessibilityhidden` class but still exist in DOM

### Current Tool Issue

**Current selector:** `[class*="label"]`
- Too broad - matches many elements
- Doesn't specifically target `.field_label`

**Correct selector should be:**
```javascript
// Option 1: Specific class match
field.querySelector('[class*="field_label"]')

// Option 2: Multiple selectors for different positions
field.querySelector('.label_above .field_label, .label_column .field_label, .label_above [class*="field_label"], .label_column [class*="field_label"]')

// Option 3: Check for any label-like element
field.querySelector('[class*="field_label"], [class*="label_above"], [class*="label_column"]')
```

### Instructions Detection

**CSS Class:** `field_instructions` or `FieldLayout---field_instructions`

**Location:** Usually rendered below the label, above the input

```html
<div class="FieldLayout---field_layout">
  <div class="FieldLayout---label_above">
    <span class="FieldLayout---field_label">Label</span>
  </div>
  <div class="FieldLayout---field_instructions">
    Instructions text here
  </div>
  <div class="FieldLayout---input_below">
    <input ...>
  </div>
</div>
```

### Required Field Indicator

**CSS Class:** `required_indicator` or `FieldLayout---required_indicator`

**Element:** `<svg>` icon with `fa-asterisk` name

**Alt text:** Localized "asterisk" text

---

## Fix Implementation

### Updated Label Detection Logic

```javascript
// checks-squad.js - Placeholder check fix

$('input[placeholder], textarea[placeholder]').forEach(el => {
  if (isInsideGrid(el)) return;
  
  // Check for aria-label or aria-labelledby
  if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return;
  
  const field = el.closest('[class*="FieldLayout"]');
  if (!field) return;
  
  // Check for field_label in any position
  const hasFieldLabel = field.querySelector('[class*="field_label"]');
  if (hasFieldLabel && hasFieldLabel.textContent?.trim()) return;
  
  // Check for instructions
  const hasInstructions = field.querySelector('[class*="field_instructions"]');
  if (hasInstructions && hasInstructions.textContent?.trim()) return;
  
  // Check for associated label element
  if (el.id && document.querySelector(`label[for="${el.id}"]`)) return;
  
  // If we get here, it's truly missing a label
  add(el, 'warning', 'Squad: Forms', 'Input uses placeholder with no visible label', ...);
});
```

### Verification Steps

1. Check for `[class*="field_label"]` - more specific than `[class*="label"]`
2. Verify text content exists and is not empty
3. Check for instructions as alternative
4. Check for `<label for="...">` association
5. Respect COLLAPSED labels (they exist in DOM with `.accessibilityhidden`)

---

## Next: Other Component Findings

Now that we have the field layout structure, we can search for:
1. Icon components (IconField, RichTextIcon)
2. Chart components (BarChart, LineChart, etc.)
3. Progress bar component
4. Breadcrumb component
5. File upload component

These will follow similar patterns with module-prefixed class names.
