# Service: ms-command-handler

The primary write-side API and command handler for the Tracking System. This service is the main entry point for creating new shipments and registering tracking events.

## Core Responsibilities

-   Exposes a synchronous HTTP API for creating `Shipments` and `Checkpoints`.
-   Performs business rule validations (e.g., ensures a `Shipment` exists before accepting a `Checkpoint`).
-   Publishes events to a message broker for asynchronous processing by other services.
-   Follows Clean Architecture principles to separate business logic from infrastructure concerns.

## Technology Stack

-   **Framework**: NestJS
-   **Language**: TypeScript
-   **Database Interaction**: `pg` (raw SQL, no ORM) via Repository Pattern
-   **Messaging**: `@google-cloud/pubsub` client library

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

### Create a Shipment

-   **Endpoint**: `POST /shipments`
-   **Description**: Registers a new shipment in the system.
-   **Request Body**:
    ```json
    {
      "trackingId": "GUIA-NEW-001"
    }
    ```
-   **Success Response**: `201 Created`

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
-   **Success Response**: `202 Accepted`
-   **Error Response**: `404 Not Found` if the `trackingId` does not exist.

## Events Published

-   **Topic**: `checkpoints-topic`
-   **Message Payload**: The same JSON object as the request body of the `POST /checkpoints` endpoint.

## How to Run Tests

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e