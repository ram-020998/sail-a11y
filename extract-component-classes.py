#!/usr/bin/env python3
"""
Appian Component Class Structure Extractor

Extracts CSS class patterns from all SAIL components in the Appian repo
to help build accurate selectors for the accessibility checker.
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

# Appian repo path
APPIAN_REPO = "/Users/ramaswamy.u/repo/forkedAe/ae"
COMPONENTS_DIR = f"{APPIAN_REPO}/appian-libraries/sail-client/src/components"

def extract_classes_from_less(file_path):
    """Extract CSS class names from .less files"""
    classes = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Match class definitions like .class_name or .ComponentName---class_name
            pattern = r'\.([a-zA-Z_][a-zA-Z0-9_-]*(?:---[a-zA-Z_][a-zA-Z0-9_-]*)?)\s*[{,]'
            matches = re.findall(pattern, content)
            classes.extend(matches)
    except Exception as e:
        pass
    return list(set(classes))

def extract_classes_from_jsx(file_path):
    """Extract className references from JSX/JS files"""
    classes = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Match className={skin.class_name} or className="class_name"
            pattern1 = r'className=\{[^}]*\.([a-zA-Z_][a-zA-Z0-9_-]*)'
            pattern2 = r'className="([^"]+)"'
            pattern3 = r"className='([^']+)'"
            
            matches1 = re.findall(pattern1, content)
            matches2 = re.findall(pattern2, content)
            matches3 = re.findall(pattern3, content)
            
            classes.extend(matches1)
            classes.extend(matches2)
            classes.extend(matches3)
    except Exception as e:
        pass
    return list(set(classes))

def analyze_component(component_dir):
    """Analyze a single component directory"""
    component_name = os.path.basename(component_dir)
    
    result = {
        'name': component_name,
        'classes': [],
        'less_files': [],
        'jsx_files': []
    }
    
    # Find all .less files
    for file in Path(component_dir).rglob('*.less'):
        if '__tests__' not in str(file):
            result['less_files'].append(str(file))
            classes = extract_classes_from_less(file)
            result['classes'].extend(classes)
    
    # Find all .jsx and .js files
    for ext in ['*.jsx', '*.js', '*.tsx', '*.ts']:
        for file in Path(component_dir).rglob(ext):
            if '__tests__' not in str(file) and '__i18n__' not in str(file):
                result['jsx_files'].append(str(file))
                classes = extract_classes_from_jsx(file)
                result['classes'].extend(classes)
    
    # Deduplicate and sort
    result['classes'] = sorted(list(set(result['classes'])))
    
    return result

def main():
    """Main extraction function"""
    print("🔍 Extracting component class structures from Appian repo...")
    print(f"📁 Components directory: {COMPONENTS_DIR}\n")
    
    components = {}
    priority_components = [
        # Form components
        'TextField', 'FieldLayout', 'EncryptedTextField', 'ParagraphField',
        'IntegerField', 'DecimalField', 'DateField', 'DateTimeField',
        'DropdownField', 'CheckboxField', 'RadioButtonField',
        'MultipleFileUploadWidget', 'FileUploadWidget',
        
        # Icon components
        'IconWidget', 'ComplexSvgIcon', 'NewsEntryIconWidget',
        
        # Chart components
        'BarChart', 'LineChart', 'PieChart', 'ColumnChart', 'AreaChart',
        'BarChart2', 'LineChart2', 'PieChart2', 'ColumnChart2',
        
        # Layout components
        'CardLayout', 'GridField', 'BreadcrumbLayout', 'ProgressBarField',
        
        # Image components
        'ImageField', 'StampField',
        
        # Other priority
        'ButtonWidget', 'LinkField', 'RichTextDisplayField'
    ]
    
    # Get all component directories
    if not os.path.exists(COMPONENTS_DIR):
        print(f"❌ Components directory not found: {COMPONENTS_DIR}")
        return
    
    component_dirs = [d for d in os.listdir(COMPONENTS_DIR) 
                     if os.path.isdir(os.path.join(COMPONENTS_DIR, d))]
    
    print(f"📊 Found {len(component_dirs)} components\n")
    
    # Analyze priority components first
    print("🎯 Analyzing priority components:")
    for comp_name in priority_components:
        comp_dir = os.path.join(COMPONENTS_DIR, comp_name)
        if os.path.exists(comp_dir):
            print(f"  ✓ {comp_name}")
            result = analyze_component(comp_dir)
            if result['classes']:
                components[comp_name] = result
        else:
            print(f"  ✗ {comp_name} (not found)")
    
    print(f"\n📝 Analyzing remaining components...")
    for comp_name in component_dirs:
        if comp_name not in priority_components and not comp_name.startswith('_'):
            comp_dir = os.path.join(COMPONENTS_DIR, comp_name)
            result = analyze_component(comp_dir)
            if result['classes']:
                components[comp_name] = result
    
    # Save results
    output_file = "/Users/ramaswamy.u/repo/sail-a11y/test-interfaces/appian-component-classes.json"
    with open(output_file, 'w') as f:
        json.dump(components, f, indent=2)
    
    print(f"\n✅ Extracted {len(components)} components")
    print(f"💾 Saved to: {output_file}")
    
    # Generate summary report
    summary_file = "/Users/ramaswamy.u/repo/sail-a11y/test-interfaces/COMPONENT_CLASS_REFERENCE.md"
    with open(summary_file, 'w') as f:
        f.write("# Appian Component Class Reference\n\n")
        f.write("Auto-generated reference of CSS class patterns for all SAIL components.\n\n")
        f.write("## Priority Components\n\n")
        
        for comp_name in priority_components:
            if comp_name in components:
                comp = components[comp_name]
                f.write(f"### {comp_name}\n\n")
                f.write(f"**Classes found:** {len(comp['classes'])}\n\n")
                if comp['classes']:
                    f.write("```\n")
                    for cls in comp['classes'][:20]:  # Show first 20
                        f.write(f"{cls}\n")
                    if len(comp['classes']) > 20:
                        f.write(f"... and {len(comp['classes']) - 20} more\n")
                    f.write("```\n\n")
        
        f.write("## All Components\n\n")
        f.write("| Component | Classes Found |\n")
        f.write("|-----------|---------------|\n")
        for comp_name in sorted(components.keys()):
            f.write(f"| {comp_name} | {len(components[comp_name]['classes'])} |\n")
    
    print(f"📄 Summary saved to: {summary_file}")
    
    # Print key findings
    print("\n🔑 Key Findings:")
    for comp_name in priority_components[:5]:
        if comp_name in components:
            comp = components[comp_name]
            print(f"\n{comp_name}:")
            for cls in comp['classes'][:5]:
                print(f"  - {cls}")

if __name__ == "__main__":
    main()
