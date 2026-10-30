# UniPath Project Structure and Architecture

## 1. Project overview

UniPath is a browser-based academic and career pathway planning application for university students. It helps students organize semesters and subjects, calculate credit-weighted GPA/CGPA, model a target CGPA, track honors standing, and compare coursework with predefined career skill requirements.

The current application is a React single-page app built with TypeScript and Vite. Academic records and preferences are stored in the browser's `localStorage`; there is no application database or server API in the current source tree. Career matching is deterministic and rule-based rather than AI-generated.

## 2. Repository map

The following tree focuses on project-owned files. Generated build output (`dist/`) and installed packages (`node_modules/`) are intentionally omitted.

```text
unipath/
├── .env.example                  # Example AI Studio environment values
├── .gitignore                    # Excludes dependencies, build output, logs, and env files
├── bun.lock                      # Bun dependency lockfile
├── index.html                    # HTML shell, metadata, fonts, and React mount point
├── metadata.json                 # AI Studio app metadata and declared capabilities
├── package.json                  # Scripts and runtime/development dependencies
├── package-lock.json             # npm dependency lockfile
├── PLAN.md                       # This project structure and architecture guide
├── README.md                     # Basic setup and run instructions
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite, React, Tailwind, and @ alias configuration
├── public/
│   └── assets/
│       └── aistudio/
│           └── Image_7_e4cf2879.markdown
└── src/
    ├── App.tsx                   # Providers and route definitions
    ├── main.tsx                  # React entry point and global stylesheet import
    ├── index.css                 # Global styles and Tailwind entry
    ├── components/
    │   ├── calculator/
    │   │   ├── SemesterAccordion.tsx
    │   │   └── SubjectRow.tsx
    │   ├── career/
    │   │   ├── AddElectiveModal.tsx
    │   │   └── SubjectRelevanceCard.tsx
    │   ├── charts/
    │   │   ├── GpaTrendChart.tsx
    │   │   └── GradeDistributionChart.tsx
    │   ├── common/
    │   │   ├── ConfirmationModal.tsx
    │   │   ├── GpaCounterCard.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── PrivacyBadge.tsx
    │   │   ├── QuickAddSubjectModal.tsx
    │   │   └── Sidebar.tsx
    │   └── planner/
    │       ├── ScenarioSimulator.tsx
    │       └── TargetProjectionCard.tsx
    ├── data/
    │   ├── careerPathways.ts
    │   ├── defaultGradingScales.ts
    │   └── demoAcademicData.ts
    ├── hooks/
    │   └── useAcademicData.tsx
    ├── layouts/
    │   └── AppLayout.tsx
    ├── pages/
    │   ├── AcademicHistoryPage.tsx
    │   ├── CareerPlannerPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── GpaCalculatorPage.tsx
    │   ├── LandingPage.tsx
    │   ├── SettingsPage.tsx
    │   └── TargetPlannerPage.tsx
    ├── types/
    │   └── academic.ts
    └── utils/
        ├── careerMatcher.ts
        ├── csvExport.ts
        ├── gpaCalculator.ts
        └── storage.ts
```

## 3. Application startup and navigation

1. `index.html` provides the `#root` mount node and loads `src/main.tsx`.
2. `src/main.tsx` mounts the React app and imports `src/index.css`.
3. `src/App.tsx` wraps the router with `AcademicProvider`, then defines the public and application routes.
4. `/` and `/landing` show the public landing page. The application pages render within `AppLayout`.
5. Unknown routes redirect to `/dashboard`.

| Route | Page | Purpose |
|---|---|---|
| `/` and `/landing` | `LandingPage` | Product introduction, privacy messaging, and sample GPA demonstration |
| `/dashboard` | `DashboardPage` | Summary metrics, current-term snapshot, target progress, and career alignment |
| `/calculator` | `GpaCalculatorPage` | Semester and subject editing, grading-scale selection, and GPA calculation |
| `/target-planner` | `TargetPlannerPage` | Target CGPA calculation, degree-credit assumptions, and scenario simulation |
| `/career-planner` | `CareerPlannerPage` | Career-role selection and subject/elective relevance ranking |
| `/history` | `AcademicHistoryPage` | Semester transcript, GPA trajectory, and CSV export |
| `/settings` | `SettingsPage` | Grading scales, honors thresholds, preferences, data backup, and reset/clear actions |

`AppLayout` provides the shared navigation bar, sidebar, quick-add subject dialog, demo-data notice, and toast notifications. Pages and reusable components obtain academic state through `useAcademicData`.

## 4. Source directory responsibilities

### `src/pages/`

Each page composes feature components and connects them to shared application state.

- **`LandingPage.tsx`** — Public introduction and a small static GPA example. It links into the main application.
- **`DashboardPage.tsx`** — Overview of GPA, honors, semester status, target progress, and the strongest career-related subject matches.
- **`GpaCalculatorPage.tsx`** — Semester management and subject editing, with an active grading scale and GPA summary.
- **`TargetPlannerPage.tsx`** — Lets the user adjust current GPA, completed/remaining credits, and a target; current records can be synchronized into the inputs.
- **`CareerPlannerPage.tsx`** — Selects one of the catalogued career roles, filters ranked subjects, and supports adding electives or enrolling them in a semester.
- **`AcademicHistoryPage.tsx`** — Displays the chronological academic record and semester metrics, and exports a CSV transcript.
- **`SettingsPage.tsx`** — Changes grading settings and preferences; exports/imports a JSON backup and offers demo reset and data clearing.

### `src/components/`

