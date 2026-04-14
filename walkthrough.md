# ShopVerse E-Commerce Frontend — Walkthrough

## What Was Built

A complete, production-ready React 18 SPA frontend at `frontend-react/` containing **50+ source files** across all required layers.

## Project Location

```
d:\DATA VINH\Desktop\2025 - 2026\hoc ki 2\CNLTHD\MicroservicesProject\frontend-react\
```

## Tech Stack Used

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 8 | Build tool |
| Redux Toolkit | Latest | State management |
| React Router | v7 | Client-side routing |
| SCSS + CSS Modules | - | Scoped styling |
| Axios | Latest | HTTP client with interceptors |
| i18next + react-i18next | Latest | Internationalization (EN/VI) |
| react-hot-toast | Latest | Toast notifications |
| react-icons | Latest | Icon library |

## Architecture Overview

```
src/
├── api/                  # Axios client + per-domain endpoint modules
│   ├── axiosClient.ts    # Singleton with JWT + refresh interceptors
│   ├── authApi.ts
│   ├── productApi.ts
│   ├── orderApi.ts
│   ├── userApi.ts
│   ├── adminApi.ts
│   └── sellerApi.ts
├── app/                  # Redux store + typed hooks
├── features/             # Redux slices (auth, products, cart, orders, admin, seller, ui)
├── components/
│   ├── common/           # Button, Input, Card, Spinner, EmptyState
│   ├── layout/           # MainLayout (header/footer), DashboardLayout (sidebar)
│   └── guards/           # AuthGuard, RoleGuard
├── pages/
│   ├── auth/             # Login, Register
│   ├── public/           # Home, ProductList, ProductDetail, Cart, Checkout
│   ├── user/             # UserProfile, UserOrders, UserOrderDetail
│   ├── admin/            # AdminDashboard, AdminUsers, AdminProductModeration, AdminProfile
│   └── seller/           # SellerDashboard, SellerProducts, SellerOrders, SellerProfile
├── routes/               # React Router v7 config (createBrowserRouter)
├── i18n/                 # i18next setup + en/vi translation JSONs
├── styles/               # SCSS variables, mixins, global reset
└── utils/                # errorUtils, helpers, storage
```

## Pages Implemented

| Route | Page | Role |
|---|---|---|
| `/` | Home (Hero + Features) | Public |
| `/products` | Product listing with search/sort/pagination | Public |
| `/products/:id` | Product detail with gallery + add-to-cart | Public |
| `/cart` | Shopping cart with quantity management | Public |
| `/login` | Login form | Public |
| `/register` | Registration form | Public |
| `/checkout` | Address + payment + order placement | USER |
| `/user/profile` | Personal info + password change | USER |
| `/user/orders` | Order history table | USER |
| `/user/orders/:id` | Order detail with cancel | USER |
| `/admin/dashboard` | KPI cards + recent orders table | ADMIN |
| `/admin/users` | User management with search + suspend/activate | ADMIN |
| `/admin/products/moderation` | Approve/reject pending products | ADMIN |
| `/admin/profile` | Profile editing | ADMIN |
| `/seller/dashboard` | KPI cards + recent orders + low-stock alerts | SELLER |
| `/seller/products` | Full CRUD with modal | SELLER |
| `/seller/orders` | Order list with status update dropdown | SELLER |
| `/seller/profile` | Profile editing | SELLER |
| `/unauthorized` | 403 error page | Any |

## Key Features

### 🔐 Authentication & Authorization
- JWT tokens stored in Redux + localStorage
- Axios request interceptor attaches `Authorization: Bearer` header
- Response interceptor handles 401 → refresh token → replay failed request
- `AuthGuard` blocks unauthenticated users → redirects to `/login`
- `RoleGuard` validates `['ADMIN']` or `['SELLER']` roles → redirects to `/unauthorized`

### 🌍 Internationalization
- Full EN and VI translations (100+ keys each)
- Language switcher in header (globe icon)
- Browser language auto-detection via `i18next-browser-languagedetector`

### 🛒 Cart
- Redux-managed with localStorage persistence
- Add/remove/update quantity with stock bounds checking

### 📊 Dashboards
- Admin: Total users, orders, products, revenue KPIs + recent orders table
- Seller: Products, sold quantity, revenue, low-stock count KPIs + recent orders + low-stock alerts

## Build Verification

```
✓ 185 modules transformed
✓ built in 916ms
✓ 0 TypeScript errors
✓ 52 optimized output assets with automatic code splitting
```

## Commands

```bash
# Install
cd frontend-react && npm install

# Dev server (port 3000)
npm run dev

# Production build
npm run build
```
