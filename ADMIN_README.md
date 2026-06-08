# CLEANO Detergents — Admin Portal

## Accessing the Admin Panel

**URL:** `http://yourdomain.com/admin`

The admin portal is hidden from the public website — it does not appear in any navigation or links. It is only accessible by navigating directly to `/admin` in the browser.

---

## Default Login Credentials

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@cleano.et`      |
| Password | `cleano@admin2024`     |

> ⚠️ **Important:** Change the password immediately after first login by asking your Super Admin to reset it via **Admin Users → Reset Password**.

---

## Admin Features Overview

### 📊 Dashboard (`/admin/dashboard`)
At-a-glance overview of:
- Total products, stores, and inventory items
- Website visits (last 7 days)
- Most viewed products
- Most searched terms
- Recent admin activity log
- Quick action buttons

---

### 📦 Products (`/admin/products`)
Full product catalog management:
- **Create** new products with English + Amharic names, descriptions, images, prices, category, badge, rating, and TikTok links
- **Edit** any existing product
- **Duplicate** a product as a starting point for a new one
- **Delete** products (with confirmation)
- Filter by category
- Changes immediately update the public website

---

### 🏷️ Categories (`/admin/categories`)
Manage product filter categories:
- Add custom categories with emoji icon + color
- Edit labels in English and Amharic
- **Drag to reorder** — order affects public product filter tabs
- Delete categories

---

### 🏪 Stores (`/admin/stores`)
Manage all store/branch locations:
- Add, edit, delete store locations
- Set name (EN + AM), address (EN + AM), phone, opening hours
- Set GPS coordinates (latitude/longitude) for the map
- Mark main/flagship location
- All changes instantly update the public **Store Locator** map

**Tip:** To get GPS coordinates, go to [Google Maps](https://maps.google.com), find the location, right-click → "Copy coordinates"

---

### 📦 Inventory (`/admin/inventory`)
Track stock levels:
- Add inventory records per product + size + store
- Edit quantity (click the number and tab away to save)
- Status auto-calculates: `In Stock` (qty > 10), `Low Stock` (1–10), `Out of Stock` (0)
- View summary cards for quick overview

---

### 🌍 Translations (`/admin/translations`)
Edit all website text in English and Amharic without touching code:
- Search by key, English value, or Amharic value
- Click any field and type to edit
- Click **Save Changes** when done
- Covers all UI text: navigation, buttons, labels, product categories, etc.

> Note: In production, the server must restart for translation changes to take effect. In development, a page refresh works.

---

### 📝 Content (`/admin/content`)
Edit key page sections:
- Hero banner title & subtitle
- "Why Choose CLEANO" section
- Features block
- Footer tagline
- Contact page intro
- Distributor CTA
- Each section has English + Amharic versions

---

### 🖼️ Media Library (`/admin/media`)
Upload and manage images:
- **Drag & drop** images or click Upload
- Organize into folders: `general`, `products`, `banners`, `logos`
- **Copy URL** of any image to paste into products or content
- Grid or list view
- Delete images
- Files are stored in `public/uploads/`

---

### 📈 Analytics (`/admin/analytics`)
Website performance data:
- 14-day trend chart (visits, product views, searches)
- Top viewed products
- Top search terms
- Page breakdown

Analytics are collected automatically once you run the site — the tracker is embedded in the public layout. No third-party services required.

---

### 🔔 Notifications (`/admin/notifications`)
Compose and send messages via WhatsApp or Telegram:
- Choose channel (WhatsApp or Telegram)
- Pick from message templates (Promotion, New Product, Branch Opening, Restock)
- Customize with placeholders like `{product}`, `{discount}`, `{area}`
- Preview the message as it will appear in the chat app
- **Opens WhatsApp/Telegram with message pre-filled** — you send it manually
- No messages are sent automatically

---

### 👥 Admin Users (`/admin/users`)
Manage who has portal access (Super Admin only):
- Add new admin team members with roles
- Change roles by clicking the role badge
- Reset passwords
- Delete users

**Available roles:**
| Role               | Access                                     |
|--------------------|--------------------------------------------|
| Super Admin        | Everything                                 |
| Manager            | Products, Categories, Stores, Inventory    |
| Translator         | Translations only                          |
| Inventory Manager  | Inventory only                             |
| Content Editor     | Content & Media                            |

---

### 🔎 Audit Logs (`/admin/logs`)
Full history of admin actions:
- Who did what and when
- Filter by resource (products, stores, auth, etc.)
- Search by user, action, or details
- Last 1,000 events stored

---

### ⚙️ Settings (`/admin/settings`)
Global site configuration:
- Company name, tagline, logo URL
- Contact info: email, phone, address
- WhatsApp number and Telegram username
- Social media links
- SEO title and meta description
- Announcement banner (toggle on/off, set text and color)
- Theme color pickers (for reference)

---

## Data Storage

All admin data is stored as JSON files in `src/data/admin/`:

| File              | Contents                          |
|-------------------|-----------------------------------|
| `users.json`      | Admin user accounts               |
| `audit.json`      | Activity log (last 1,000 entries) |
| `settings.json`   | Site configuration                |
| `categories.json` | Product categories                |
| `inventory.json`  | Stock records                     |
| `content.json`    | Editable page sections            |
| `media.json`      | Uploaded file metadata            |
| `analytics.json`  | Website event data (up to 5,000)  |

Product and branch data is stored directly in:
- `src/data/products.json`
- `src/data/branches.json`

Uploaded media files are stored in `public/uploads/`.

---

## Security Notes

- The admin portal is completely separate from the public website
- All admin routes check for a valid session cookie before rendering
- Unauthenticated requests to `/admin/*` redirect to `/admin/login`
- All admin API routes verify the session on every request
- Role-based access control restricts what each user can see and do
- All actions are recorded in the audit log

---

## Running the Project

```bash
npm install
npm run dev
# Visit http://localhost:3000/admin
```

For production:
```bash
npm run build
npm run start
```
