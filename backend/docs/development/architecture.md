# Architecture

## Overview

The backend application follows a layered clean architecture:

```
┌─────────────────────────────────────┐
│        FastAPI Application          │
│            (app/main.py)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Router Layer (Endpoints)      │
│          (app/routers/...)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│            Service Layer            │
│          (app/services/...)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Repository Layer           │
│        (app/repositories/...)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Data Layer (SQLAlchemy)       │
│          (app/models/...)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Database (PostgreSQL)        │
└─────────────────────────────────────┘
```

## Key Components

### Router Layer (`app/routers/`)

- Handles HTTP requests and responses
- Request validation and response serialization via Pydantic v2 schemas (`app/schemas/`)
- Mounted under the `/api` prefix

### Service Layer (`app/services/`)

- Contains business logic
- Orchestrates multi-entity operations and validates domain rules
- Raises standard application exceptions (`app/utils/exceptions.py`)

### Repository Layer (`app/repositories/`)

- Encapsulates database queries and data persistence
- Inherits from `BaseRepository` or `UserOwnedSoftDeleteRepository`
- Decouples SQLAlchemy query building from business logic

### Data Layer (`app/models/`)

- Defines SQLAlchemy 2.0 ORM models inheriting from `Base` (`app/models/base.py`)
- Represents PostgreSQL schema with soft-delete (`deleted_at`) and JST timezone helpers

### Schemas (`app/schemas/`)

- Pydantic v2 models for request validation and response formatting
- Base schemas in `app/schemas/base.py` (`EntityResponseBase`, `SoftDeleteEntityResponseBase`)

### Security (`app/security/`)

- BFF pattern with Google OAuth2 flow
- JWT token management and HttpOnly cookie session handling (`app/security/deps.py`)

### Core & Database (`app/core/`)

- `app/core/config.py`: Environment-based settings via Pydantic Settings
- `app/core/db.py`: PostgreSQL connection and session management via SQLAlchemy 2.0 and `psycopg`

### Utils (`app/utils/`)

- Custom application exceptions (`app/utils/exceptions.py`)
- Centralized exception handlers for FastAPI
- Logging configuration

## Data Flow

1. **Request** → FastAPI receives HTTP request at `/api/...`
2. **Authentication / Dependency** → Current user verified from HttpOnly cookie session (`CurrentUser`)
3. **Validation** → Pydantic schema validates input
4. **Router** → Endpoint delegates to corresponding Service
5. **Service** → Business logic and domain validations
6. **Repository** → Executes SQLAlchemy 2.0 queries on PostgreSQL
7. **Response** → Serialized with Pydantic response models
8. **Output** → FastAPI returns JSON response
