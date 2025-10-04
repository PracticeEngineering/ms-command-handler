import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IShipmentRepository } from '../ports/ishipment.repository';
import { SHIPMENT_REPOSITORY } from '../ports/ishipment.repository';
import type { IEventPublisher } from '../ports/ievent.publisher';
import { EVENT_PUBLISHER } from '../ports/ievent.publisher';
import { CreateCheckpointDto } from '../../infraestructure/controllers/dtos/create-checkpoint.dto';

@Injectable()
export class CreateCheckpointUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: CreateCheckpointDto): Promise<void> {
    // Regla de negocio: Validar que el envío exista
    const shipment = await this.shipmentRepository.findByTrackingId(
      command.trackingId,
    );

    if (!shipment) {
      throw new NotFoundException(
        `Shipment with trackingId "${command.trackingId}" not found.`,
      );
    }

    // Si existe, publicar el evento para procesamiento asíncrono
    this.eventPublisher.publish('checkpoints-topic', command);
  }
}