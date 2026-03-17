# 🏠 Roommate Matcher
## 🌐 Live Demo  
https://your-app.vercel.app

🚀 Preference-based roommate matching system with weighted scoring and deal-breaker filtering.

A web app that helps people find compatible roommates based on lifestyle preferences — not just location. Answer a few questions about how you live, and the algorithm surfaces people you'd actually want to share a flat with.

---

## 💡 Why This Project?

Finding roommates is usually based only on location, which often leads to poor compatibility.

This project focuses on **lifestyle-based matching**, ensuring users are paired with people they can actually live with comfortably.

---

## Features

- **Email-based onboarding** — no passwords, no friction. Enter your email and you're in.
- **Preference-driven profiles** — diet, sleep schedule, cleanliness, smoking/alcohol habits, budget, and apartment type
- **Deal-breaker support** — mark any preference as a hard constraint; incompatible users are filtered out entirely before scoring
- **Weighted compatibility scoring** — lifestyle factors contribute different weights to a final match percentage (e.g. budget and sleep schedule matter more than diet tolerance)
- **City-based matching** — users are matched within the same city, supporting any location worldwide
- **Legacy location normalization** — backwards-compatible with older records that stored internal location keys (`location_a`, etc.), resolved transparently at the data layer
- **Roommate status** — mark yourself as *still looking* or *found* to stay in or drop out of the matching pool
- **Dark / light theme toggle**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| Database | Firebase Firestore |
| Styling | CSS Modules + Tailwind CSS |
| Routing | React Router v6 |
| Auth | Email-based session (localStorage) |

---

## How Matching Works

Matching runs in four sequential steps:

1. **Location filter** — only users in the same city are considered
2. **Gender filter** — only users of the same gender are considered (current default)
3. **Deal-breaker check** — if either user has flagged a preference as a deal-breaker and the values differ, the pair scores **0** and is excluded immediately
4. **Weighted scoring** — remaining criteria are scored and summed; each factor carries a weight reflecting how much it typically affects cohabitation

```
Final score = (Σ matched weights / Σ total weights) × 100
```

Only matches scoring **60% or above** are shown, sorted highest first.

**Scoring weights:**

| Preference | Weight |
|---|---|
| Budget range | 1.8 |
| Apartment type | 1.8 |
| Sleep schedule | 1.5 |
| Cleanliness | 1.5 |
| Smoking habits | 1.2 |
| Alcohol habits | 1.2 |
| Diet | 1.0 |
| Roommate count | 1.0 |

---

## Project Structure

```
src/
├── components/
│   ├── LandingPage.jsx     # Email login + new user onboarding
│   ├── ProfileForm.jsx     # Create / edit profile
│   ├── Menu.jsx            # Dashboard actions
│   ├── MatchResults.jsx    # Renders the match list
│   ├── MatchUser.jsx       # Match card + compatibility algorithm
│   └── ...                 # UI helpers (Skeleton, Tooltip, etc.)
├── utils/
│   └── locationUtils.js    # Location normalization (legacy key → city name)
├── context/
│   └── ThemeContext.jsx    # Dark/light theme
├── firebase.js             # Firestore config
└── App.js                  # Routing + all Firestore read/write logic
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Firebase project with Firestore enabled

### 1. Clone and install

```bash
git clone https://github.com/your-username/roommate-matcher.git
cd roommate-matcher
npm install
```

### 2. Configure Firebase

Create a `.env` file in the project root (use `.env.example` as a template):

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# Optional — leave blank to disable ads
REACT_APP_ADSENSE_CLIENT=
REACT_APP_ADSENSE_SLOT=
```

### 3. Run locally

```bash
npm start
```

App runs at `http://localhost:3000`.

### 4. Deploy

```bash
npm run build
# Deploy the /build folder to Firebase Hosting, Vercel, or Netlify
```

---

## Legacy Location Data

Older Firestore documents may store location as internal keys (e.g. `location_a`, `location_b`). These are resolved to city names automatically by `src/utils/locationUtils.js` — no database migration needed. To add or update mappings, edit the `LOCATION_MAP` object in that file.

---

## Future Improvements

- [ ] Firebase Authentication (replace email-only sessions with proper auth)
- [ ] Firestore security rules scoped per user
- [ ] Gender preference as an explicit user setting rather than a hard filter
- [ ] City autocomplete / validation on the location input
- [ ] Profile photos via Firebase Storage
- [ ] In-app messaging between matched users
- [ ] Mobile-responsive polish

---

## 👨‍💻 Author

**Shourya Mittal** 
📧 shouryamittal2004@gmail.com
