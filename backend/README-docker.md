# Docker Run Guide (Backend)

## Included services
- `discovery-service` (Eureka): `8761`
- `api-gateway`: `8080`
- `product-service`: `8081`
- `user-service`: `8082`
- `order-service`: `8083`
- `mysql`: `3306`
- `kafka`: `29092` (host), `9092` (internal)
- `zookeeper`: `2181`

## Run all services
```bash
docker compose up --build -d
```

## Check status
```bash
docker compose ps
docker compose logs -f discovery-service
docker compose logs -f api-gateway
```

## Health endpoints
- `http://localhost:8761/api/health`
- `http://localhost:8080/api/health`
- `http://localhost:8081/api/health`
- `http://localhost:8082/api/health`
- `http://localhost:8083/api/health`

## Stop and remove
```bash
docker compose down
```

## Reset everything (including MySQL data)
```bash
docker compose down -v
```

## Notes
- `user-service` mail credentials are placeholders in `docker-compose.yml`, replace before testing OTP email.
- Kafka client inside containers must use `kafka:9092`.
- Spring datasource inside containers must use `mysql:3306`.

