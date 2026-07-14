# FinOS --- DesignSystem.md

## Design Philosophy

FinOS should feel like a premium Apple application: - Calm - Minimal -
Elegant - Fast - Information-first

Never overload the interface.

------------------------------------------------------------------------

# Visual Principles

-   Large whitespace
-   Clear hierarchy
-   Rounded corners
-   Soft shadows
-   Subtle glassmorphism
-   Smooth animations
-   Accessibility first

------------------------------------------------------------------------

# Theme

Support:

-   ☀️ Light
-   🌙 Dark
-   💻 System

Persist preference.

------------------------------------------------------------------------

# Colors

## Primary

Blue `#2563EB`

## Success

Green `#16A34A`

## Warning

Amber `#F59E0B`

## Danger

Red `#DC2626`

## Info

Sky `#0EA5E9`

## Background (Light)

`#F8FAFC`

## Background (Dark)

`#09090B`

## Card

Light: `#FFFFFF`

Dark: `#18181B`

------------------------------------------------------------------------

# Typography

Primary: SF Pro Display

Fallback: Inter

Code: JetBrains Mono

Sizes

Display 48

H1 36

H2 30

H3 24

Body 16

Small 14

Caption 12

Line Height 1.5

------------------------------------------------------------------------

# Spacing

Base unit

8px

Spacing scale

4

8

16

24

32

48

64

96

------------------------------------------------------------------------

# Border Radius

Small 8px

Medium 16px

Large 24px

Cards 28px

Floating Panels 32px

------------------------------------------------------------------------

# Shadows

Soft only.

Never use harsh shadows.

Use subtle elevation.

------------------------------------------------------------------------

# Glassmorphism

Opacity: 75--90%

Blur: 16--24px

Very subtle borders.

------------------------------------------------------------------------

# Layout

Desktop

Sidebar 280px

Content Fluid

Header 72px

Mobile

Bottom Navigation

Floating Action Button

Safe Area support.

------------------------------------------------------------------------

# Components

## Cards

Contain:

Title

Value

Delta

Icon

Optional Chart

Hover animation

------------------------------------------------------------------------

## KPI Cards

Examples

Income

Expenses

Cash Flow

Debt

Risk

Savings

Goals

Health Score

------------------------------------------------------------------------

## Buttons

Variants

Primary

Secondary

Ghost

Danger

Icon

Loading

Disabled

------------------------------------------------------------------------

## Inputs

Rounded

Large touch targets

Validation

Helper text

------------------------------------------------------------------------

## Tables

Sticky header

Sortable

Searchable

Pagination

Row hover

Responsive

------------------------------------------------------------------------

## Charts

Chart.js

Types

Line

Bar

Pie

Doughnut

Area

Animations

300ms

Responsive

------------------------------------------------------------------------

# Icons

Lucide Icons

Consistent 20--24px.

------------------------------------------------------------------------

# Animations

Framer Motion

Duration

150ms

250ms

350ms

Use:

Fade

Slide

Scale

Avoid excessive motion.

------------------------------------------------------------------------

# Dashboard

Widgets

Financial Health

Cash Flow

Liquidity

Budget

Debt

Goals

Timeline

Alerts

Upcoming Bills

Prediction

------------------------------------------------------------------------

# Status Colors

Healthy

Green

Attention

Amber

Critical

Red

Neutral

Gray

------------------------------------------------------------------------

# Financial Score

0--100

0--39

Critical

40--69

Attention

70--89

Good

90--100

Excellent

------------------------------------------------------------------------

# Empty States

Every page must have

Illustration

Short explanation

Primary action

------------------------------------------------------------------------

# Loading

Skeleton screens

No spinners unless necessary.

------------------------------------------------------------------------

# Notifications

Toast

Success

Warning

Error

Info

Bottom-right desktop

Top mobile

------------------------------------------------------------------------

# Accessibility

WCAG AA

Keyboard navigation

Focus ring

Screen readers

Contrast \>= 4.5

------------------------------------------------------------------------

# Responsive Breakpoints

Mobile

\<640px

Tablet

640--1024px

Desktop

1024--1440px

Wide

1440px+

------------------------------------------------------------------------

# UX Rules

One primary action per screen.

Maximum three hierarchy levels.

Never require more than three taps to add a transaction.

Important information must always be visible without scrolling on
desktop.

Financial data should update instantly after edits.

Animations must never block interaction.
