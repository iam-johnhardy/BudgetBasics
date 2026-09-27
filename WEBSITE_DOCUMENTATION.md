# BudgetBasics Website Documentation

## Purpose

BudgetBasics is a beginner-friendly financial education site. It introduces practical budgeting concepts and provides small planning tools for savings and upcoming expenses.

## Pages and structure

- `index.html`: public welcome and account entry with only Log In and Get Started actions; it also contains the five-question profile setup and completion screen.
- `HTML/landing.html`: authenticated dashboard, profile summary, grouped application navigation, and links to lessons/tools.
- `HTML/learn-budgeting.html`: catalogue of the five learning modules.
- `HTML/budgeting-basics.html`: income, expense, and budget fundamentals with a sample plan.
- `HTML/savings-goals.html`: savings progress and estimated completion-time calculator.
- `HTML/needs-vs-wants.html`: spending guide and interactive classification exercise.
- `HTML/expense-planner.html`: add, review, and remove planned expenses.
- `HTML/money-mistakes.html`: advice about common budgeting pitfalls.
- `HTML/infographics-gallery.html`: visual guides to budgeting, spending choices, saving, and planned expenses.
- `HTML/resource-library.html`: searchable, category-filtered, alphabetically sortable catalogue of lessons and tools.
- `HTML/ai-assistant.html`: educational Q&A page with built-in topic responses.
- `HTML/about.html`: project purpose, approach, and limitations.
- `styles.css`: shared styles for the learning pages.
- `site.js`: authentication gate, learning-page navigation, savings calculator, expense planner, classification exercise, resource filters, and built-in Q&A.
- `start.js`: onboarding, account demo, profile setup, and redirects.

## Main user flow

1. A new visitor opens `index.html`; the entry header offers only Log In and Get Started.
2. After account creation, the visitor completes the five-step setup and saves a profile.
3. The completion screen opens the protected dashboard at `HTML/landing.html`.
4. Authenticated navigation opens learning, planning, resource, Q&A, and About pages. The BudgetBasics brand mark links back to the dashboard.
5. Log Out clears the signed-in flag and returns to the welcome screen; the demo account and profile remain in this browser for later login.

An existing demo account can sign in from the welcome page. Sign-in is a single-browser demonstration flow, not production authentication.

## Interactive features

- The savings calculator estimates the number of months to reach a target using a monthly contribution. It does not move money or persist a goal.
- The expense planner saves entries in this browser, totals them, subtracts them from the profile budget, and allows individual entries to be removed. If there is no positive profile budget, it uses a sample budget of ₦1,200.
- The Needs vs Wants page cycles through a short set of examples and gives immediate feedback.
- The Q&A page responds to a small set of finance-related topics using predefined text. It is not connected to an external generative AI service.
- The learning-page navigation collapses into a menu on narrow screens.

## Local data and privacy

The prototype stores data in this browser's `localStorage` under `budgetbasicsAccount`, `budgetbasicsLoggedIn`, `budgetbasicsProfile`, `budgetbasicsExpenses`, and `budgetbasicsBrowserVisits`. `sessionStorage` uses `budgetbasicsVisitRecorded` to count one visit per tab session. The navbar counter is local to this browser and is not a site-wide visitor total. App pages redirect to the login form when the signed-in flag is missing. Because this is a static client-side site, that gate is not server-enforced security. The demo account stores its password as plain text in browser storage. Stored data is not synchronized across browsers or devices. Do not enter real credentials or sensitive financial information.

Clearing this site's browser storage removes the demo account, profile, and planned expenses. Logging out only clears the signed-in flag.

## Run locally

From the project root, start a static server, for example:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/`. Keep the project folder structure intact so the relative page and asset links resolve.

## Current boundaries

BudgetBasics does not connect to a bank, transfer money, process payments, provide personalized financial advice, or guarantee financial outcomes. It currently has no server-side account system, database, or external AI integration.