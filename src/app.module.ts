import { Module } from '@nestjs/common';
import { SHIPMENT_REPOSITORY } from './application/ports/ishipment.repository';
import { PostgresShipmentRepository } from './infrastructure/repositories/postgres.shipment.repository';
import { EVENT_PUBLISHER } from './application/ports/ievent.publisher';
import { PubSubEventPublisher } from './infrastructure/event-publishing/pubsub.event.publisher';
import { CreateCheckpointUseCase } from './application/use-cases/create-checkpoint.use-case';
import { CheckpointsController } from './infrastructure/controllers/checkpoints.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PubSubModule } from './infrastructure/pubsub/pubsub.module';

@Module({
  imports: [PubSubModule, DatabaseModule],
  controllers: [CheckpointsController],
  providers: [
    // Casos de Uso
    CreateCheckpointUseCase,
    // Proveedores de infraestructure
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