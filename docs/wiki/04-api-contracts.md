# 04 - API Contracts
This page lists key endpoints discovered from controllers.
## Common
- Health: `GET /api/health`
## Product Service (`/api/products`)
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/status/{status}`
- `GET /api/products/seller/{sellerId}`
- `GET /api/products/category/{category}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `PATCH /api/products/{id}/status`
- `DELETE /api/products/{id}`
- `POST /api/products/reduce-stock`
### Categories
- `GET /api/products/categories`
- `POST /api/products/categories`
- `PUT /api/products/categories/{id}`
### Reviews
- `POST /api/products/{productId}/reviews`
- `GET /api/products/{productId}/reviews`
- `DELETE /api/products/reviews/{reviewId}`
## User Service
### Auth (`/api/auth`)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/otp/send`
- `POST /api/auth/otp/verify`
### User (`/api/users`)
- `GET /api/users/{id}`
- `PATCH /api/users/{id}`
- `GET /api/users/search?q=<text>`
### Admin Users (`/api/admin/users`)
- `GET /api/admin/users`
- `DELETE /api/admin/users/{id}`
## Order Service (`/api/orders`)
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/user/{userId}`
- `GET /api/orders/seller/{sellerId}`
- `PUT /api/orders/{id}/status?status=<value>`
- `DELETE /api/orders/{id}`
## Notes
- Gateway entrypoint for clients is `http://localhost:8080`.
- Keep this file in sync when controller mappings change.
