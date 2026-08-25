---
name: Logic Lab Light
colors:
  surface: '#f7f9fe'
  surface-dim: '#d8dadf'
  surface-bright: '#f7f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f9'
  surface-container: '#eceef3'
  surface-container-high: '#e6e8ed'
  surface-container-highest: '#e0e2e7'
  on-surface: '#181c20'
  on-surface-variant: '#3f484c'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eff1f6'
  outline: '#6f787d'
  outline-variant: '#bfc8cd'
  surface-tint: '#00677f'
  primary: '#004d60'
  on-primary: '#ffffff'
  primary-container: '#00677f'
  on-primary-container: '#98e3ff'
  inverse-primary: '#86d1ec'
  secondary: '#545e75'
  on-secondary: '#ffffff'
  secondary-container: '#d8e2fe'
  on-secondary-container: '#5a647c'
  tertiary: '#3c465b'
  on-tertiary: '#ffffff'
  tertiary-container: '#545e74'
  on-tertiary-container: '#ced8f2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b6eaff'
  primary-fixed-dim: '#86d1ec'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#d8e2fe'
  secondary-fixed-dim: '#bcc6e1'
  on-secondary-fixed: '#111b2f'
  on-secondary-fixed-variant: '#3d475d'
  tertiary-fixed: '#d8e2fd'
  tertiary-fixed-dim: '#bcc6e0'
  on-tertiary-fixed: '#111b2e'
  on-tertiary-fixed-variant: '#3d475c'
  background: '#f7f9fe'
  on-background: '#181c20'
  surface-variant: '#e0e2e7'
  accent-cyan: '#00D1FF'
  surface-lab: '#FFFFFF'
  surface-code: '#F1F4F9'
  deep-slate: '#1A2438'
  terminal-text: '#252F43'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  panel-width-side: 360px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is a high-precision, technical environment designed for developers and logicians. It balances a clinical "Lab" aesthetic with modern usability, targeting power users who require low-friction interfaces for complex cognitive tasks. The personality is efficient and intellectual, yet approachable through a light-filled, airy environment.

The visual style is a hybrid of **Minimalism** and **Technical Brutalism**. It leverages the generous whitespace and clarity of minimalism while maintaining the structural rigor and "under-the-hood" feel of professional engineering tools. Vibrant cyan accents serve as the "active state" of logic circuits against a backdrop of pristine whites and technical slates.

## Colors

The color palette is anchored by a "Lab Light" scheme, utilizing cool-tinted neutrals to provide a sterile yet comfortable workspace. 

- **Primary & Accent:** While the functional primary is a deep teal for accessibility, the **Accent Cyan** is the signature brand color, used for interactive logic paths and primary success states.
- **Surface Strategy:** This design system employs a tiered surface approach. Pure white (`surface-lab`) is reserved for elevated workspace cards and nodes. A slightly darker cool grey (`surface-code`) is used for recessed areas like terminal windows, property panels, and code editors.
- **Contrast:** High-contrast slates are used for text and structural borders to ensure technical legibility.

## Typography

The typography system is built for extreme clarity and technical utility. **Inter** is the workhorse font, utilized for all display, headline, and body levels due to its exceptional legibility in UI contexts. 

**JetBrains Mono** is the critical "technical" anchor. It must be used for all data values, status labels, logic markers, and code snippets. Tight line heights and negative tracking on larger headlines maintain a dense, professional "dashboard" feel without sacrificing readability. Use `headline-lg-mobile` to ensure accessibility on smaller viewports.

## Layout & Spacing

The layout utilizes a robust **fixed grid** philosophy for desktop environments, ensuring that complex logic diagrams and editors remain within a controlled field of view.

- **Desktop:** 12-column grid with 16px gutters and 32px page margins.
- **Mobile:** 4-column grid with 16px gutters and 16px page margins.
- **Side Panels:** Standardized at 360px width to accommodate property inspectors and navigation trees.

The spacing rhythm is strictly derived from a 4px base unit. Use `stack` tokens for vertical layout consistency: `stack-sm` for related elements within a component, `stack-md` for component-to-component spacing, and `stack-lg` for section-level separation.

## Elevation & Depth

Hierarchy in this design system is achieved through **low-contrast outlines** and **tonal layering** rather than heavy shadows, preserving the "airy" lab feel while maintaining structural clarity.

1.  **Base Layer:** The background uses the cool Neutral tint.
2.  **Recessed Layer:** Code editors and terminal panels use `surface-code` to create a "well" effect.
3.  **Raised Layer:** Primary cards and logic nodes use `surface-lab` (pure white) with a 1px solid border in `outline-variant`.
4.  **Floating Layer:** Modals and tooltips use a 1px border and a very subtle, diffused ambient shadow (low opacity) to suggest elevation without breaking the minimal aesthetic.

Interactive elements should use a 1px `accent-cyan` border on focus or hover states to provide immediate technical feedback.

## Shapes

The shape language is **Rounded** (Level 2), providing a balanced precision that feels engineered yet modern. 

The `default` (8px) radius is the standard for most UI components including buttons, input fields, and small cards. Use `sm` (4px) for internal nested elements to maintain nested corner harmony. Larger containers, such as the main editor canvas or dashboard sections, should utilize `lg` (16px) or `xl` (24px) to create distinct visual containment.

## Components

- **Buttons:** Primary buttons use `accent-cyan` background with `deep-slate` text for maximum contrast. Secondary buttons are outlined. Use `label-mono` for button text to reinforce the technical nature of the tool.
- **Input Fields:** Use a white background with a 1px `outline-variant` border. On focus, the border transitions to `accent-cyan`.
- **Logic Nodes (Cards):** These are the core of the experience. They use `surface-lab` with `default` rounding. Active nodes are indicated by an `accent-cyan` left-border stripe.
- **Chips & Tags:** Small status indicators should always use `label-mono`. Use high-chroma backgrounds at 10-15% opacity with high-contrast text for status coloring (e.g., success, error).
- **Lists:** Technical data lists should use alternating row highlights (Zebra striping) using `surface-code` for better horizontal scanning.
- **Monospace Editor:** The editor background must be `surface-code` to differentiate it from the UI shell, utilizing a syntax theme that highlights keywords in `accent-cyan`.