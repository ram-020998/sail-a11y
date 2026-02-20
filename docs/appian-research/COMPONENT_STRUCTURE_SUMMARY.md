# Component Class Structure Summary

## Key Findings from Appian Repo Analysis

### ✅ Successfully Extracted: 180 Components

Full data available in:
- `appian-component-classes.json` - Complete class list for all components
- `COMPONENT_CLASS_REFERENCE.md` - Human-readable reference

---

## Critical Components for A11y Checker

### 1. FieldLayout (FIXED ✅)
**Classes:**
- `field_layout` - Container
- `field_label` - Label text element
- `field_instructions` - Instructions text
- `label_above` - Label wrapper (ABOVE position)
- `label_column` - Label wrapper (ADJACENT position)
- `accessibilityhidden` - Hidden label (COLLAPSED position)
- `input_below` - Input wrapper
- `required_indicator` - Required asterisk icon

**Usage:** Most form fields (TextField, DateField, etc.) are wrapped in FieldLayout

---

### 2. IconWidget
**Classes:**
- `color_accent`, `color_info`, `color_negative`, `color_positive`, `color_secondary`, `color_warn`
- Size classes: `extra_large`, `large`, `large_plus`, `medium`, `medium_plus`
- Context: `inAccentBackground`, `inDarkBackground`, `inIconAndTextSelectableCard`

**Selector:** `[class*="IconWidget"]` or look for `<svg>` with these classes

---

### 3. Charts (BarChart, LineChart, PieChart, ColumnChart, AreaChart)
**Key Finding:** Charts are **wrapped in FieldLayout**!

```javascript
// Chart components render as:
<FieldLayout>
  <BarChart2 /> // or LineChart2, PieChart2, etc.
</FieldLayout>
```

**Implication:** Chart label check should look for FieldLayout wrapper, not chart-specific classes

**Selector Strategy:**
```javascript
// Find chart elements
$('[class*="BarChart"], [class*="LineChart"], [class*="PieChart"], [class*="ColumnChart"], [class*="AreaChart"]').forEach(chart => {
  // Check parent FieldLayout for label
  const fieldLayout = chart.closest('[class*="FieldLayout"]');
  if (fieldLayout) {
    const hasLabel = fieldLayout.querySelector('[class*="field_label"]');
    if (!hasLabel || !hasLabel.textContent?.trim()) {
      // Chart missing label
    }
  }
});
```

---

### 4. ProgressBarField
**Classes:** (Empty - likely uses inline styles or parent FieldLayout)

**Selector:** `[role="progressbar"]` (ARIA role) or `[class*="ProgressBar"]`

**Note:** Also wrapped in FieldLayout, check parent for label

---

### 5. BreadcrumbLayout
**Classes:**
- `breadcrumbs` - Main container

**Selector:** `[class*="breadcrumbs"]` or `[class*="BreadcrumbLayout"]`

---

### 6. File Upload
**Components:** `MultipleFileUploadWidget`, `FileUploadWidget`

**Classes:**
- `drag_drop_zone_wrapper`
- `drop_instructions`
- `upload_link`
- `file_metadata`
- `upload_icon`

**Selector:** `input[type="file"]` or `[class*="FileUpload"]`

**Note:** Also wrapped in FieldLayout

---

### 7. CardLayout
**Classes:** (91 classes found!)
- `card_item` - Individual card
- `accent`, `accent_bar`, `accent_border`
- `circle_check_selection` - Selection indicator
- `decorative_bar`
- `disabled`
- `error`, `error_border`

**Selector:** `[class*="CardLayout"]` or `[class*="card_item"]`

---

### 8. GridField
**Classes:** (Need to check - likely has grid-specific classes)

**Selector:** `table`, `[role="grid"]`, or `[class*="GridField"]`

---

## Pattern Recognition

### Common Patterns:
1. **Module-prefixed classes:** `ComponentName---class_name`
2. **Context classes:** `inAccentBackground`, `inDarkBackground`, `inLightBackground`
3. **State classes:** `disabled`, `error`, `loading`
4. **Size classes:** `small`, `medium`, `large`, `extra_large`

### FieldLayout Wrapping:
Many components are wrapped in FieldLayout:
- All form inputs (TextField, DateField, DropdownField, etc.)
- Charts (BarChart, LineChart, etc.)
- Progress bars
- File uploads

**Implication:** When checking for labels, always check the parent FieldLayout first!

---

## Recommended Selector Updates

### Current Issues to Fix:

1. **Icon Alt Text Checks**
   ```javascript
   // Current (too broad):
   $('svg[role="img"], img, [class*="Icon---"]')
   
   // Better:
   $('svg[role="img"], img, [class*="IconWidget"]')
   ```

2. **Chart Label Checks**
   ```javascript
   // Current (doesn't work):
   $('[class*="Chart---"]')
   
   // Better (check FieldLayout parent):
   $('[class*="Chart"]').forEach(chart => {
     const field = chart.closest('[class*="FieldLayout"]');
     const label = field?.querySelector('[class*="field_label"]');
     // Check label...
   });
   ```

3. **Progress Bar Label**
   ```javascript
   // Current (works but could be better):
   $('[role="progressbar"]')
   
   // Better (also check FieldLayout):
   $('[role="progressbar"], [class*="ProgressBar"]').forEach(pb => {
     const field = pb.closest('[class*="FieldLayout"]');
     // Check field label...
   });
   ```

4. **Breadcrumb Check**
   ```javascript
   // Current (doesn't match):
   $('[class*="Breadcrumb---"]')
   
   // Better:
   $('[class*="breadcrumb"]') // lowercase!
   ```

---

## Next Steps

1. ✅ **FieldLayout label detection** - FIXED
2. 🔄 **Update chart checks** - Use FieldLayout parent
3. 🔄 **Update progress bar check** - Use FieldLayout parent
4. 🔄 **Update breadcrumb check** - Use lowercase selector
5. 🔄 **Update icon checks** - Use IconWidget class
6. 🔄 **Add file upload instructions check** - Check FieldLayout

---

## Usage

To find classes for any component:
```bash
# Check the JSON file
cat appian-component-classes.json | jq '.ComponentName.classes'

# Or check the markdown reference
grep -A 20 "### ComponentName" COMPONENT_CLASS_REFERENCE.md
```
