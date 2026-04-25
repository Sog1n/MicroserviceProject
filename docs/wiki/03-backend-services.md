# 03 - Backend Services
## discovery-service
- Path: `backend/discovery-service`
- Port: `8761`
- Role: Eureka registry for service discovery
## api-gateway
- Path: `backend/api-gateway`
- Port: `8080`
- Role: Single backend entry point and route forwarding
- Routes configured in `src/main/resources/application.yml`
## product-service
- Path: `backend/product-service`
- Port: `8081`
- Main base path: `/api/products`
- Responsibilities:
  - Product CRUD
  - Category CRUD
  - Review CRUD
  - Stock reduction endpoint
## user-service
- Path: `backend/user-service`
- Port: `8082`
- Main base paths: `/api/auth`, `/api/users`, `/api/admin/users`
- Responsibilities:
  - Register/login
  - Google auth
  - OTP send/verify
  - User profile management
  - Admin user management
## order-service
- Path: `backend/order-service`
- Port: `8083`
- Main base path: `/api/orders`
- Responsibilities:
  - Create orders
  - Query by user or seller
  - Admin list all orders
  - Update order status
  - Delete orders
