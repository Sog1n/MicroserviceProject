# ShopVerse — Premium E-Commerce Frontend

A production-ready React 18 frontend built with Vite, utilizing an advanced generic SPA architecture designed to interface flawlessly with a Java Microservices backend. 

## 🛠️ Technology Stack
- **Framework**: React 18 + Vite (TypeScript)
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router v7 (Object-based routing + Lazy Loading)
- **Networking**: Axios (with full Auth interceptors)
- **Styling**: SCSS + CSS Modules (Fully tokenized design system)
- **i18n**: i18next + react-i18next (English & Vietnamese)
- **Icons**: react-icons

## 🚀 Quick Start Commands

Install all dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## 🏗️ Architecture Explanation

The folder structure is highly modular and domain-driven to allow scalability for enterprise-level applications:
- **`src/app/`**: Contains the global Redux configuration (`store.ts`) and typed hooks (`hooks.ts`).
- **`src/api/`**: Centralized API definitions. Requests are funneled through an Axios client that automatically injects JWTs. We group endpoints by domain (auth, user, product, order, seller, admin).
- **`src/features/`**: Redux logic (slices and async thunks) stored alongside their domain. 
- **`src/pages/`**: View components. They don't handle state locally; instead, they dispatch actions and pull data from Redux.
- **`src/components/`**: Divided into `common` (reusable UI pieces), `layout` (header/footer/sidebar compositions), and `guards` (Route protectors).
- **`src/styles/`**: Central SCSS tokens, mixins, and globals. CSS modules across the app consume these.

## 🔐 Role-Based Routing Strategy

Our routing (in `src/routes/index.tsx`) uses a combination of route nesting and guard components:
1. **`AuthGuard`**: Wraps routes that require a user to simply be logged in (e.g. `/user/profile`). It intercepts unauthorized users and redirects them to `/login` via `react-router-dom`'s `<Navigate>`, preserving their `location.state` so they can be redirected back after successful login.
2. **`RoleGuard`**: Validates specific strings `['ADMIN']`, `['SELLER']`. If a standard `USER` attempts to hit an Admin path, they are bounced to the `/unauthorized` route component. 
3. **Login Interception**: The login logic dynamically checks roles upon successful login and redirects the specific user to their respective dashboard (`/admin/dashboard` vs `/seller/dashboard` vs `/`).

## 🔌 API Integration Guide with Java Microservices

The application is configured to connect to an API Gateway on `http://localhost:8080`.
The Java Backend is responsible for routing these endpoints across its microservices:
- `/api/auth/*` → Auth Service (e.g., port 8081)
- `/api/users/*` → User Service (e.g., port 8082)
- `/api/products/*`, `/api/admin/products/*`, `/api/seller/products/*` → Product Service (e.g., port 8083)
- `/api/orders/*`, `/api/admin/orders/*`, `/api/seller/orders/*` → Order Service (e.g., port 8084)

**Auth Loop Details**:
- On login, the app expects `accessToken` and `refreshToken` in the JSON response body.
- When an API responds with `401 Unauthorized`, `axiosClient.ts` uses its response interceptor to smoothly catch the error, POST the `refreshToken` to `/api/auth/refresh`, retrieve the new token, and automatically retry the original, failed request.

### Adapting API Contracts

If the Java backend returns different payload shapes (e.g. `productTitle` instead of `name`), follow these steps:
1. Navigate to the related interface in `src/api/<domain>Api.ts` (e.g., `interface Product`). Ensure typescript interfaces reflect the new shape.
2. In `src/features/<domain>/<domain>Slice.ts`, map the incoming data before storing it in Redux if the UI depends heavily on a specific shape, or adjust the related UI components in `src/pages/` or `src/components/`.
3. If the backend wraps responses (e.g., `{ success: true, payload: { ... }}` instead of just the object), change the slice's `createAsyncThunk` mapping:
   ```ts
   // In *Slice.ts
   const { data } = await api.get();
   return data.payload; // Extract specific wrapping locally
   ```
4. `src/utils/errorUtils.ts` gracefully unpacks Spring Boot `ProblemDetail` or custom generic exceptions into an `AppError` object. Alter the `normalizeError` function if a different exception wrapper format is used.
