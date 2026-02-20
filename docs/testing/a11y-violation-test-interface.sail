/*
 * ACCESSIBILITY VIOLATION TEST INTERFACE
 * =======================================
 * This interface is INTENTIONALLY designed to violate EVERY item in the
 * squad-level accessibility checklist. It is used solely for testing
 * accessibility scanning/checking tools.
 *
 * DO NOT use this as a reference for building real interfaces.
 *
 * Each section is annotated with the checklist item(s) it violates.
 */

a!localVariables(
  local!name: "",
  local!email: "",
  local!phone: "",
  local!priority: "",
  local!agree: {},
  local!color: "",
  local!notes: "",
  local!files: {},
  local!signature: "",
  local!selectedRows: {},
  local!selectedCard: 1,
  local!showExtra: false,
  local!currentPage: 1,
  local!dateTimeVal: now(),
  local!items: {
    a!map(id: 1, name: "Item A", status: "Active", amount: 100),
    a!map(id: 2, name: "Item B", status: "Inactive", amount: 200),
    a!map(id: 3, name: "Item C", status: "Active", amount: 300)
  },

  a!formLayout(
    label: "",
    /* VIOLATION: Forms - No required fields legend */
    /* VIOLATION: Forms - focusOnFirstInput not set to FALSE (important info before inputs) */
    contents: {

      /* ============================================================
       * SECTION 1: HEADINGS VIOLATIONS
       * Violates: Headings - not semantic, wrong heading levels
       * ============================================================ */

      /* VIOLATION: Headings - Text heading NOT defined as semantic heading */
      a!richTextDisplayField(
        value: a!richTextItem(
          text: "Application Form",
          size: "LARGE",
          style: "STRONG"
        )
      ),

      /* VIOLATION: Headings - Skipped heading level (no H2, jumps to H4) */
      a!headingField(
        text: "Personal Information",
        size: "EXTRA_SMALL" /* H4 level, skipping H2 and H3 */
      ),

      /* ============================================================
       * SECTION 2: FORM INPUT VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Form Inputs - Input has NO label */
      a!textField(
        value: local!name,
        saveInto: local!name,
        placeholder: "Enter your full name"
        /* No label parameter at all */
      ),

      /* VIOLATION: Form Inputs - Placeholder used as only info source */
      /* VIOLATION: Form Inputs - No persistently visible label (COLLAPSED with no visual label) */
      /* VIOLATION: Form Inputs - label does not match visible label */
      a!textField(
        label: "Email Address Input Field",
        labelPosition: "COLLAPSED",
        value: local!email,
        saveInto: local!email,
        placeholder: "email@example.com (must be a valid corporate email)"
        /* Placeholder conveys important format info */
        /* Label is COLLAPSED so no visible label */
        /* The visible "label" is just the placeholder which doesn't match */
      ),

      /* VIOLATION: Form Inputs - Personal info field missing inputPurpose */
      a!textField(
        label: "Phone Number",
        value: local!phone,
        saveInto: local!phone
        /* No inputPurpose parameter for personal info */
      ),

      /* VIOLATION: Form Inputs - Duplicated controls with same name, no context */
      a!textField(
        label: "Notes",
        value: local!notes,
        saveInto: local!notes
      ),
      a!textField(
        label: "Notes",
        value: local!notes,
        saveInto: local!notes
        /* Same label "Notes" with no accessibilityText or section context */
      ),


      /* ============================================================
       * SECTION 3: CHECKBOX & RADIO BUTTON VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Form Inputs - Checkbox choiceLabels using null/empty */
      /* VIOLATION: Form Inputs - Multiple checkboxes with NO group label */
      a!checkboxField(
        /* No label for the group - violates group label requirement */
        choiceLabels: {"", ""},
        choiceValues: {"opt1", "opt2"},
        value: local!agree,
        saveInto: local!agree
        /* Empty choiceLabels violates individual label requirement */
      ),

      /* VIOLATION: Form Inputs - Radio buttons with no group label */
      a!radioButtonField(
        /* No label parameter - violates group label requirement */
        choiceLabels: {"High", "Medium", "Low"},
        choiceValues: {"high", "medium", "low"},
        value: local!priority,
        saveInto: local!priority
      ),

      /* ============================================================
       * SECTION 4: VALIDATION VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Validations - Required field without required parameter */
      /* VIOLATION: Validations - Not using OOTB validation */
      /* VIOLATION: Validations - Error message missing input name */
      a!textField(
        label: "Required Field",
        value: local!name,
        saveInto: local!name
        /* required: true is NOT set */
        /* No validations parameter - not using OOTB validation */
      ),

      /* VIOLATION: Validations - Error message does not include input name */
      a!integerField(
        label: "Quantity",
        value: 0,
        saveInto: {},
        required: true,
        validations: if(
          true,
          "This value is invalid.", /* Missing input name "Quantity" */
          null
        )
      ),

      /* ============================================================
       * SECTION 5: INSTRUCTIONS VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Instructions - Visible instructions NOT using instructions parameter */
      a!richTextDisplayField(
        value: a!richTextItem(
          text: "Enter a value between 1 and 100",
          size: "SMALL",
          color: "SECONDARY"
        )
      ),
      a!integerField(
        label: "Score",
        value: 0,
        saveInto: {}
        /* Instructions shown as separate rich text above, not via instructions parameter */
      ),

      /* ============================================================
       * SECTION 6: DATE & TIME COMPONENT VIOLATION
       * ============================================================ */

      /* VIOLATION: Date & Time Component - a!dateTimeField MUST NOT be used */
      a!dateTimeField(
        label: "Appointment",
        value: local!dateTimeVal,
        saveInto: local!dateTimeVal
      ),

      /* ============================================================
       * SECTION 7: LISTS VIOLATION
       * ============================================================ */

      /* VIOLATION: Lists - Visual list not using semantic list markup */
      a!richTextDisplayField(
        value: {
          a!richTextItem(text: "• First item", style: "PLAIN"),
          char(10),
          a!richTextItem(text: "• Second item", style: "PLAIN"),
          char(10),
          a!richTextItem(text: "• Third item", style: "PLAIN")
        }
        /* Using bullet characters instead of a!richTextBulletedList */
      ),


      /* ============================================================
       * SECTION 8: GRID VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Grids - Grid has NO label */
      /* VIOLATION: Grids - Missing column header text */
      /* VIOLATION: Grids - No rowHeader defined */
      /* VIOLATION: Grids - Empty column used for spacing */
      /* VIOLATION: Grids - Instructions not using grid instructions parameter */
      /* VIOLATION: Grids - No accessibility text for controls above grid */
      /* VIOLATION: Grids - Row ordering links too small / no spacing */
      /* VIOLATION: Grids - No single-click alternative for drag and drop */
      a!richTextDisplayField(
        value: a!richTextItem(
          text: "Review the grid below and select rows to enable actions.",
          size: "SMALL"
        )
        /* Instructions shown as rich text, not via grid instructions parameter */
      ),

      /* Buttons above grid that become enabled on selection - no a11y warning */
      a!buttonArrayLayout(
        buttons: {
          a!buttonWidget(
            label: "Approve",
            disabled: length(local!selectedRows) = 0
            /* No accessibilityText on grid about these buttons */
          ),
          a!buttonWidget(
            label: "Reject",
            disabled: length(local!selectedRows) = 0
          )
        }
      ),

      a!gridField(
        /* No label parameter - violates grid label requirement */
        data: local!items,
        columns: {
          a!gridColumn(
            label: "Name",
            value: fv!row.name
          ),
          a!gridColumn(
            /* No label - violates column header requirement */
            value: fv!row.status
          ),
          a!gridColumn(
            label: "Amount",
            value: fv!row.amount
          ),
          a!gridColumn(
            /* Empty column for spacing - violates empty column rule */
            label: "",
            value: ""
          ),
          a!gridColumn(
            label: "Actions",
            value: {
              /* VIOLATION: Row ordering links too small, no spacing */
              a!richTextDisplayField(
                value: {
                  a!richTextIcon(
                    icon: "arrow-up",
                    altText: "Up",
                    link: a!dynamicLink(saveInto: {}),
                    size: "SMALL"
                  ),
                  a!richTextIcon(
                    icon: "arrow-down",
                    altText: "Down",
                    link: a!dynamicLink(saveInto: {}),
                    size: "SMALL"
                  )
                  /* No spacing between links - violates 24x24 target size */
                }
              )
            }
          )
        },
        /* No rowHeader parameter - violates row header requirement */
        selectable: true,
        selectionSaveInto: local!selectedRows
        /* No accessibilityText about buttons above grid */
      ),

      /* ============================================================
       * SECTION 9: SECTION & BOX LAYOUT VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Section Layout - Expandable section with no label or heading tag */
      a!sectionLayout(
        /* No label parameter */
        /* No labelHeadingTag parameter */
        isCollapsible: true,
        contents: {
          a!richTextDisplayField(
            value: "This expandable section has no label or heading tag."
          )
        }
      ),

      /* VIOLATION: Box Layout - Expandable box with no label or heading tag */
      a!boxLayout(
        /* No label parameter */
        /* No labelHeadingTag parameter */
        contents: {
          a!richTextDisplayField(
            value: "This expandable box has no label or heading tag."
          )
        }
      ),

      /* ============================================================
       * SECTION 10: PANE LAYOUT VIOLATION
       * ============================================================ */

      /* VIOLATION: Pane Layout - No accessibilityText on pane */
      /* VIOLATION: Pane Layout - Using forbidden terms */
      a!columnsLayout(
        columns: {
          a!columnLayout(
            contents: {
              a!richTextDisplayField(value: "Left pane content")
            }
          ),
          a!columnLayout(
            contents: {
              a!richTextDisplayField(value: "Right pane content")
            }
          )
        }
        /* Simulating pane without accessibilityText */
      ),


      /* ============================================================
       * SECTION 11: CARD VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Cards - Card with link AND other controls inside */
      /* VIOLATION: Cards - Card link has a label parameter value */
      /* VIOLATION: Cards - Selected card uses color only, no "Selected" accessibilityText */
      a!cardLayout(
        link: a!dynamicLink(
          label: "Go to details", /* VIOLATION: label on card link */
          saveInto: {}
        ),
        style: if(local!selectedCard = 1, "ACCENT", "STANDARD"),
        /* VIOLATION: No accessibilityText: "Selected" when card is selected */
        contents: {
          a!richTextDisplayField(
            value: "Card with link"
          ),
          /* VIOLATION: Other controls inside a linked card */
          a!buttonWidget(
            label: "Action",
            saveInto: {}
          )
        }
      ),

      /* Second card - not selected but has accessibilityText "Selected" anyway */
      a!cardLayout(
        style: "STANDARD",
        accessibilityText: "Selected", /* VIOLATION: Not selected but marked as Selected */
        contents: {
          a!richTextDisplayField(
            value: "Unselected card incorrectly marked"
          )
        }
      ),

      /* ============================================================
       * SECTION 12: CARD CHOICE FIELD & CARD GROUP LAYOUT VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Card Choice Field - No label when multiple cards present */
      a!cardChoiceField(
        /* No label parameter */
        data: {
          a!map(id: 1, label: "Option A"),
          a!map(id: 2, label: "Option B")
        },
        cardTemplate: a!cardTemplateTile(
          id: fv!item.id,
          primaryText: fv!item.label
        ),
        value: local!selectedCard,
        saveInto: local!selectedCard
      ),

      /* ============================================================
       * SECTION 13: LINK VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Links - Link in text uses only color to differentiate */
      a!richTextDisplayField(
        value: {
          a!richTextItem(text: "Please review the "),
          a!richTextItem(
            text: "policy document",
            link: a!safeLink(uri: "https://example.com"),
            color: "ACCENT"
            /* No linkStyle: "INLINE" - only color differentiates the link */
          ),
          a!richTextItem(text: " before proceeding.")
        }
      ),

      /* VIOLATION: Links - Selected link uses accessibilityText instead of icon altText */
      a!richTextDisplayField(
        accessibilityText: "Selected", /* Should use icon altText instead */
        value: {
          a!richTextIcon(
            icon: "home",
            /* No altText: "Selected" on the icon */
            link: a!dynamicLink(saveInto: {}),
            color: "ACCENT"
          ),
          a!richTextItem(
            text: " Home",
            link: a!dynamicLink(saveInto: {}),
            color: "ACCENT"
          )
        }
      ),

      /* VIOLATION: Link Focus - No visible focus indication (inherent in some configs) */

      /* ============================================================
       * SECTION 14: BREADCRUMBS VIOLATION
       * ============================================================ */

      /* VIOLATION: Breadcrumbs - No accessibilityText identifying breadcrumb or current page */
      a!richTextDisplayField(
        /* No accessibilityText for breadcrumb identification */
        value: {
          a!richTextItem(
            text: "Home",
            link: a!dynamicLink(saveInto: {})
          ),
          a!richTextItem(text: " > "),
          a!richTextItem(
            text: "Products",
            link: a!dynamicLink(saveInto: {})
          ),
          a!richTextItem(text: " > "),
          a!richTextItem(text: "Details")
          /* No indication that "Details" is the current page */
        }
      ),

      /* ============================================================
       * SECTION 15: PROGRESS BAR VIOLATION
       * ============================================================ */

      /* VIOLATION: Progress Bar - No label on progress bar */
      a!progressBarField(
        /* No label parameter */
        percentage: 65
      ),


      /* ============================================================
       * SECTION 16: FILE UPLOAD VIOLATIONS
       * ============================================================ */

      /* VIOLATION: File Upload - No label on file upload */
      /* VIOLATION: File Upload - No instructions on file upload */
      a!fileUploadField(
        /* No label parameter */
        /* No instructions parameter */
        target: cons!FOLDER_ID,
        value: local!files,
        saveInto: local!files
      ),

      /* ============================================================
       * SECTION 17: SIGNATURE VIOLATION
       * ============================================================ */

      /* VIOLATION: Signature - No alternative keyboard method provided */
      a!signatureField(
        label: "Signature",
        value: local!signature,
        saveInto: local!signature
        /* No alternative checkbox or other keyboard-accessible method */
      ),

      /* ============================================================
       * SECTION 18: SIMULATED GRID VIOLATION
       * ============================================================ */

      /* VIOLATION: Simulated Grid - No accessibilityText on cells */
      a!columnsLayout(
        columns: {
          a!columnLayout(
            contents: {
              a!richTextDisplayField(
                value: a!richTextItem(text: "Name", style: "STRONG")
              ),
              a!richTextDisplayField(
                value: "John"
                /* No accessibilityText with column header context */
              )
            }
          ),
          a!columnLayout(
            contents: {
              a!richTextDisplayField(
                value: a!richTextItem(text: "Status", style: "STRONG")
              ),
              a!richTextDisplayField(
                value: "Active"
                /* No accessibilityText with column header context */
              )
            }
          )
        }
      ),

      /* ============================================================
       * SECTION 19: CUSTOM PAGINATION VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Custom Pagination - Disabled links have accessibilityText */
      /* VIOLATION: Custom Pagination - Active links too small / no spacing */
      a!richTextDisplayField(
        value: {
          /* Disabled/non-applicable link WITH accessibilityText - violation */
          a!richTextIcon(
            icon: "angle-left",
            altText: "Previous page disabled",
            color: "SECONDARY"
            /* Should have NO altText when non-applicable */
          ),
          /* Active pagination links too close together */
          a!richTextIcon(
            icon: "angle-left",
            altText: "Previous",
            link: a!dynamicLink(saveInto: {}),
            size: "SMALL"
          ),
          a!richTextItem(
            text: " 1 ",
            link: a!dynamicLink(saveInto: {})
          ),
          a!richTextItem(
            text: " 2 ",
            link: a!dynamicLink(saveInto: {})
          ),
          a!richTextIcon(
            icon: "angle-right",
            altText: "Next",
            link: a!dynamicLink(saveInto: {}),
            size: "SMALL"
          )
          /* Links are too close - violates 24x24 target size */
        }
      ),

      /* ============================================================
       * SECTION 20: ICON VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Icon - Standalone icon in link with NO altText */
      a!richTextDisplayField(
        value: a!richTextIcon(
          icon: "pencil",
          /* No altText or caption */
          link: a!dynamicLink(saveInto: {})
        )
      ),

      /* VIOLATION: Icon - Icon with text in link, icon conveys extra info but no altText */
      a!richTextDisplayField(
        value: {
          a!richTextIcon(
            icon: "exclamation-triangle",
            color: "NEGATIVE"
            /* Icon conveys "warning" but no altText provided */
          ),
          a!richTextItem(
            text: "Review Required",
            link: a!dynamicLink(saveInto: {})
          )
        }
      ),

      /* VIOLATION: Icon - Standalone icon button with no accessibilityText or tooltip */
      a!buttonWidget(
        icon: "trash",
        /* No label, no accessibilityText, no tooltip */
        saveInto: {}
      ),

      /* VIOLATION: Icon - Icon with text in button, icon adds info but no accessibilityText */
      a!buttonWidget(
        label: "Submit",
        icon: "paper-plane",
        /* Icon conveys "send" but no accessibilityText */
        saveInto: {}
      ),

      /* VIOLATION: Icon - Standalone informational icon with no altText */
      a!richTextDisplayField(
        value: a!richTextIcon(
          icon: "check-circle",
          color: "POSITIVE"
          /* Conveys "success" information but no altText */
          /* This is NOT decorative - it conveys status */
        )
      ),

      /* VIOLATION: Icon - Decorative icon WITH altText (should have none) */
      a!richTextDisplayField(
        value: {
          a!richTextIcon(
            icon: "user",
            altText: "Person icon" /* Should be null - icon is decorative/redundant */
          ),
          a!richTextItem(text: " John Smith")
        }
      ),


      /* ============================================================
       * SECTION 21: CHART VIOLATION
       * ============================================================ */

      /* VIOLATION: Charts - No label on chart */
      a!pieChartField(
        /* No label parameter */
        data: local!items,
        config: a!pieChartConfig(
          primaryGrouping: a!grouping(field: "status"),
          measures: {a!measure(field: "amount", function: "SUM")}
        )
      ),

      /* ============================================================
       * SECTION 22: COLOR CONTRAST VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Color Contrast - Text - Low contrast regular text */
      a!richTextDisplayField(
        value: a!richTextItem(
          text: "This light gray text on white background has poor contrast.",
          color: "#CCCCCC"
          /* Light gray on white = ~1.6:1 ratio, fails 4.5:1 */
        )
      ),

      /* VIOLATION: Color Contrast - Text - Low contrast large text */
      a!richTextDisplayField(
        value: a!richTextItem(
          text: "Large text with poor contrast",
          size: "LARGE",
          style: "STRONG",
          color: "#999999"
          /* Gray on white for large text = ~2.8:1, fails 3:1 */
        )
      ),

      /* VIOLATION: Color Contrast - Selected State - Poor contrast between selected/unselected */
      a!columnsLayout(
        columns: {
          a!columnLayout(
            contents: {
              a!cardLayout(
                style: "#E8E8E8", /* Selected - very light gray */
                contents: {
                  a!richTextDisplayField(value: "Selected Tab")
                }
              )
            }
          ),
          a!columnLayout(
            contents: {
              a!cardLayout(
                style: "#F0F0F0", /* Unselected - slightly different light gray */
                /* Contrast between #E8E8E8 and #F0F0F0 is far below 3:1 */
                contents: {
                  a!richTextDisplayField(value: "Unselected Tab")
                }
              )
            }
          )
        }
      ),

      /* ============================================================
       * SECTION 23: COLOR USE VIOLATION
       * ============================================================ */

      /* VIOLATION: Color Use - Color is the ONLY means of conveying info */
      a!richTextDisplayField(
        value: {
          a!richTextItem(text: "Click the "),
          a!richTextItem(text: "green button", color: "POSITIVE"),
          a!richTextItem(text: " to approve or the "),
          a!richTextItem(text: "red button", color: "NEGATIVE"),
          a!richTextItem(text: " to reject.")
          /* Color is the only differentiator referenced */
        }
      ),

      /* ============================================================
       * SECTION 24: IMAGE OF TEXT VIOLATION
       * ============================================================ */

      /* VIOLATION: Image of Text - Using image that contains text */
      a!imageField(
        images: {
          a!webImage(
            source: "https://example.com/banner-with-text.png"
            /* Image contains embedded text - should use real text */
          )
        }
      ),

      /* ============================================================
       * SECTION 25: MODAL DIALOG VIOLATION
       * (Simulated - would need a!showDialog in real implementation)
       * ============================================================ */

      /* VIOLATION: Modal Dialog - Focus moved to input when important info precedes it */
      /* This would be triggered by a dialog with focusOnFirstInput not set to FALSE */

      /* ============================================================
       * SECTION 26: TOOLTIP & STAMP VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Tooltip - Tooltip not accessible via keyboard */
      /* (Inherent in some custom implementations) */

      /* VIOLATION: Stamp - Important info conveyed via tooltip/helpTooltip */
      a!stampField(
        icon: "star",
        text: "Rating",
        tooltip: "This item has been rated 4.5 out of 5 stars by reviewers",
        /* Important info in tooltip that can't be accessed by keyboard/screen reader */
        helpTooltip: "Click to see detailed ratings breakdown"
        /* helpTooltip also conveys important info - violation */
      ),


      /* ============================================================
       * SECTION 27: DYNAMICALLY-ADDED CONTENT VIOLATION
       * ============================================================ */

      /* VIOLATION: Dynamically-Added Content - Content added BEFORE the trigger */
      /* VIOLATION: Dynamically-Added Content - No messageBanner announcement */
      a!richTextDisplayField(
        showWhen: local!showExtra,
        value: "This content was dynamically added ABOVE the button that triggered it."
        /* Content appears before the trigger in tab order */
        /* No a!messageBanner to announce where content was added */
      ),
      a!buttonWidget(
        label: "Show More Info",
        value: true,
        saveInto: local!showExtra
        /* Dynamically added content appears ABOVE this button - violation */
      ),

      /* ============================================================
       * SECTION 28: DYNAMIC STATUS MESSAGES VIOLATION
       * ============================================================ */

      /* VIOLATION: Dynamic Status Messages - Not using a!messageBanner */
      /* Status message shown as plain rich text instead of messageBanner */
      a!richTextDisplayField(
        showWhen: local!showExtra,
        value: a!richTextItem(
          text: "Operation completed successfully!",
          color: "POSITIVE"
        )
        /* Should use a!messageBanner with announceBehavior parameter */
      ),

      /* ============================================================
       * SECTION 29: MAGNIFICATION VIOLATIONS
       * (These are layout/design issues that manifest at zoom levels)
       * ============================================================ */

      /* VIOLATION: Magnification 200% - Content overlaps at 200% zoom */
      /* VIOLATION: Magnification 400% - Requires horizontal scrolling at 400% */
      a!columnsLayout(
        columns: {
          a!columnLayout(
            width: "NARROW",
            contents: {
              a!richTextDisplayField(
                value: "This column layout with fixed widths may cause overlap at 200% and require horizontal scrolling at 400% zoom.",
                preventWrapping: true
                /* preventWrapping forces horizontal overflow */
              )
            }
          ),
          a!columnLayout(
            width: "NARROW",
            contents: {
              a!richTextDisplayField(
                value: "Second fixed-width column that compounds the issue.",
                preventWrapping: true
              )
            }
          )
        }
      ),

      /* ============================================================
       * SECTION 30: WORKFLOW VISUALIZATION PLUGIN VIOLATION
       * ============================================================ */

      /* VIOLATION: Workflow Visualization - No alternative view provided */
      /* (Would use a!workflowVisualizationField in real implementation) */
      a!richTextDisplayField(
        value: a!richTextItem(
          text: "[Workflow Visualization Plugin would be here with no alternative view]",
          color: "SECONDARY",
          style: "EMPHASIS"
        )
      ),

      /* ============================================================
       * SECTION 31: FORMS - ADDITIONAL VIOLATIONS
       * ============================================================ */

      /* VIOLATION: Forms - User must re-enter previously provided info */
      a!richTextDisplayField(
        value: a!richTextItem(
          text: "Please re-enter your name and email from the previous step:",
          color: "SECONDARY"
        )
      ),
      a!textField(
        label: "Name (again)",
        value: "",
        saveInto: {}
        /* User must re-enter info from earlier - should be auto-populated */
      ),

      /* ============================================================
       * FINAL: FORM BUTTONS
       * ============================================================ */
      a!buttonLayout(
        primaryButtons: {
          a!buttonWidget(
            label: "Submit",
            submit: true,
            style: "SOLID"
          )
        },
        secondaryButtons: {
          a!buttonWidget(
            label: "Cancel",
            style: "OUTLINE"
          )
        }
      )
    }
  )
)
