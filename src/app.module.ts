import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { databaseProvider } from './infraestructure/database/database.provider';
import { SHIPMENT_REPOSITORY } from './application/ports/ishipment.repository';
import { PostgresShipmentRepository } from './infraestructure/repositories/postgres.shipment.repository';
import { EVENT_PUBLISHER } from './application/ports/ievent.publisher';
import { PubSubEventPublisher } from './infraestructure/event-publishing/pubsub.event.publisher';
import { CreateCheckpointUseCase } from './application/use-cases/create-checkpoint.use-case';
import { CheckpointsController } from './infraestructure/controllers/checkpoints.controller';
import { PubSubModule } from './infraestructure/pubsub/pubsub.module';
import { join } from 'path';

@Module({
  imports: [PubSubModule],
  controllers: [CheckpointsController],
  providers: [
    // Casos de Uso
    CreateCheckpointUseCase,

    // Proveedores de Infraestructura
    databaseProvider,
    {
      provide: SHIPMENT_REPOSITORY,
      useClass: PostgresShipmentRepository,
    },
    {
      provide: EVENT_PUBLISHER,
      useClass: PubSubEventPublisher,
    },
  ],
})
export class AppModule {}