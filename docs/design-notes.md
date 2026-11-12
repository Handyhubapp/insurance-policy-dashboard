# Design Notes — Meridian Insurance Dashboard

UX approach, design decisions, tokens, and information architecture for the Insurance Policy Management Dashboard.

## Primary User Goals

The portal was designed around the three questions a policyholder most often brings to an insurer's website:

1. **Check what is due** — Is a premium due or overdue, how much is it, and when must it be paid?
2. **Confirm coverage** — What policies do I hold, what do they cover, and when do they renew?
3. **Follow a claim** — Where is my claim, what stage is it at, and what happens next?

Every layout and navigation decision was tested against those goals. Routine information should be answerable from the Dashboard or within one click, without the user needing to call the insurer for a status update.

## Design Decisions

### Status colour language, with text labels

Payments and claims rely on a consistent status language across the whole portal: green for Paid / Settled / Complete, amber for Due / In Review / Pending, and red for Overdue / Action Required. The same colour means the same thing on the Dashboard, in tables, and on detail pages.

Colour is never the only signal. Every status is also shown as a text label on a badge, so the meaning holds for users with colour-vision differences, in grayscale printing, and at a glance in a long table.

### Scannable tables for amounts and dates

Premiums, coverage amounts, and dates are presented in tables with right-aligned numeric columns, consistent date formatting, and clear row separation. Policyholders compare figures across policies and payments, so alignment and consistency matter more than decoration. Tables use a predictable column order — item, status, date, amount, action — repeated wherever a table appears.

### Due and overdue surfaced on the Dashboard first

The Dashboard leads with what needs attention, not with general information. The next premium due, any overdue payment, and open claim count appear in summary cards at the top, with a direct link to the relevant page. A user who only opens the Dashboard should still leave knowing whether anything needs action.

### One primary action per page

Each page has a single, visually dominant primary action: Pay Now on Payments, File a Claim on Claims, and so on. Secondary actions use a quieter button style. This keeps the next step obvious, particularly on mobile, and avoids competing calls to action on screens that contain sensitive financial information.

### Forms with inline validation and plain-language errors

The File a Claim and Pay Now flows validate as the user completes each field, rather than only on submission. Errors appear next to the field they belong to, in plain language that states what to fix — for example, "Enter the date the incident happened" rather than "Invalid input." Valid entries are not marked with unnecessary success messaging; the absence of an error is the confirmation.

### Claim progress tracker

Claim Details includes a horizontal progress tracker showing the stages a claim moves through — Filed, In Review, Assessment, Decision, and Settled / Closed — with the current stage highlighted and completed stages marked. Claims are the most anxiety-producing part of insurance, and most of that anxiety comes from not knowing where things stand. Making the stage, and what comes next, visible is intended to reduce "where is my claim" support calls and repeat checking.

## Design Tokens Summary

All tokens are defined as CSS custom properties in `css/styles.css` and applied consistently across pages.

### Colour

| Token | Value | Use |
|---|---|---|
| Primary navy | `#0F4C81` | Primary buttons, links, active states, headings accent |
| Dark navy (sidebar) | `#0B3556` | Sidebar background, footer |
| Teal accent | `#0E7C7B` | Secondary highlights, progress tracker, informational accents |
| Success / Paid | `#1B7A43` | Paid, Settled, Complete status |
| Warning / Due | `#9A6700` | Due, In Review, Pending status |
| Danger / Overdue | `#B42318` | Overdue, Action Required status |
| Text primary | `#1A2B3C` | Body text and headings |
| Text secondary | `#5A6B7C` | Supporting text, table captions, metadata |
| Background | `#F4F6F8` | Page background |
| Surface | `#FFFFFF` | Cards, tables, modals |
| Border | `#D9E1E8` | Card and table borders, dividers |

Status colours are always paired with the badge text label described above.

### Typography

Font: Inter, with a system font stack as fallback.

| Style | Size | Use |
|---|---|---|
| Heading 1 | 28px | Page title |
| Heading 2 | 20px | Section and card headings |
| Heading 3 | 16px | Sub-sections |
| Body | 15–16px | Primary reading text |
| Small | 13–14px | Table metadata, captions, helper text |

Line height is set at 1.5 for body text to support readability at small sizes.

### Spacing, Radius, and Layout

| Token | Value | Use |
|---|---|---|
| Spacing scale | 4px / 8px base — 4, 8, 12, 16, 24, 32, 48 | All padding, margins, and gaps derive from this scale |
| Radius — small | 8px | Buttons, inputs, badges, table containers |
| Radius — large | 12px | Cards, modals |
| Content max width | 1200px | Main content area beside the sidebar |
| Sidebar width | 240px | Desktop navigation |

## Information Architecture

Primary navigation is a persistent left sidebar on desktop, in the order of the primary user goals:

- **Dashboard** — Overview and items needing attention
- **My Policies** — Policy list, leading to Policy Details
- **Payments** — Premium status, history, and Pay Now
- **Claims** — Claim list, leading to Claim Details
- **File a Claim** — New claim form; also reachable as the primary action from Claims

Detail pages (Policy Details, Claim Details) are not in the sidebar. They are reached from their list pages and return to them via a back link, which keeps the navigation short and reflects how users actually move: list, select, review, return.

The account holder's name and a summary identifier appear in the sidebar header area so the user can confirm at a glance that they are viewing the correct account.

## Responsive Strategy

Breakpoints and behaviour were designed mobile-first in content priority, even though the primary layout is desktop-led.

- **Below 900px:** The sidebar collapses to a top bar with a hamburger menu. Navigation opens as an overlay panel and can be closed with the toggle, a link selection, or the Escape key.
- **Card and summary grids:** Multi-column grids (policy summaries, Dashboard stat cards) reduce to two columns on tablet widths and stack to a single column on mobile.
- **Tables:** Wide tables do not compress below readability. Instead, the table container scrolls horizontally on narrow screens, preserving column alignment for amounts and dates.
- **Touch and type:** Tap targets meet a minimum of 44px in height on touch layouts, body text does not shrink below 15px, and primary actions remain visible without scrolling on detail pages where practical.

## Accessibility Notes

The design was built to be WCAG-minded throughout, not retrofitted at the end:

- **Contrast** — Body text, secondary text, and status badges were selected for sufficient contrast against their backgrounds; primary navy and dark navy are used for text-bearing surfaces rather than light accent colours.
- **Focus visible** — All interactive elements have a clear, visible focus outline that is not removed by CSS resets.
- **Labels** — Every form input has an associated label; icon-only controls have accessible names; tables use header cells so amounts and dates are announced in context by screen readers.
- **Modal ARIA** — The Pay Now modal uses dialog semantics with `role="dialog"`, `aria-modal`, and an `aria-labelledby` reference to its heading, can be dismissed with Escape, and manages focus on open and close.
- **Not relying on colour alone** — Status, errors, and progress are conveyed with text labels, position in the tracker, and icons or markers in addition to colour.
- **Structure** — Semantic landmarks, a skip link to main content, and a logical heading order support keyboard and assistive-technology navigation on every page.
