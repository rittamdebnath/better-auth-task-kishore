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

## 🛠️ Tech Setup

### 🔧 Frontend
- Runs on: `http://localhost:3000`
- Built from scratch by the candidate (custom UI required)
- Communicates with the backend via API

### 🔧 Backend
- Runs on: `http://localhost:8000`
- Uses the shared **BetterAuth** file and **CORS policy**
- Handles authentication and session management

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

Use middleware or conditional rendering to enforce this rule.

---

## 📂 Folder Structure

