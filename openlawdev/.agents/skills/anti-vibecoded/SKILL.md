---
name: anti-vibecoded
description: Enforces deep architectural logic, domain-specific naming, rigorous error handling, and traceability. Prevents shallow, "vibecoded" AI-generated code patterns.
---

# Anti-Vibecoded Guidelines

When writing code, avoid "vibecoded" patterns—code that is syntactically correct and visually organized, but architecturally shallow. 
Your code must reflect a coherent mental model, showing deep understanding of the product domain rather than being a superficial prompt-shaped illusion.

## What it looks like (AVOID THESE)

A heavily vibecoded codebase often has these traits:
- **Big feature surface, thin internals.** Many pages, buttons, and endpoints exist, but real business logic is tiny or missing.
- **Copy-paste architecture.** Repeated components with almost identical code, but no shared abstraction where one would normally exist.
- **Over-generic naming.** Variables like `data`, `item`, `handleSubmit`, `Container`, `MainSection`, `TempComponent`, with little domain meaning.
- **Token integration.** Libraries are imported, but not deeply understood, so they are used in the most obvious way and left half-finished.
- **No failure handling.** Happy path works, but errors, retries, loading states, empty states, permissions, and validation are weak or absent.
- **Documentation mismatch.** README claims features the code does not actually implement, or the code has behavior no documentation explains.
- **Suspicious consistency gaps.** One file is polished while adjacent files are awkward, duplicated, or broken, suggesting iterative AI acceptance without full human refactor.

## Code smells that suggest AI help (AVOID THESE)

- Repeated long functions that do one thing badly instead of clean modules.
- Unused imports, dead variables, and many "almost used" utilities.
- Very fast adoption of many packages without a clear reason.
- "Framework-shaped" code that follows conventions but lacks product-specific logic.
- Comments that restate code instead of explaining decisions.
- Strange edge-case bugs that reveal no one tested real user flows.
- UI state and backend state drifting apart because the code was assembled feature-by-feature from prompts.

## Example Anti-Patterns

### 1. Generic SaaS page
Do not create pages where every section is generic, there is no domain logic, and all the actual data is hard-coded placeholders.

### 2. Fake backend logic
Do not ignore validation, proper error handling, or return success on failure just to make a demo work.

### 3. Prompt-shaped UI state
Do not rely on the simplest plausible form of state without typed errors, retry behavior, field-level feedback, and clear state transitions.

### 4. Documentation mismatch
Do not write marketing text claiming features that don't exist instead of writing true technical documentation.

## What human code usually shows (DO THIS INSTEAD)

Your code should have clear **decision traces**:
- **Domain-specific naming** tied to actual workflows.
- **Comments explaining *why*** a design choice exists, rather than just restating the code.
- **Error handling** that matches the business rules.
- **Refactoring** toward shared utilities where repetition appears.
- **Tests** that cover weird edge cases, not just the happy path.

## UX and product signals (AVOID THESE)

- **Happy-path-only flows:** ignoring loading states, empty states, errors, slow networks, duplicates, permissions, cancellations, and unusual inputs.
- **Mocked functionality:** buttons show toasts, submit forms without saving, charts use static numbers, search is cosmetic.
- **Incoherent interactions:** buttons that look clickable are not; cards behave differently; labels promise one action while the code performs another.
- **Weak information architecture:** pages do not answer basic user questions.
- **Accessibility gaps:** missing visible keyboard focus, inaccessible modals, poor color contrast, unlabeled form inputs.
- **No operational trust layer:** placeholder addresses, generic support contact, copied testimonials.

## Code and technical signals (AVOID THESE)

- **Generated boilerplate everywhere:** many giant components, duplicated sections, inconsistent naming, unused imports, dead dependencies, and repeated logic instead of reusable primitives.
- **Shallow integration:** environment variables exposed or missing, fake API endpoints, hard-coded tokens, client-side "authentication," no server-side validation, and database schemas that do not match real UI requirements.
- **Dependency dumping:** installing many overlapping UI libraries, animation packages, icon sets, and AI SDKs without clear purpose.
- **Prompt-shaped features:** UI labels, data models, and functions that feel plausible individually but do not align.
- **Security oversights:** open admin routes, public storage buckets, exposed service keys, insecure CORS, missing rate limits, or unrestricted API calls.
