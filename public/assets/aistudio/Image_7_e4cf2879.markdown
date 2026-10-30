---
name: Academic Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006e2d'
  on-secondary: '#ffffff'
  secondary-container: '#7cf994'
  on-secondary-container: '#007230'
  tertiary: '#703a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#934e00'
  on-tertiary-container: '#ffd2b1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#7ffc97'
  secondary-fixed-dim: '#62df7d'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-gpa:
    fontFamily: Inter
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: 3.75rem
    letterSpacing: -0.03em
  display-gpa-mobile:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: '800'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
  metric-mono:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '700'
    lineHeight: 1.5rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style
The design system establishes a focused, high-clarity academic environment tailored for university students, educators, and academic advisors. Built around modern SaaS efficiency and data integrity, it communicates academic rigor, zero distraction, and absolute reliability.

The visual tone balances institutional trust with modern software tactility. It avoids frivolous decorations, prioritizing crisp information density, clear tabular layouts, and instant calculation feedback. Every element reinforces local-first privacy, numerical precision, and empowering academic progress tracking.

## Colors
The system employs a purposeful academic palette anchored by deep indigo and clean slate neutrals:

- **Primary (`#4F46E5` / Hover `#4338CA`):** Signals active calculation states, primary actions, progress meters, and primary focal points.
- **Success (`#16A34A`):** Used for target achievement badges, First Class honors standing, passing grades, and valid local-storage status.
- **Warning / Target (`#D97706`):** Identifies stretch GPA goals, borderline credit boundaries, and critical semester requirements.
- **Error / Danger (`#DC2626`):** Denotes prerequisite shortfalls, below-threshold GPAs, and course deletion actions.
- **Surface & Neutral Architecture:**
  - Canvas Background: `#F8FAFC` (Slate 50)
  - Card & Container Surface: `#FFFFFF`
  - Main Body & Metric Text: `#0F172A` (Slate 900)
  - Secondary & Metadata Text: `#64748B` (Slate 500)
  - Structural Borders & Grid Dividers: `#E2E8F0` (Slate 200)

## Typography
Typographic rhythm relies on `Inter` across all structural tiers, prioritizing uniform tabular figures and high legibility at dense scales.

- **Numeric GPA Displays:** All numeric scores and GPA outputs use `font-feature-settings: "tnum" 1` (tabular figures) to ensure calculation animations and table comparisons remain perfectly aligned without jitter.
- **Hierarchy:** Strict weight contrast (800 for GPA hero values, 600 for card headers, 400 for contextual copy) delivers instant legibility across complex calculation sheets.
- **Labels:** Uppercase styling is strictly reserved for high-level metric category badges (`label-sm`), styled with tracking of `+0.025em`.

## Layout & Spacing
The layout follows a 12-column responsive fluid grid pinned within an outer max-width of `1440px`.

- **Desktop (1024px+):** 12-column layout with 20px (`1.25rem`) gutters and 32px (`2rem`) page margins. GPA projection sidebars occupy 4 columns, while dynamic course tables occupy 8 columns.
- **Tablet (768px – 1023px):** 8-column layout with 16px (`1rem`) gutters. The projection summary stacks above or pins to a secondary drawer.
- **Mobile (< 768px):** Single-column stack with 12px (`0.75rem`) gutters and 16px (`1rem`) screen margins. Tables convert to card-based module rows with swipeable grade selection bars.
- **Spacing Rhythm:** Standard layout uses an 8px base rhythm (`0.5rem` steps), reserving `0.25rem` strictly for micro alignments within grade chips and input badges.

## Elevation & Depth
The system achieves depth primarily through crisp surface borders (`#E2E8F0`) and micro-diffused ambient drop shadows, maintaining an airy, clinical feel.

- **Level 0 (Canvas):** Flat `#F8FAFC`.
- **Level 1 (Cards, Course Tables, Planner Modules):** Solid `#FFFFFF`, bordered with 1px `#E2E8F0`, ambient shadow `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Interactive Flyouts, Quick Grade Selectors, Tooltips):** `#FFFFFF`, bordered with 1px `#CBD5E1`, shadow `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals, Target Setting Dialogs):** `#FFFFFF`, shadow `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.

## Shapes
Surfaces adopt a modern, friendly structure using standard `rounded-xl` (12px to 16px) geometries for primary dashboard cards and module containers:

- **Cards & Data Panels:** 14px to 16px (`rounded-xl`), balancing structured form factors with modern softness.
- **Buttons & Input Controls:** 8px to 10px (`rounded-lg`) for compact, disciplined touch targets.
- **Calculation Badges, Chips & Privacy Indicators:** Fully rounded pill shapes (`9999px`) to distinguish categorical metadata and status pills from structural containers.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, text `#FFFFFF`, hover `#4338CA`, active `#3730A3`. Height `40px` (desktop), padding `0 16px`. Font: `label-md`. Focus ring: 2px offset with `#4F46E5`.
- **Secondary / Ghost:** Transparent background, border 1px `#E2E8F0`, text `#0F172A`, hover `#F1F5F9`.
- **Action (Destructive / Remove Course):** Borderless or soft ghost red `#FEF2F2`, text `#DC2626`, hover `#FEE2E2`.

### Inputs & Selectors
- **Credit & Subject Fields:** Background `#FFFFFF`, border 1px `#E2E8F0`, text `#0F172A`, placeholder `#94A3B8`. Height `40px`, corner radius `8px`. Active focus transitions to border `#4F46E5` with `0 0 0 1px #4F46E5`.
- **Grade Selectors:** Segmented control or dropdown menu with instant color feedback based on grade weight (e.g., A/A+ with subtle success tint, C-/D with warning tint).

### Data Tables
- Header row with uppercase `label-sm` in `#64748B`, bottom border 1px `#E2E8F0`, row height `48px`.
- Alternating hover row states using `#F8FAFC`.
- Interactive cells for instant grade adjustments that trigger live recalculations without page reload.

### Chips & Preview Badges
- **Target Predictor Chip:** Pill-shaped, subtle tint background (`#FEF3C7` for targets, `#DCFCE7` for achieved, `#EEF2FF` for standard projections). Border 1px with corresponding accent shade. Text in `label-sm`.
- **Local-Storage Privacy Badge:** Fixed or navigation pill. Background `#F1F5F9`, border 1px `#E2E8F0`, icon lock in `#64748B`, text: "Stored locally in browser • 100% Private".

### Cards & GPA Metric Displays
- **GPA Counter Card:** Prominent `#FFFFFF` surface with a top accent rule (2px `#4F46E5`). Displays overall GPA via `display-gpa`, accompanied by class honors standing (e.g., "First Class Honours Target") and dynamic delta comparison ("+0.12 this semester").