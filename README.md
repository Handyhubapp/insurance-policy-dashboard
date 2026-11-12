# Insurance Policy Management Dashboard — Meridian Insurance

## Overview

A responsive customer portal built for the Aspire Systems / American Equity UI/UX assignment.

**Designed and built by Rahul Bheemanathi** · UI/UX Designer & Front-End Developer

The portal is presented for a fictional insurer, Meridian Insurance, with a single demo account holder, Michael Thompson. It demonstrates how a policyholder can view and manage policies, check premium payment status, and follow claims from a single, consistent interface.

All data is mock data. There is no backend, account system, or live insurer connection. All policies, payments, and claims are defined in `js/data.js` and rendered in the browser.

## Assignment Requirements Covered

| Requirement | Implementation |
|---|---|
| View and manage policies | Policies page (`policies.html`) — searchable, filterable, and sortable policy list. Filter by policy type and status, search by policy number or type, and sort by premium, coverage, or renewal date. Each policy card links to a full details view. |
| Track policy details | Policy Details page (`policy-details.html`) — coverage summary, insured details, premium and renewal information, coverage limits, exclusions, and related documents for a single policy, selected from the Policies list. |
| Monitor premium payment status | Payments page (`payments.html`) — payment history and upcoming premiums grouped by status: Paid, Due, and Overdue. Overdue and due items are highlighted with text labels as well as colour. The Pay Now flow opens a confirmation modal and updates the payment status in the interface on confirmation. |
| Access claim information | Claims page (`claims.html`) — list of claims with status, amount, and date filed. Claim Details page (`claim-details.html`) — full claim summary with a step-by-step progress tracker showing the current stage. File a Claim page (`file-claim.html`) — structured form with inline validation to start a new claim. |
| Responsive design | Layout adapts from desktop to tablet and mobile. The sidebar becomes a top bar with a hamburger menu below 900px, card grids stack to a single column, and wide tables scroll horizontally rather than breaking the layout. See `docs/design-notes.md` for the full strategy. |
| Basic functional interactions in vanilla JavaScript | Search, filter, and sort; dynamic rendering from `js/data.js`; status calculations for due and overdue items; modal open/close; form validation with inline error messages; and mobile navigation — all implemented in vanilla JavaScript with no framework or library dependency. |

## How to Run

No build step, package install, or local server is required.

1. Download or clone the project folder.
2. Open `index.html` in any modern web browser.

All pages, styles, and scripts are static files with relative paths, so the dashboard also works when opened directly from the file system. An internet connection is used only to load the Inter font from Google Fonts; if unavailable, the system font fallback applies automatically.

## Pages

The project contains seven pages:

- **Dashboard** (`index.html`) — Account overview with active policy count, next premium due, open claims, and recent activity. Due and overdue items are surfaced first.
- **My Policies** (`policies.html`) — Complete policy list with search, type and status filters, and sorting.
- **Policy Details** (`policy-details.html`) — Full detail view for a single selected policy.
- **Payments** (`payments.html`) — Premium schedule and payment history with Paid / Due / Overdue status and a Pay Now flow.
- **Claims** (`claims.html`) — List of all claims with status, amount, and progress summary.
- **Claim Details** (`claim-details.html`) — Single claim view with coverage, amounts, timeline, and progress tracker.
- **File a Claim** (`file-claim.html`) — New claim form with inline validation and a confirmation state on submission.

## Tech

- **HTML5** — Semantic markup with landmark regions, headings in logical order, and labelled forms and tables.
- **CSS3** — Custom properties for design tokens, CSS Grid and Flexbox for layout, and media queries for responsive behaviour. No CSS framework.
- **Vanilla JavaScript** — Rendering, filtering, sorting, status logic, modal handling, and form validation. No framework or build tooling.
- **Typography** — Inter from Google Fonts, with a system font stack (`-apple-system`, `Segoe UI`, Roboto, Helvetica, Arial) as fallback.

## Folder Structure

```
insurance-policy-dashboard/
├── index.html              # Dashboard
├── policies.html           # My Policies — list, search, filter, sort
├── policy-details.html     # Policy Details
├── payments.html           # Payments and premium status
├── claims.html             # Claims list
├── claim-details.html      # Claim Details with progress tracker
├── file-claim.html         # File a Claim form
├── css/
│   ├── variables.css       # Design tokens — colours, type, spacing, radius
│   ├── base.css            # Reset and base typography
│   ├── layout.css          # App shell — sidebar, topbar, content area
│   ├── components.css      # Cards, buttons, badges, tables, forms, modal
│   └── pages.css           # Page-specific styles
├── js/
│   ├── data.js             # Mock data — policies, payments, claims
│   ├── app.js              # Shared shell — nav state, sidebar toggle, helpers
│   ├── dashboard.js        # Dashboard page
│   ├── policies.js         # My Policies page
│   ├── policy-details.js   # Policy Details page
│   ├── payments.js         # Payments page
│   ├── claims.js           # Claims page
│   ├── claim-details.js    # Claim Details page
│   └── file-claim.js       # File a Claim page
├── docs/
│   └── design-notes.md     # UX approach, tokens, and IA decisions
└── README.md
```

## Design Approach

The design is built as a small, reusable system rather than a set of one-off pages.

- **Design tokens:** Colours, type sizes, spacing, and border radii are defined once as CSS custom properties and reused across every page, so a single change updates the whole portal consistently.
- **Reusable components:** Cards, status badges, tables, buttons, form fields, the sidebar, and the modal share the same markup patterns and styles on every page.
- **BEM-ish naming:** Class names follow a block–element–modifier pattern (for example, `card`, `card__title`, `card--highlight`) to keep styles predictable and scoped without a preprocessor.

The reasoning behind the key UX decisions — status language, information architecture, responsive strategy, and accessibility — is documented in `docs/design-notes.md`.

## Accessibility Notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a logical heading hierarchy on every page.
- A skip link to the main content as the first focusable element.
- All form controls have associated `<label>` elements; error messages are written in plain language and linked to their field.
- Visible focus states on links, buttons, form fields, and interactive elements for keyboard navigation.
- Status is never conveyed by colour alone — every status badge includes a text label (Paid, Due, Overdue, In Review, and so on).
- Colour combinations for body text, badges, and primary actions were chosen for sufficient contrast against their backgrounds.
- The payment modal can be dismissed with the Escape key and the close button, returns focus appropriately, and is marked up with dialog semantics and ARIA attributes.

## Future Improvements

These are out of scope for this static assignment, but are the natural next steps for a production version:

- **Real API and backend** — Replace the mock data in `js/data.js` with authenticated API calls to a policy administration system.
- **Authentication** — Secure sign-in, session handling, password recovery, and multi-factor authentication.
- **Payment gateway** — Live premium payments through a PCI-compliant provider, with saved payment methods, receipts, and autopay.
- **E-signatures and documents** — In-portal document viewing, download, and e-signature for renewals, endorsements, and claim forms.
- **Notifications** — Email, SMS, and in-portal alerts for premiums due, payment confirmations, renewal reminders, and claim status changes.
- **Further enhancements** — Policy changes and endorsements online, beneficiary management, support messaging, and downloadable tax and proof-of-insurance documents.

---

*Meridian Insurance and Michael Thompson are fictional. This project is a design and front-end demonstration using mock data only.*
