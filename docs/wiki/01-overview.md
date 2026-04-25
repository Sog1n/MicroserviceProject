# 01 - Overview
## Goal
`MicroservicesProject` is an electronics e-commerce system with a Java/Spring microservices backend and a React frontend.
## Scope
- Product catalog management
- User authentication and profile management
- Order creation and tracking
- Role-based experiences for `USER`, `SELLER`, and `ADMIN`
## Tech Stack Snapshot
### Backend
- Java 17
- Spring Boot 3.2.3
- Spring Cloud 2023.0.0
- Eureka Discovery
- Spring Cloud Gateway
- Spring Data JPA + MySQL
- Kafka + Zookeeper
### Frontend
- React + TypeScript + Vite
- Redux Toolkit
- React Router
- Axios
- SCSS
## Modules
- `backend/discovery-service`
- `backend/api-gateway`
- `backend/product-service`
- `backend/user-service`
- `backend/order-service`
- `frontend-react`
## Current Runtime Ports
- `8761` - discovery-service
- `8080` - api-gateway
- `8081` - product-service
- `8082` - user-service
- `8083` - order-service
- `3306` - mysql
- `29092` - kafka host listener
