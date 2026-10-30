# UniPath

UniPath is a browser-based academic and career pathway planner for university
students. It brings academic records, GPA calculations, degree-goal projections,
and career-oriented coursework insights together in one application.

The app is a React single-page application built with TypeScript and Vite. Its
academic data is stored in the browser's `localStorage`; the current project
does not include a database, account system, or server API.

## Features

- **Academic dashboard** — Review GPA, honors standing, semester progress,
  target progress, and relevant career-aligned subjects.
- **GPA calculator** — Organize semesters and subjects, edit course details,
  choose a grading scale, and calculate credit-weighted GPA.
- **Target planner** — Set a CGPA goal, completed and remaining credits, and
  explore the future average needed to reach the goal. Use scenario simulation
  to compare possible outcomes.
- **Career planner** — Choose a predefined career role and see coursework
  ranked by its match with that role's required and recommended skills. Add
  electives or enroll them in a semester.
- **Academic history** — Review semester-by-semester results, GPA trends, and
  grade distribution; export a transcript as CSV.
- **Settings and data management** — Customize grading scales, honors
  thresholds, and preferences; export or restore a JSON backup; reset demo data
  or clear saved data.
- **Quick entry and navigation** — Use shared navigation, quick-add subject
  entry, notifications, and a demo-data notice throughout the application.

Career recommendations use a deterministic, rule-based matcher over local
career and skill catalogs. They are explainable and do not call an AI model.

## Application routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` and `/landing` | Landing page | Introduces UniPath and includes a sample GPA demonstration. |
| `/dashboard` | Dashboard | Summarizes academic progress, honors, target status, and career alignment. |
| `/calculator` | GPA calculator | Manages semesters and subjects and calculates GPA. |
| `/target-planner` | Target planner | Projects the GPA needed to reach a target and compares scenarios. |
| `/career-planner` | Career planner | Ranks coursework against a selected career role and manages electives. |
| `/history` | Academic history | Displays academic history and provides CSV transcript export. |
| `/settings` | Settings | Manages grading preferences, data backup, demo reset, and data clearing. |

Unknown routes redirect to `/dashboard`. The application pages share a common
layout; the landing page is public.

## Getting started

### Prerequisites

- Node.js
- npm

### Install and run

```bash
npm install
npm run dev
```

Vite starts the development server on port `3000` and binds to
`0.0.0.0` (so it can be reached from other devices on the network). Open the
URL printed in the terminal, typically `http://localhost:3000`.

No API key or `.env.local` file is required for the current application source.
The `.env.example` file documents `GEMINI_API_KEY` and `APP_URL` for the
AI Studio template, but the app does not currently read these variables or
integrate with Gemini.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port 3000. |
| `npm run lint` | Runs the TypeScript compiler with `noEmit` for type checking. |
| `npm run build` | Creates the production bundle in `dist/`. |
| `npm run preview` | Serves the production build locally for review. |
| `npm run clean` | Removes `dist/` and `server.js`; its current `rm -rf` command is Unix-oriented and may not work in a default Windows shell. |

There is no dedicated test script or test directory in the current project.

## How data and calculations work

### Academic records and persistence

`AcademicProvider` loads initial state through the storage utilities, makes
shared academic state available through `useAcademicData`, derives GPA and
semester metrics, and saves state changes to browser storage. The versioned
`unipath_*_v1` storage keys cover semesters, subjects, grading scales,
preferences, and available electives.

Data is local to the browser profile and is not synchronized to a server or
between devices. Clearing the browser's site data can remove it. UniPath's
Settings page provides a JSON backup and restore flow, as well as demo-data
reset and data-clearing actions.

### GPA

GPA is calculated as a credit-weighted average:

```text
GPA = sum(grade points × eligible subject credits)
      / sum(eligible subject credits)
```

Subjects excluded from GPA, subjects with invalid or non-positive credits, and
grades absent from the active grading scale do not contribute. Displayed GPA
values are rounded to two decimal places. Semester metrics are accumulated in
the order provided by the application.

### Target planning

Target planning derives the required future average from current points,
completed credits, remaining credits, and the target CGPA. Results indicate
whether the target is already reached, realistic, challenging, or impossible
under the selected grading scale's maximum GPA.

### Career matching

Career matching normalizes subject skills and compares them with the selected
role's required and recommended skills. Required and recommended matches have
different weights; core subjects can receive an additional score. Results are
ranked and include matched skills and a human-readable explanation. Career
roles, skill lists, and sample electives are bundled locally rather than
retrieved from a remote service.

## Project structure

```text
unipath/
├── public/                 # Static assets copied to the build output
├── src/
│   ├── components/         # Shared UI and feature-specific components
│   │   ├── calculator/     # Semester accordion and subject row
│   │   ├── career/         # Elective entry and relevance details
│   │   ├── charts/         # GPA trend and grade distribution charts
│   │   ├── common/         # Navigation, modals, cards, and shared UI
│   │   └── planner/        # Target projection and scenario simulator
│   ├── data/               # Demo data, grading scales, and career catalogs
│   ├── hooks/              # Shared academic state provider and hook
│   ├── layouts/            # Shared application layout
│   ├── pages/              # Route-level page compositions
│   ├── types/              # Shared TypeScript data contracts
│   └── utils/              # GPA, career matching, storage, and CSV logic
├── index.html              # HTML shell and React mount point
├── package.json            # Scripts and dependencies
├── PLAN.md                 # Detailed architecture and project structure notes
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite, React, Tailwind, and alias configuration
```

### Main source modules

- `src/App.tsx` defines the routes and wraps the app in `AcademicProvider`.
- `src/main.tsx` mounts the React application and imports global styles.
- `src/hooks/useAcademicData.tsx` owns shared academic state, derived metrics,
  mutations, and toast notifications. Pages should use this state rather than
  creating duplicate stores for shared records.
- `src/types/academic.ts` defines the application's academic, grading,
  planning, and career data contracts.
- `src/data/` contains demo academic records, default grading scales and honors
  thresholds, career roles, and the sample elective catalog.
- `src/utils/gpaCalculator.ts` implements grade lookup, GPA and semester
  calculations, target feasibility, and honors classification.
- `src/utils/careerMatcher.ts` implements local skill matching and relevance
  ranking.
- `src/utils/storage.ts` reads and writes versioned browser storage and
  implements initial data, clearing, and demo reset operations.
- `src/utils/csvExport.ts` builds and downloads CSV transcripts containing
  academic year, semester, course, grade, credits, and GPA contribution.

For a more detailed architecture and source-file inventory, see
[PLAN.md](./PLAN.md).

## Technology

- React 19 and TypeScript
- Vite with the React plugin
- Tailwind CSS
- React Router
- Recharts for data visualizations
- Lucide React icons
- Motion animations

Express and the Google GenAI SDK are listed as dependencies, and the environment
template includes AI Studio variables. However, the current source has no
Express server entry point and does not import or call the Gemini SDK. These
dependencies and variables do not represent active server or AI functionality.

## Development notes

- Keep business rules in `src/utils/`.
- Keep shared persisted academic state in the provider and storage flow.
- Put reusable interface elements in `src/components/`.
- Keep route-level composition in `src/pages/`.
- `dist/` is generated by the production build; `node_modules/` contains
  installed packages. Neither is application source.
