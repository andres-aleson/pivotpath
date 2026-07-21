---
name: Professional Pivot
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#001815'
  on-tertiary: '#ffffff'
  tertiary-container: '#002f2a'
  on-tertiary-container: '#28a094'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered to support users through the high-stakes journey of career transition. The brand personality is **Authoritative yet Empathetic**, positioning the platform as a reliable mentor rather than a cold utility. 

The visual style follows a **Modern Corporate** aesthetic, blending high-utility systematic layouts with warm, human-centric touches. By utilizing a "White Space First" philosophy, the UI minimizes cognitive load, ensuring that complex information—such as skills gap analyses and roadmaps—feels manageable and structured. The emotional response should be one of "Calculated Optimism": the user feels the platform is technically capable of guiding them while remaining supportive of their personal growth.

## Colors
The palette is anchored by **Slate Navy (#1E293B)** to establish immediate trust and professional gravity. **Investment Blue (#3B82F6)** serves as the primary action color, signaling momentum and digital competence.

To balance the corporate tones, **Teal (#0D9488)** and **Amber (#F59E0B)** are used as "Encouragement Accents." Teal is reserved for "Success" states and progress completion, while Amber is used sparingly for high-value call-to-actions that require a warm, human touch, such as "Book a Mentor" or "View Career Match." Neutral tones stay within the Slate family to maintain a cool, clean environment that resists visual fatigue.

## Typography
The design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic feel. The type hierarchy is strictly enforced to create a clear "Information Ladder." 

Headings use tighter letter spacing and semi-bold/bold weights to project confidence. Body text utilizes a generous 1.5x line height to ensure long-form career advice and job descriptions are highly readable. Label styles are used for metadata, status chips, and small captions, often employing a medium weight to maintain legibility at smaller scales.

## Layout & Spacing
This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The spacing rhythm is built on an 8px baseline power-of-two scale.

Layouts should prioritize "Breathing Room." Section vertical spacing should default to `lg` (48px) to clearly demarcate different phases of the career journey. Card layouts within the grid should use `md` (24px) gutters to maintain a clean, organized appearance. On mobile, margins are reduced to 16px to maximize content real estate while maintaining the 8px rhythm for internal component padding.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Ambient Shadows**. This design system avoids heavy blacks in shadows, opting instead for shadows tinted with the primary navy color at very low opacities (4-8%).

- **Level 0 (Flat):** The main background (`#FFFFFF`) or subtle sections (`#F8FAFC`).
- **Level 1 (Raised):** Used for cards and secondary navigation. Features a soft 1px border (`#E2E8F0`) and a subtle 4px blur shadow.
- **Level 2 (Overlay):** Used for dropdowns and active modal states. Features a more pronounced 12px blur shadow to indicate focus and separation from the workflow.

This approach creates a "Physical Paper" feel, where elements appear neatly organized on a desk.

## Shapes
The shape language is defined as **Rounded**, utilizing a standard 8px (0.5rem) radius for most UI components. This specific radius is chosen to strike a balance between the sharpness of traditional enterprise software and the approachable softness of modern consumer apps.

- **Standard (8px):** Primary buttons, input fields, and small cards.
- **Large (16px):** Success story cards and featured dashboard containers.
- **Full (Pill):** Progress bar containers and status badges.

## Components

### Buttons
Primary buttons use the `primary_color_hex` (Navy) with white text for maximum authority. Secondary buttons use a "ghost" style with the `secondary_color_hex` (Blue) border and text. The "Pivotal" action button (e.g., "Start Transition") uses the Amber accent to stand out from the systematic blues.

### Progress Bars
Roadmap progress bars feature a thick 8px track in a light slate blue, with a `tertiary_color_hex` (Teal) fill to signify growth and health. Step indicators on the roadmap use a pill-shape with white icons.

### Success Cards
Cards used for success stories should include a subtle background tint or a thin 1px border. They should utilize `rounded-lg` (16px) corners to feel more "inviting" than standard functional cards.

### Input Fields
Forms should be clean and spacious. Labels sit above the input in `label-md` style. Active states are indicated by a 2px `secondary_color_hex` border and a very soft blue outer glow. Error states must use a high-contrast red that remains legible against the white background.

### Chips & Badges
Used for skill tags (e.g., "SQL", "Project Management"). These use a light blue background with dark blue text, utilizing a 4px (Soft) corner radius to differentiate them from the more rounded action buttons.