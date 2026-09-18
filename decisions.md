# PawLog decisions

## Brief

### The problem

PawLog helps a pet parent turn a recurring care routine—meals, walks, medication, and similar activities—into a clear day-by-day record. It is designed for someone who needs to know both what was expected to happen and what was actually recorded, without maintaining a separate spreadsheet or notes system.

### The hard part

The difficult part is separating a recurring plan from its daily outcome. A fixed schedule cannot capture a late meal, an uncertain walk, or a correction to an earlier entry; however, treating every event as unrelated loses the routine the pet parent planned. A simple single-table approach would either overwrite history or create duplicate daily schedule entries.

### The slice

The shipped path is: create a pet profile, define recurring care, load today's generated events, record or edit an event, and review it in a date-filtered timeline. The important edge case handled is a repeatedly changed event: after more than one prior edit, the user can keep the existing record, replace it, or retain both records rather than silently losing information.

### Why this instead of a fixed prompt

This slice demonstrates product and data-model judgment rather than just producing a static form: a recurring schedule produces daily records, those records can diverge, and the UI makes that divergence explicit. It shows how the application handles a real ambiguous outcome instead of assuming every edit is a straightforward overwrite.

## Decisions

### 1. Keep recurring schedules separate from daily care events

**Decision**

Use `petCareSchedule` for recurring expectations and `petCareEventsSchedule` for date-specific records. Daily records store `petId`, and schedule-generated records additionally store `petCareScheduleId`.

**Alternatives considered**

- Store only schedules and mutate them whenever care is recorded.
- Store all recurring and daily data in one collection with a type field.
- Generate events only in the browser.

**Reasoning**

A schedule answers “what should happen”; a daily event answers “what happened on this date.” Keeping them separate preserves history when a daily event is edited and lets the timeline show past dates accurately. Server-side generation keeps the result consistent for every client and avoids trusting browser time or local state.

**What was deliberately cut**

Schedules currently create events only for the current day when needed. There is no ahead-of-time job to materialize weeks of events, because that would add scheduling infrastructure before the daily workflow needs it.

### 2. Generate today's scheduled events idempotently

**Decision**

When today's events are requested, create schedule-derived events only when none exist for the pet on that date. Use an upsert-based creation path so concurrent page/API requests do not create duplicates.

**Alternatives considered**

- Generate events on every page load without a database check.
- Run a nightly cron job only.
- Require the user to create each daily event manually.

**Reasoning**

The first page load should be enough to make today's plan usable. Idempotent creation supports multiple API calls during a Next.js render without duplicate schedule events, while avoiding the operational complexity of a cron service for this build.

**What was deliberately cut**

There is no retry queue or background job monitoring. A later GET can safely retry generation because the operation is idempotent.

### 3. Make uniqueness apply only to schedule-derived events

**Decision**

Use a partial unique MongoDB index named `uniqueScheduledEventPerDay` on `{ petId, date, petCareScheduleId }`, restricted to records whose `petCareScheduleId` is an ObjectId.

**Alternatives considered**

- A compound unique index for every event, including manual events with a null schedule ID.
- A sparse compound index.
- No database uniqueness constraint.

**Reasoning**

One schedule should produce at most one generated event per pet per date. Manual events intentionally do not have a schedule ID, and users must be able to retain multiple manual records after a conflict. A general unique index treated repeated `null` schedule IDs as duplicates and broke the “keep both” action. The partial index protects the scheduled-event invariant without constraining manual records.

**What was deliberately cut**

There is no uniqueness rule for manual events because two independently recorded events can legitimately share a type, time, and date. The app leaves duplicate-looking manual entries visible for the user to resolve rather than guessing which is wrong.

### 4. Count edits internally and ask before overwriting repeatedly changed events

**Decision**

Daily events start with `changeCount: 0`; each update increments it. When editing an existing Timeline event whose count is greater than one, show a conflict-resolution modal after the normal form is submitted.

