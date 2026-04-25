# Project Wiki

This wiki is the central documentation for `MicroservicesProject`.

## Quick Links

- [01 - Overview](./01-overview.md)
- [02 - Architecture](./02-architecture.md)
- [03 - Backend Services](./03-backend-services.md)
- [04 - API Contracts](./04-api-contracts.md)
- [05 - Frontend React](./05-frontend-react.md)
- [06 - Setup Runbook](./06-setup-runbook.md)
- [07 - Environment Config](./07-env-config.md)
- [08 - Conventions](./08-conventions.md)

## Source of Truth

When wiki content differs from code, use code as source of truth:

- Backend infra: `backend/docker-compose.yml`
- Gateway routes: `backend/api-gateway/src/main/resources/application.yml`
- Service configs: `backend/*-service/src/main/resources/application.properties`
- Frontend routing: `frontend-react/src/routes/index.tsx`

