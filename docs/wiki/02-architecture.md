# 02 - Architecture
## System Topology
- Frontend app sends requests to `api-gateway` (`:8080`)
- Gateway routes requests to microservices via Eureka service discovery
- Services share MySQL for persistence
- Kafka is used for asynchronous events and stock/order related messaging
## Service Map
```mermaid
graph TD
    FE[frontend-react :5173] --> GW[api-gateway :8080]
    GW --> PS[product-service :8081]
    GW --> US[user-service :8082]
    GW --> OS[order-service :8083]
    PS --> DB[(MySQL :3306)]
    US --> DB
    OS --> DB
    PS --> KF[Kafka :9092 internal / :29092 host]
    US --> KF
    OS --> KF
    PS --> EU[Eureka :8761]
    US --> EU
    OS --> EU
    GW --> EU
```
## Gateway Routing Rules
Defined in `backend/api-gateway/src/main/resources/application.yml`:
- `/api/products/**` -> `PRODUCT-SERVICE`
- `/api/users/**`, `/api/auth/**`, `/api/admin/**` -> `USER-SERVICE`
- `/api/orders/**` -> `ORDER-SERVICE`
## Health Checks
All backend services expose:
- `/api/health`
Used by Docker health checks in `backend/docker-compose.yml`.
