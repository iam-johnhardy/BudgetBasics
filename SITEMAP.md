# BudgetBasics Site Map

## Before Sign-In

`index.html` contains only the BudgetBasics brand and account actions:

- **Log In:** opens the existing account form.
- **Get Started:** opens the sign-up form, then the five-step profile setup.

Learning, planning, resource, and help navigation is not shown on the public entry screen.

## Signed-In Navigation

- **Learn Budgeting:** overview and five lessons.
- **Practice Planning:** Savings Goals and Expense Planner.
- **Explore Resources:** Money Mistakes, Needs vs Wants, Infographics & Learning Gallery, and Search, Sort & Filter.
- **AI Q&A Assistant:** built-in educational question-and-answer guide.
- **About Us:** project purpose and limitations.
- The BudgetBasics brand mark links back to the dashboard. There is no separate Home menu item.

## Page Flow

```text
index.html  Public account entry (only login and sign-up actions)
├── Log In
│   └── Existing account → HTML/landing.html  Protected dashboard
└── Get Started / Sign Up
    └── Profile setup (5 steps)
        └── Setup complete → HTML/landing.html  Protected dashboard

HTML/landing.html  Signed-in dashboard (authentication required)
├── Learn Budgeting
│   ├── HTML/learn-budgeting.html  Learning overview
│   ├── HTML/budgeting-basics.html  Budgeting Basics
│   ├── HTML/savings-goals.html  Savings Goals
│   ├── HTML/needs-vs-wants.html  Needs vs Wants
│   ├── HTML/expense-planner.html  Expense Planner
│   └── HTML/money-mistakes.html  Money Mistakes
├── Practice Planning
│   ├── HTML/savings-goals.html
│   └── HTML/expense-planner.html
├── Explore Resources
│   ├── HTML/money-mistakes.html
│   ├── HTML/needs-vs-wants.html
│   ├── HTML/infographics-gallery.html  Infographics & Learning Gallery
│   └── HTML/resource-library.html  Search, Sort & Filter
├── HTML/ai-assistant.html  AI Q&A Assistant
└── HTML/about.html  About Us
```

All pages under `HTML/` require the signed-in flag and redirect visitors to `index.html#login` when it is absent. This is a client-side gate for the static prototype, not server-enforced security.