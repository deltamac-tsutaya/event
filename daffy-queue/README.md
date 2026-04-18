# Daffy 似顏畫 — 叫號顯示

A lightweight, real-time queue number display for the Daffy POPUP portrait
drawing event at TSUTAYA BOOKSTORE 信義店.

- **`/`** — customer-facing display (large current number, auto-syncs).
- **`/admin`** — staff panel (password-gated, +1 button, jump-to-number).

Built with plain HTML / CSS / vanilla JavaScript. No build step. Uses
Firebase Realtime Database for cross-device sync.

## Files

```
daffy-queue/
├── index.html            # customer page  (/)
├── admin/index.html      # staff page     (/admin)
├── assets/
│   ├── styles.css        # shared Daffy POPUP visual style
│   └── config.js         # Firebase config + admin password
├── vercel.json           # clean URLs for /admin
└── README.md
```

## Setup

### 1. Create a Firebase project

1. Go to <https://console.firebase.google.com/> and create a project.
2. In the left nav: **Build → Realtime Database → Create Database**.
   Pick a region (e.g. `asia-southeast1`) and start in **locked mode**.
3. In **Project settings → General**, add a new **Web app** and copy the
   `firebaseConfig` object.

### 2. Configure the app

Edit `assets/config.js`:

```js
export const firebaseConfig = { /* paste from Firebase console */ };
export const ADMIN_PASSWORD = "your-staff-password";
export const QUEUE_PATH     = "queue/current";
```

### 3. Set database rules

The client-side password only gates the UI. Protect writes at the
database layer. In Firebase console → Realtime Database → Rules:

```json
{
  "rules": {
    "queue": {
      "current": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

...and sign staff in with Firebase Auth, **or** for the simplest
event-day setup, allow public writes during the event window only:

```json
{
  "rules": {
    "queue": {
      "current": {
        ".read": true,
        ".write": true,
        ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 9999"
      }
    }
  }
}
```

Pick whichever matches your threat model. For a one-day event the
latter is usually acceptable — revert the rule back to `false` after.

### 4. Deploy

**Vercel**

```bash
vercel deploy --prod
```

`vercel.json` enables clean URLs so `admin/index.html` is served at `/admin`.

**Netlify**

```bash
netlify deploy --prod
```

Netlify serves `admin/index.html` at `/admin/` out of the box — no
config needed.

**Local test**

```bash
python3 -m http.server 8000
# open http://localhost:8000/ and http://localhost:8000/admin/
```

## Usage

- **Customer**: share the root URL. Page auto-refreshes every 30 s and
  updates in real-time via Firebase when staff increments the number.
- **Staff**: open `/admin`, enter the password. Tap **＋1 下一位** after
  each customer, or use 跳號 to jump to a specific number.

## Notes

- All display copy is in Traditional Chinese (繁體中文).
- Typography: Fredoka One + Nunito, loaded from Google Fonts.
- The password stored in `config.js` is visible to anyone who views
  source — it's a UX barrier, not real security. Always pair it with
  Firebase rules (step 3) before the event.
