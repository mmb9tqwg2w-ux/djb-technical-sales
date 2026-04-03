# DJB Technical Sales — Setup Guide
## Getting the Site Live on Netlify with CMS

---

### What You're Working With

```
djb-site/
├── index.html              ← The public catalog website
├── admin/
│   ├── index.html          ← The CMS editor (Rosie uses this)
│   └── config.yml          ← Defines what Rosie can edit
├── _data/
│   ├── blades/             ← One .yml file per product
│   ├── tapes/
│   ├── brushes/
│   └── ...etc (12 categories)
├── generate-manifests.py   ← Runs automatically at deploy
└── netlify.toml            ← Build configuration
```

---

### Step 1 — Push to GitHub

1. Go to github.com and create a new repository named `djb-technical-sales`
2. Upload the entire `djb-site/` folder to the repo root
   (or use Cowork to do this)
3. Make sure it's set to **Private** if you don't want the source visible

---

### Step 2 — Deploy to Netlify

1. Go to app.netlify.com → "Add new site" → "Import an existing project"
2. Connect your GitHub account
3. Select the `djb-technical-sales` repo
4. Build settings will auto-populate from `netlify.toml`:
   - Build command: `python3 generate-manifests.py`
   - Publish directory: `.`
5. Click **Deploy Site**

Your site will be live at something like `djbtechnicalsales.netlify.app` in ~1 minute.

---

### Step 3 — Enable Netlify Identity (for the CMS login)

1. In Netlify dashboard → **Site settings** → **Identity**
2. Click **Enable Identity**
3. Under "Registration", set to **Invite only** (important — you don't want strangers signing up)
4. Scroll to **Git Gateway** → click **Enable Git Gateway**
   (This is what lets the CMS save edits back to GitHub)

---

### Step 4 — Invite Rosie (and your mom if she wants access)

1. Still in Identity settings → click **Invite users**
2. Enter Rosie's email address
3. She'll get an email with a link to set her password
4. Her login URL will be: `yoursite.netlify.app/admin`

---

### Step 5 — Update the Order Email Address

In `index.html`, find this line (around line 270):

```
mailto:orders@djbtechnicalsales.com
```

Replace `orders@djbtechnicalsales.com` with Rosie's actual email address.

---

### Step 6 — (Optional) Connect Custom Domain

1. In Netlify → **Domain settings** → **Add custom domain**
2. Enter `djbtechnicalsales.com`
3. Follow the DNS instructions to point the domain to Netlify
4. Netlify handles SSL automatically (free)

---

## How Rosie Uses the CMS

**To log in:**
→ Go to `yoursite.netlify.app/admin`
→ Enter her email and password

**The dashboard shows 12 categories** (Blades, Tapes, Brushes, etc.)

**To hide an item (out of stock):**
1. Click the category (e.g. "Tapes")
2. Find the item in the list
3. Click it to open
4. Toggle **"Active (visible on site)"** to OFF
5. Click **Save** → site updates in ~30 seconds

**To change a price:**
1. Open the item
2. Change the **Unit Price** field
3. Save

**To show quantity:**
1. Open the item
2. Toggle **"Show Quantity in Stock"** to ON
3. Enter the quantity number
4. Save — the quantity now appears in the catalog

**To add a new item:**
1. Click the category
2. Click **"New [Item]"** button at the top
3. Fill in: Active, Item Code, Description, Price
4. Save

**To permanently delete an item:**
1. Open the item
2. Click the **three-dot menu** → Delete
   (But hiding with the Active toggle is usually better)

---

## Notes

- Changes take ~30 seconds to appear on the live site (Netlify rebuilds on every save)
- The CMS only works on desktop/laptop, not phone
- Rosie does not need a GitHub account — only Netlify Identity login
- You can have multiple editors (add more email invites)
