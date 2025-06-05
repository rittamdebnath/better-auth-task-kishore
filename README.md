# 🔐 BetterAuth Authentication Task

This is a full-stack authentication task to assess your ability to implement secure, scalable authentication using **Google OAuth** and **Email/Password** flows, along with organization-based access control.

---

## 📌 Objective

Build a full-stack authentication system using **BetterAuth** with:

- ✅ Google Sign-In
- ✅ Email & Password Sign-Up/Sign-In
- ✅ Session-based authentication
- ✅ Organization-based access control
- ✅ Role-based tab visibility

---

## 🛠️ Tech Stack

### 🔧 Backend
- Framework: **ElysiaJS**
- ORM: **Drizzle ORM**
- Runs on: `http://localhost:8000`
- Uses the shared **BetterAuth** logic and **CORS policy**
- Responsible for:
  - Auth logic (sign-in, sign-up)
  - Session/token management
  - Organization/subscription-level access rules

### 🔧 Frontend
- Framework: **Next.js (React)**
- Runs on: `http://localhost:3000`
- Built from scratch by the candidate (custom UI)
- Responsible for:
  - Auth UI (Google & Email/Password login)
  - Dashboard + Tab layout
  - Conditional access logic on frontend

---

## 🔐 Authentication Requirements

- Google OAuth login
- Email + Password login
- Sign Up and Sign In flows
- Session or JWT-based auth (choose one, but maintain session between page reloads)

---

## 🧩 Dashboard Tabs (Frontend)

After authentication, show a dashboard with the following tabs:

1. **Overview**
2. **Food**
3. **Management**
4. **Settings** → contains the **Subscription** panel

---

### 🔐 Access Control Logic

| Subscription Status | Accessible Tabs                                    |
|---------------------|----------------------------------------------------|
| ✅ Subscribed        | All tabs enabled                                   |
| ❌ Not Subscribed    | Only `Settings > Subscription` tab is accessible; all others must be hidden or disabled |

Use middleware (backend) and conditional rendering (frontend) to enforce this rule.

---

## 📂 Folder Structure
```
betterauth-auth-task/
├── backend/ # Runs on port 8000
│ └── app.ts # ElysiaJS entry file
│ └── drizzle/ # Drizzle ORM setup
│ └── routes/ # Auth and session routes
│ └── betterauth/ # Provided BetterAuth logic
│ └── cors-config.ts # Provided CORS policy
│
├── frontend/ # Runs on port 3000
│ └── pages/
│ └── index.tsx # Dashboard/Home
│ └── login.tsx # Login Page
│ └── settings.tsx # Subscription Panel
│ └── components/
│ └── utils/
│
└── README.md
```

---

## ✅ Completion Criteria

Working Google and Email/Password login flows
Session maintained post-login
Organization-aware authentication and subscription state
Tab-based access control based on subscription status
Clean, modular, and well-documented code
UI that clearly demonstrates all the above features


## 🧪 Bonus (Optional)

Add a "Subscribe" button and mock subscription logic
Use TailwindCSS or modern UI libraries
Add unit tests (e.g., for auth routes or components)

## 🧾 Submission

Submit your GitHub repo or zip folder
Include a short demo video/GIF showing:
- Login flow
- Tab restriction before/after subscription
Add a README.md for backend and frontend separately if needed
Please reach out if you have any questions or blockers. Good luck and show us your best work!
