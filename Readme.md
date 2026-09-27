# BudgetBasics

BudgetBasics is a beginner-focused personal finance website for learning to budget, plan expenses, set savings goals, and make more deliberate spending decisions.

## Start here

- [Website documentation](WEBSITE_DOCUMENTATION.md) describes the pages, user flows, tools, storage, and current limitations.
- [Site map](SITEMAP.md) shows the page hierarchy and the main routes between screens.

## Run locally

Serve the project root with any static web server, then open `index.html`. For example:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/`. The onboarding, dashboard, and learning pages use relative paths, so serving the folder is more reliable than opening individual files directly.

## Technology

- HTML, CSS, and browser JavaScript
- Browser `localStorage` for the demo account, profile, planned expenses, and this-browser visit count
- No server, database, payment connection, or external AI service

This is an educational prototype. Do not enter a real password or sensitive financial information. See the website documentation for details.