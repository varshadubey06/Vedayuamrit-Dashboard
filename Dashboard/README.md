# Vedayu Amrit — Business Admin Dashboard

A standalone, luxury Ayurvedic e-commerce management dashboard engineered specifically for **VEDAYU AMRIT**.

Developed in the separate `/Dashboard` directory to decouple administrative operations, catalog curation, logistics management, and financial analytics from the main storefront.

---

## 🌟 Key Features

### 1. 📊 Website Sales & Profit Analytics
- **Live Financial KPIs**:
  - **Total Website Sales Revenue**: Tracks cumulative and live order revenues (₹2,84,650+ baseline).
  - **Estimated Gross Profit**: ₹1,68,220+ with real-time **59.1% profit margin** analysis.
  - **Average Order Value (AOV)**: ₹832 per checkout.
  - **Fulfillment & Dispatch Rates**: 98.2% on-time tracking.
- **Interactive Trends**:
  - Multi-bar monthly comparison for Revenue vs Net Profit.
  - Category-wise revenue contribution: Ayurvedic Health (34%), Juices (20%), Skincare (18%), Hair Care (15%), Superfoods (9%), Teas (4%).
  - Ayurvedic Dosha balancing breakdown (Pitta, Vata, Kapha distribution).

### 2. 🛍️ Complete Product Management (CRUD)
- **Product Catalog Table & Grid**:
  - Search by product name, botanical herb, or SKU.
  - Filter by Category (11 Ayurvedic categories), Stock Status (In Stock, Low Stock, Out of Stock), and Doshas.
  - Sort by Price (Low/High), Stock Count, Customer Rating, Name.
  - **In-table Stock Adjustment**: Quick increment/decrement buttons and instant In-Stock / Out-of-Stock toggle switch.
- **➕ Add Product Section**:
  - Comprehensive formulation form: Title, auto-slug, Category, Selling Price (₹), MRP (₹), Unit Cost Price (₹).
  - **Live Profit Calculator**: Real-time customer discount % and net profit margin % preview.
  - Net Size/Weight (200g, 500ml), Dosage Form (Powder, Capsule, Oil, Juice, Seeds, Churna).
  - Ayurvedic Doshas (Vata, Pitta, Kapha checkboxes).
  - Multi-source Image selector: pick from existing store brand assets, enter custom URL, or upload local image file.
  - Description, Benefits, Ingredients (percentage and purpose), and Certifications (GMP, AYUSH Approved).
  - **Live Storefront Preview Card**: Renders real-time product card as you type.
- **✏️ Edit Product Option**:
  - Instant drawer/modal to edit any attribute of all 46 existing products.
- **🗑️ Delete Product Option**:
  - Safe confirmation modal displaying product thumbnail, name, SKU, with reactive removal and persistence.

### 3. 👥 Login Customers Management
- Detailed customer profiles (Aarav Sharma, Sunita Mehra, Dr. Neha Verma, Rajesh Kulkarni, Vikramjit Singh, etc.).
- Contact data (Email, Phone, City, State, Pincode).
- **Ayurvedic Dosha Profile**: Tracks customer dosha quiz results (Pitta-Vata, Kapha, etc.).
- Total orders placed, lifetime spend, customer tier (VIP, Active, New).
- Customer Profile view displaying full order history and multiple saved delivery addresses.
- Manual customer registration form.

### 4. 📦 Orders & Shipment Logistics
- Live order fulfillment pipeline: Order Placed ➔ Confirmed ➔ Packed ➔ Shipped ➔ Delivered.
- Inline status changer advancing fulfillment.
- Courier tracking assignment (BlueDart, Delhivery, DTDC AWB numbers).
- Detailed printable **GST Tax Invoice** view.

### 5. 🖼️ Media & Image Asset Gallery
- Visual asset browser for all 46 product photography images, hero banners, and logos.
- Filter by: Product Photos, Banners, Logos, Badges.
- **1-Click Copy Image Path**: Copies clean asset paths ready to paste into product forms.
- File uploader & full-screen high-res preview modal.

### 6. 🏷️ Coupons & Promotions
- Promotional discount codes management (VEDA10, AYUSH20, WELCOME100, FESTIVE15).
- Percentage discount or flat rupee deduction with minimum order values.
- Active / Inactive status toggle.

### 7. ⚙️ Store Settings & Data Portability
- Brand credentials, AYUSH Drug License info, and GSTIN registration.
- **Export Full Database**: Download all products, customers, orders, coupons, and media as `.json`.
- **Import Database**: Restore database backups with 1-click file upload.
- **Reset Store Database**: Restores factory defaults with all 46 botanical formulations.

---

## 🚀 Running the Dashboard

### Development Server:

Start both servers in separate terminals from the workspace root:

Terminal 1 (authentication API and storefront):
```bash
cd Vedayuamrit
npm run dev
```

Terminal 2 (admin dashboard):
```bash
cd Dashboard
npm run dev
```

The dashboard runs at `http://localhost:3001`; its authentication API is served by Next.js at `http://localhost:3000`.

### Admin Login Configuration

The dashboard uses the Next.js app as its authentication server. Do not put admin credentials in Vite environment variables or dashboard source code.

Set these environment variables on the **Next.js server** before starting/deploying it:

```text
ADMIN_EMAIL=admin@vedayuamrit.com
ADMIN_PASSWORD=<the admin password>
ADMIN_SESSION_SECRET=<a random secret with at least 32 characters>
DASHBOARD_ORIGIN=http://localhost:3001
```

Generate a session secret with `openssl rand -base64 48`. Set `DASHBOARD_ORIGIN` to the exact deployed dashboard origin. For a dashboard and authentication server on different sites, also set `ADMIN_COOKIE_SAME_SITE=none` and serve both over HTTPS.

For local development, start the storefront/Next.js server on port 3000 and the dashboard on port 3001. For a separate production dashboard host, set `VITE_ADMIN_AUTH_URL` at dashboard build time to the full Next.js endpoint URL, such as `https://store.example.com/api/admin/auth`. Deploy the Next.js app with a server or serverless runtime; the authentication API cannot run on static-only hosting.

The session is stored in a signed, HTTP-only cookie and expires after eight hours. This adds server-validated sign-in, but dashboard records and edits are still stored in browser local storage. Do not use this static dashboard for confidential or production-critical records until those records and mutations are moved behind authenticated server APIs or the hosting provider protects the entire dashboard with access control.

### Production Build:
```bash
cd Dashboard
npm run build
npm run preview
```
