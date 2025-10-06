import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IShipmentRepository } from '../ports/ishipment.repository';
import { SHIPMENT_REPOSITORY } from '../ports/ishipment.repository';
import type { IEventPublisher } from '../ports/ievent.publisher';
import { EVENT_PUBLISHER } from '../ports/ievent.publisher';
import { CreateCheckpointDto } from '../../infrastructure/controllers/dtos/create-checkpoint.dto';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import type { Logger } from 'pino';

@Injectable()
export class CreateCheckpointUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly logger: Logger,
  ) {}

  async execute(command: CreateCheckpointDto): Promise<void> {
    this.logger.info(
      { command },
      'Starting CreateCheckpointUseCase execution.',
    );
    // Regla de negocio: Validar que el envío exista
    const shipment = await this.shipmentRepository.findByTrackingId(
      command.trackingId,
    );

    if (!shipment) {
      this.logger.warn(
        { trackingId: command.trackingId },
        'Shipment not found.',
      );
      throw new NotFoundException(
        `Shipment with trackingId "${command.trackingId}" not found.`,
      );
    }

    // Si existe, publicar el evento para procesamiento asíncrono
    this.eventPublisher.publish('checkpoints-topic', command);
    this.logger.info(
      { trackingId: command.trackingId },
      'Checkpoint created successfully and event published.',
    );
  }
}