- **`common/`** — Shared UI and interaction primitives: global navigation/sidebar, modal and confirmation patterns, GPA summary card, quick subject entry, and privacy indicator.
- **`calculator/`** — Semester accordion and individual subject row used by the GPA calculator.
- **`career/`** — Custom elective entry and an explanation card for each subject-to-role match.
- **`charts/`** — GPA trend and grade distribution visualizations, implemented with the charting dependency.
- **`planner/`** — Target projection summary and what-if scenario simulator.

### `src/hooks/useAcademicData.tsx`

Defines the `AcademicProvider` and `useAcademicData` hook. The provider:

- Loads initial state from `utils/storage.ts`.
- Saves changes to browser storage when the state changes.
- Exposes semester, subject, grading-scale, preference, and elective-catalog state.
- Computes overall GPA, total credits/points, honors standing, and semester-by-semester cumulative metrics.
- Exposes mutation methods for records, semesters, scales, preferences, electives, backups, and reset/clear actions.
- Provides a shared toast-notification state for the application layout.

Use this context rather than creating duplicate page-level stores for shared academic records.

### `src/types/academic.ts`

Contains the shared TypeScript data contracts, including `Subject`, `Semester`, `GradingScale`, `GradeItem`, `UserPreferences`, target-planning inputs/results, career roles, and subject relevance matches.

### `src/data/`

- **`demoAcademicData.ts`** — Example semesters, coursework, and starting preferences used when no saved records exist and when demo data is restored.
- **`defaultGradingScales.ts`** — Built-in grade-to-point scale definitions and default honors thresholds.
- **`careerPathways.ts`** — Predefined career roles and their required/recommended skills, plus the sample elective catalog.

These modules are the bundled seed/catalog data; they are not a remote API.

### `src/utils/`

- **`gpaCalculator.ts`** — Grade lookup, credit-weighted GPA and semester calculations, target CGPA feasibility/required-average calculation, and honors classification.
- **`careerMatcher.ts`** — Case-normalizes subject skills against a role's required/recommended skills, computes an explainable relevance score, assigns a category fit, and sorts the results.
- **`storage.ts`** — Reads/writes the application's versioned `localStorage` entries; provides initial fallback data, clear, and demo-reset operations.
- **`csvExport.ts`** — Builds and downloads a CSV transcript with academic year, semester, course, grade, credits, and GPA contribution.

### Root configuration and assets

- **`package.json`** — Defines `dev`, `build`, `preview`, `lint`, and `clean` scripts and the app dependencies.
- **`vite.config.ts`** — Enables the React and Tailwind Vite plugins, configures the `@` alias, and controls HMR/file watching through `DISABLE_HMR`.
- **`tsconfig.json`** — Configures ES2022, bundler module resolution, React JSX, Vite client types, and no-emit checking.
- **`index.html`** — Defines the page title/description/social metadata, font preconnects, and app entry script.
- **`.env.example`** — Documents the Gemini and app URL variables expected by the AI Studio template. These variables are not currently read by application source code.
- **`public/`** — Static assets copied to the build output as-is.

## 5. Core data model and calculations

The central data entities are:

- **Semester** — ID, display name, academic-year label, and completion state.
- **Subject** — Course identity, title, credits, grade, semester reference, GPA-inclusion flag, and optional skills/category.
- **GradingScale** — Maximum/pass GPA and a list mapping grade labels to points.
- **UserPreferences** — Active scale, target CGPA, selected career role, honors thresholds, and demo/welcome flags.
- **CareerRole** — Role metadata plus required and recommended skill lists.

GPA uses a credit-weighted calculation:

```text
GPA = sum(grade points × eligible subject credits) / sum(eligible subject credits)
```

Subjects excluded from GPA, subjects with non-positive/invalid credits, and grades that do not exist in the active scale do not contribute. The displayed calculation is rounded to two decimal places. Semester metrics are accumulated in the semester order provided by the application.

Target planning derives the required future average from current points, completed credits, remaining credits, and the target. It reports whether the target is already reached, realistic, challenging, or impossible under the selected scale's maximum GPA.

Career matching uses direct, normalized skill overlap. Required and recommended matches contribute different score weights, core subjects can receive an additional score, and the UI presents matched skills and a human-readable explanation. It does not call an AI model.

## 6. State and persistence flow

```text
Initial render
    └── AcademicProvider
          ├── loadInitialData() reads localStorage or bundled defaults/demo data
          ├── derived GPA, honors, and semester values are memoized
          ├── pages/components read and update state through useAcademicData()
          └── state changes are written back through saveStateToStorage()
```

The storage keys in `utils/storage.ts` are versioned (`unipath_*_v1`) and cover semesters, subjects, grading scales, preferences, and available electives. Data is local to the browser profile; clearing browser storage can remove it. Settings also provide a JSON backup/restore flow.

## 7. Local development and validation

Prerequisite: Node.js and npm.

```bash
npm install
npm run dev
```

The Vite development server is configured for port `3000`. Other available commands:

```bash
npm run lint     # TypeScript check (tsc --noEmit)
npm run build    # Production bundle
npm run preview  # Serve the production bundle locally
```

There is no dedicated test script or test directory in the current project structure. `npm run clean` is defined in `package.json`, but its `rm -rf` command is Unix-oriented and may not run in a default Windows shell.

## 8. Current architectural boundaries

- **Client-only data:** State is stored in browser `localStorage`; there is no server-side persistence or account synchronization in the current source.
- **No current Gemini integration:** The Gemini SDK and environment template are present in project metadata/dependencies, but no source file imports or calls the SDK. Career recommendations are based on the local rule-based matcher.
- **No current Express application:** Express appears as a dependency, but there is no Express server entry point in the project source tree.
- **Generated and installed directories:** `dist/` is generated by the production build; `node_modules/` contains installed dependencies. Neither is application source.

When extending the app, keep business rules in `utils/`, shared persisted state in the academic context/storage flow, reusable interface elements in `components/`, and route-level composition in `pages/`.
