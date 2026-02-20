#!/usr/bin/env python3
"""
Quick search utility for Appian component classes
Usage: python3 search-component-classes.py <search_term>
"""

import json
import sys

def search_components(search_term):
    """Search for components by name or class"""
    with open('/Users/ramaswamy.u/repo/sail-a11y/test-interfaces/appian-component-classes.json', 'r') as f:
        data = json.load(f)
    
    search_lower = search_term.lower()
    results = []
    
    # Search by component name
    for comp_name, comp_data in data.items():
        if search_lower in comp_name.lower():
            results.append({
                'type': 'component_name',
                'component': comp_name,
                'classes': comp_data.get('classes', [])
            })
    
    # Search by class name
    for comp_name, comp_data in data.items():
        matching_classes = [c for c in comp_data.get('classes', []) if search_lower in c.lower()]
        if matching_classes:
            results.append({
                'type': 'class_name',
                'component': comp_name,
                'matching_classes': matching_classes,
                'all_classes': comp_data.get('classes', [])
            })
    
    return results

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 search-component-classes.py <search_term>")
        print("\nExamples:")
        print("  python3 search-component-classes.py icon")
        print("  python3 search-component-classes.py field_label")
        print("  python3 search-component-classes.py Chart")
        sys.exit(1)
    
    search_term = sys.argv[1]
    results = search_components(search_term)
    
    if not results:
        print(f"❌ No results found for '{search_term}'")
        return
    
    print(f"🔍 Search results for '{search_term}':\n")
    
    # Group by type
    name_matches = [r for r in results if r['type'] == 'component_name']
    class_matches = [r for r in results if r['type'] == 'class_name']
    
    if name_matches:
        print(f"📦 Component Name Matches ({len(name_matches)}):\n")
        for match in name_matches[:10]:  # Show first 10
            print(f"  {match['component']}")
            if match['classes']:
                print(f"    Classes: {', '.join(match['classes'][:5])}")
                if len(match['classes']) > 5:
                    print(f"    ... and {len(match['classes']) - 5} more")
            print()
        if len(name_matches) > 10:
            print(f"  ... and {len(name_matches) - 10} more\n")
    
    if class_matches:
        print(f"🎨 Class Name Matches ({len(class_matches)}):\n")
        for match in class_matches[:10]:  # Show first 10
            print(f"  {match['component']}")
            print(f"    Matching: {', '.join(match['matching_classes'])}")
            print()
        if len(class_matches) > 10:
            print(f"  ... and {len(class_matches) - 10} more\n")

if __name__ == "__main__":
    main()