**Alternatives considered**

- Always overwrite on submit.
- Show a conflict dialog for every edit.
- Implement full multi-user optimistic locking and version history.

**Reasoning**

Always overwriting is quick but can erase a meaningful earlier observation. Prompting on every edit would make normal corrections unnecessarily heavy. `changeCount > 1` is a simple, explainable threshold that flags repeated changes without adding a full audit/versioning system to the initial product.

**What was deliberately cut**

`changeCount` is a signal, not a complete audit trail. The app does not yet record who changed a value, why it changed, or each intermediate version.

### 5. Offer three explicit conflict outcomes

**Decision**

The conflict modal compares Record A (the stored event) and Record B (the submitted values), then offers:

- Keep Record A: make no API call and retain the stored event.
- Use Record B: update the stored event.
- Keep both records: create a new manual event and retain Record A.

**Alternatives considered**

- Automatically replace the old record.
- Automatically create a duplicate for every conflict.
- Ask the user to manually re-enter one record after cancelling.

**Reasoning**

The meaningful choice belongs to the pet parent: a later detail may be a correction, a separate observation, or noise. Naming both records and showing their values makes the consequence visible before writing to the database.

**What was deliberately cut**

There is no merge-field-by-field interface or persisted conflict relationship yet. Those features are useful only once the app has caregivers, change attribution, and longer-term audit needs.

### 6. Reuse form, modal, picker, loader, radio, menu, and timeline building blocks

**Decision**

Build shared dashboard components and use the same form schema for profile, schedule, and care-event forms. Extend the shared `Modal` to render either a form or custom children; extend the shared `RadioGroup` to render structured option labels for conflict choices.

**Alternatives considered**

- Duplicate a bespoke modal and radio implementation for conflicts.
- Use one oversized generic component that owns all dashboard state.
- Keep all styling in inline MUI `sx` props.

**Reasoning**

The shared primitives keep interaction and accessibility behavior consistent while allowing each card to own its domain data. CSS modules hold reusable layout styling, and MUI retains responsibility for accessible controls and responsive primitives.

**What was deliberately cut**

Not every layout is abstracted. Small one-off presentation pieces remain local so the component library does not become harder to understand than the screens it serves.

### 7. Use a date-filtered Timeline instead of loading all history into Today

**Decision**

The Today dashboard loads the current daily workflow. A separate Timeline page uses a static calendar and `/api/care-events/by-date` to fetch records for the selected date.

**Alternatives considered**

- Load all history with today's dashboard request.
- Filter only client-side after fetching all events.
- Treat the calendar as visual-only.

**Reasoning**

Historical records can grow indefinitely, while the Today screen needs to be fast and focused. Server-side filtering makes the selected date the explicit query boundary and keeps the calendar useful rather than decorative.

**What was deliberately cut**

There is no date-range view, search, export, or analytics aggregation yet. The first useful historical question is simply “what happened on this date?”

### 8. Prioritize a usable single-pet flow over identity and collaboration

**Decision**

The current product operates on one pet profile and resolves its pet ID server-side for schedule and event operations.

**Alternatives considered**

- Build authentication, pet switching, roles, and caregiver collaboration first.
- Pass a pet ID from every client request.

**Reasoning**

The core scheduling, daily-event, and conflict workflows can be validated without introducing account management and authorization complexity. Resolving the current profile on the server also prevents the client from selecting an arbitrary pet ID in this scoped application.

**What was deliberately cut**

Multi-pet support, authentication, caregiver permissions, and concurrent collaboration are intentionally out of scope. They are prerequisites for a production multi-user conflict model, not requirements for validating this end-to-end slice.

## Validation and remaining work

ESLint is run with `npm run lint` after implementation changes. Automated unit and integration tests have not yet been added; this is a known gap rather than claimed coverage. The highest-value next tests would cover idempotent schedule generation, the partial-index/manual-event behavior, and all three conflict-resolution outcomes.
