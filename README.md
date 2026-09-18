# PawLog

PawLog is a pet-care tracking application for recording recurring care routines and the events that occur each day. It helps a pet parent keep meals, walks, medication, and other care activities in one chronological view.

The application separates a pet's recurring care schedule from its date-specific care events:

- A **care schedule** describes an expected recurring activity and time.
- A **daily care event** is the event record for a particular date. It can originate from a schedule or be recorded manually.

## Current features

- Pet profile editing for pet name, breed, weight, age, and pet parent.
- Recurring care schedules with event type, description, time, and notes.
- Automatic creation of today's daily events from the saved care schedule when no events exist for today.
- Manual recording and editing of daily care events.
- Conflict resolution for repeatedly changed daily care events, with choices to keep the current record, replace it, or retain both records.
- Care-event statuses including confirmed, partial, scheduled, in review, missed, unknown, and conflicted.
- Time-certainty values including exact, approximate, date only, and unknown.
- A Today dashboard with recorded, scheduled, and in-review counts.
- A Timeline view with a calendar that filters stored daily events by date.
- Responsive Material UI layouts and reusable loading overlays.

## Architecture

```text
React + Material UI
        ↓
Next.js App Router pages and components
        ↓
Route handlers in src/app/api
        ↓
Controllers in src/server/controller
        ↓
Services in src/server/services
        ↓
Mongoose models in src/server/model
        ↓
MongoDB
```

Client components handle presentation, form state, and API calls. Route handlers delegate to controllers, and services own database operations and daily-event generation.

## Data model

The app uses MongoDB through Mongoose. The core collections are:

| Collection | Purpose |
| --- | --- |
| `petProfile` | Stores the current pet profile. |
| `petCareSchedule` | Stores recurring care schedule entries linked to the pet by `petId`. |
| `petCareEventsSchedule` | Stores date-specific care events linked to the pet by `petId`; schedule-generated events also store `petCareScheduleId`. |

### Daily event fields

A `petCareEventsSchedule` document stores:

```js
{
  petId,
  petCareScheduleId, // present only when generated from a care schedule
  date,
  eventType,
  description,
  eventTime,
  timeCertainty,
  status,
  quantityDetails,
  notes,
  changeCount
}
```

New daily events start with `changeCount: 0`. Updating an existing daily event increments that internal counter. It is not rendered in the UI.

For schedule-derived events, the combination of `petId`, `date`, and `petCareScheduleId` is unique, preventing the same schedule entry from being generated twice for the same day. This is a partial unique index: it applies only to records with a `petCareScheduleId`, so multiple manually recorded events can exist for the same pet and date.

### Conflict resolution

When an existing daily event with `changeCount > 1` is edited from Today's timeline, PawLog shows a conflict-resolution modal after the normal edit form is submitted. The modal compares the current record (Record A) with the submitted changes (Record B):

- **Keep Record A:** discard the submitted changes; no API update is made.
- **Use Record B:** update the existing event with the submitted values.
- **Keep both records:** create a new manual daily event from the submitted values while retaining the original event.

## Daily-event generation

When today's events are requested, PawLog checks whether the pet already has daily events for today.

1. If events already exist, PawLog returns them.
2. If none exist, PawLog copies the pet's recurring schedule into daily events for today.
3. Generated events are marked `in_review` if their scheduled time has passed; otherwise they are marked `scheduled`.

Editing a care schedule updates its linked event for today. Editing a daily care event updates only that date-specific record.

## API routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/profile` | Fetch the current pet profile. |
| `PUT` | `/api/profile` | Update the pet profile. |
| `GET` | `/api/care-schedule` | Fetch recurring care schedules. |
| `PUT` | `/api/care-schedule` | Create or update a recurring schedule entry. |
| `DELETE` | `/api/care-schedule?id=<id>` | Delete a recurring schedule entry. |
| `GET` | `/api/care-events` | Fetch and, if needed, generate today's care events. |
| `PUT` | `/api/care-events` | Create or update a daily care event. |
| `DELETE` | `/api/care-events?id=<id>` | Delete a daily care event. |
| `GET` | `/api/care-events/by-date?date=YYYY-MM-DD` | Fetch daily care events for a selected date. |
| `GET` | `/api/care-events/status-counts` | Fetch today's recorded, scheduled, and in-review counts. |

## Tech stack

- Next.js 16 and React 19
- JavaScript
- Material UI and MUI X Date Pickers
- Day.js
- MongoDB and Mongoose
- ESLint

## Local setup

Clone the repository:

```bash
git clone https://github.com/procheta1999/pawlog-app.git
cd pawlog-app
```

Install dependencies:

```bash
npm install
```

Create a `.env` file with your MongoDB connection details:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
DB_NAME=pawlog
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Start the production server
npm run lint   # Run ESLint
```

## Current scope

PawLog currently focuses on a single pet profile and its end-to-end daily-care workflow. Authentication, multi-pet support, multiple caregivers, notifications, attachments, reconciliation history, and automated tests are not yet implemented.

## Possible next steps

- Multiple pets and caregivers
- Reminders and notifications
- Better historical reporting and analytics
- Event deletion controls in every applicable view
- Veterinary records and document uploads
- Conflict reconciliation history
- Automated unit and integration tests
