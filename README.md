# Service: ms-command-handler

The primary write-side API and command handler for the Tracking System. This service is the main entry point for registering tracking events.

## Core Responsibilities

-   **Exposes Synchronous API**: Provides an HTTP endpoint for creating `Checkpoints`.
-   **Validates Business Rules**: Ensures a `Shipment` exists and that the new checkpoint is not a duplicate.
-   **Publishes Events**: Emits an event to a message broker for asynchronous processing after a checkpoint is accepted.
-   **Follows Clean Architecture**: Separates business logic from infrastructure concerns for better maintainability and testability.

## Architecture

This service is built following the principles of **Clean Architecture**. This creates a separation of concerns that isolates the core business logic from external dependencies.

-   **Domain**: Contains the core business entities and rules (`Shipment`).
-   **Application**: Orchestrates the business logic by using use cases (`CreateCheckpointUseCase`) and defines the ports (interfaces) for external dependencies like repositories and event publishers.
-   **Infrastructure**: Implements the ports defined in the application layer. This includes controllers, database repositories, and event publishing clients.

## Project Structure

```
src/
├── application/
│   ├── ports/          # Interfaces for repositories, publishers, etc.
│   └── use-cases/      # Core business logic orchestration.
├── domain/             # Business entities and their logic.
└── infrastructure/
    ├── controllers/    # NestJS controllers for handling HTTP requests.
    ├── database/       # Database connection and repository implementations.
    ├── event-publishing/ # Implementation for publishing events (e.g., to Pub/Sub).
    └── logger/         # Logging configuration and middleware.
```

## Technology Stack

-   **Framework**: NestJS
-   **Language**: TypeScript
-   **Database Interaction**: `pg` (raw SQL, no ORM) via Repository Pattern
-   **Messaging**: `@google-cloud/pubsub` client library
-   **Logging**: `pino` for structured, high-performance logging.

## Running the Service (Local Development)

This service is designed to run as part of a multi-container Docker setup orchestrated by Docker Compose.

1.  Navigate to the root directory of the project.
2.  Run the following command:
    ```bash
    docker-compose up
    ```
The service will be available on its designated port (e.g., `http://localhost:3001`).

## Environment Variables

| Variable               | Description                                           | Example Value              |
| ---------------------- | ----------------------------------------------------- | -------------------------- |
| `DATABASE_HOST`        | Hostname of the PostgreSQL database.                  | `db`                       |
| `DATABASE_PORT`        | Port of the PostgreSQL database.                      | `5432`                     |
| `DATABASE_USER`        | Username for the database connection.                 | `user`                     |
| `DATABASE_PASSWORD`    | Password for the database connection.                 | `password`                 |
| `DATABASE_NAME`        | The name of the database to connect to.               | `tracking_db`              |
| `PUBSUB_EMULATOR_HOST` | The host and port of the Google Pub/Sub emulator.     | `pubsub-emulator:8085`     |

## API Endpoints

### Create a Checkpoint

-   **Endpoint**: `POST /checkpoints`
-   **Description**: Registers a new tracking event for a pre-existing shipment. The event is then published for asynchronous processing.
-   **Request Body**:
    ```json
    {
      "trackingId": "GUIA-EXISTING-001",
      "status": "PICKED_UP",
      "location": "Main Warehouse"
    }
    ```
-   **Success Response**: `202 Accepted` - Indicates that the request has been accepted for processing.
-   **Error Responses**:
    -   `404 Not Found`: If the `trackingId` does not correspond to an existing shipment.
    -   `409 Conflict`: If the shipment is already in the status being reported (i.e., a duplicate checkpoint).

## Events Published

-   **Topic**: `checkpoints-topic`
-   **Message Payload**: The same JSON object as the request body of the `POST /checkpoints` endpoint. This event is consumed by downstream services (like `ms-checkpoint-processor`) to handle the actual persistence of the checkpoint.

## How to Run Tests

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e
```
