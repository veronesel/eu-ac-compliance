# AC Compliance Platform — Local Deployment Guide

## Prerequisites (if not already installed)

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (v20+)
brew install node

# Install Git
brew install git
```

## 1. Clone the repository

```bash
git clone https://github.com/veronesel/eu-ac-compliance.git
cd eu-ac-compliance
```

## 2. Install dependencies

```bash
npm install
```

## 3. Set up the environment file

Create a `.env` file in the project root:

```
NEXTAUTH_SECRET=any-random-string-here
NEXTAUTH_URL=http://localhost:3000
```

## 4. Database

The SQLite database (`prisma/dev.db`) is already included in the repository and pre-seeded with demo data. No migration or seed step is needed.

If you ever need to reset and reseed from scratch:

```bash
npm run seed
```

## 5. Start the app

```bash
npm run dev
```

## 6. Open in browser

```
http://localhost:3000
```

---

## Demo Accounts

All accounts use the password **`demo123`**.

| Role | Email |
|------|-------|
| Chief Compliance Officer | `cco@demo.eu` |
| Compliance Officer | `co@demo.eu` |
| Line Manager | `manager@demo.eu` |
| Employee | `employee@demo.eu` |
| Confidential Investigator | `investigator@demo.eu` |
| Auditor | `auditor@demo.eu` |

> Log in as **CCO** (`cco@demo.eu`) for full access to all modules.
