import { Test, TestingModule } from '@nestjs/testing';
import { CreateCheckpointUseCase } from './create.checkpoint.use-case';
import { IShipmentRepository, SHIPMENT_REPOSITORY } from '../ports/ishipment.repository';
import { IEventPublisher, EVENT_PUBLISHER } from '../ports/ievent.publisher';
import { CreateCheckpointDto } from '../../infrastructure/controllers/dtos/create-checkpoint.dto';
import { Shipment } from '../../domain/shipment.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import { Logger } from 'pino';

describe('CreateCheckpointUseCase', () => {
  let useCase: CreateCheckpointUseCase;
  let shipmentRepository: IShipmentRepository;
  let eventPublisher: IEventPublisher;
  let logger: Logger;

  const mockShipmentRepository = {
    findByTrackingId: jest.fn(),
  };

  const mockEventPublisher = {
    publish: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCheckpointUseCase,
        {
          provide: SHIPMENT_REPOSITORY,
          useValue: mockShipmentRepository,
        },
        {
          provide: EVENT_PUBLISHER,
          useValue: mockEventPublisher,
        },
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useValue: mockLogger,
        },
      ],
    }).compile();

    useCase = module.get<CreateCheckpointUseCase>(CreateCheckpointUseCase);
    shipmentRepository = module.get<IShipmentRepository>(SHIPMENT_REPOSITORY);
    eventPublisher = module.get<IEventPublisher>(EVENT_PUBLISHER);
    logger = module.get<Logger>(LOGGER_PROVIDER_TOKEN);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should publish a checkpoint event when shipment is found and status is different', async () => {
      const command: CreateCheckpointDto = {
        trackingId: '123',
        status: 'in-transit',
        location: 'City A',
        timestamp: new Date(),
      };

      const shipment: Shipment = {
        id: 'uuid-1',
        trackingId: '123',
        currentStatus: 'at-origin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockShipmentRepository.findByTrackingId.mockResolvedValue(shipment);

      await useCase.execute(command);

      expect(shipmentRepository.findByTrackingId).toHaveBeenCalledWith('123');
      expect(eventPublisher.publish).toHaveBeenCalledWith('checkpoints-topic', command);
      expect(mockLogger.info).toHaveBeenCalledWith({ command }, 'Starting CreateCheckpointUseCase execution.');
      expect(mockLogger.info).toHaveBeenCalledWith({ trackingId: '123', status: 'in-transit' }, 'Checkpoint validated. Publishing event.');
    });

    it('should throw NotFoundException when shipment is not found', async () => {
      const command: CreateCheckpointDto = {
        trackingId: '123',
        status: 'in-transit',
        location: 'City A',
        timestamp: new Date(),
      };

      mockShipmentRepository.findByTrackingId.mockResolvedValue(null);

      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith({ trackingId: '123' }, 'Shipment not found.');
    });

    it('should throw ConflictException when status is the same as the current one', async () => {
        const command: CreateCheckpointDto = {
            trackingId: '123',
            status: 'at-origin',
            location: 'City A',
            timestamp: new Date(),
        };

        const shipment: Shipment = {
            id: 'uuid-1',
            trackingId: '123',
            currentStatus: 'at-origin',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockShipmentRepository.findByTrackingId.mockResolvedValue(shipment);

        await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
        expect(mockLogger.warn).toHaveBeenCalledWith({ trackingId: '123', status: 'at-origin' }, 'Duplicate checkpoint status detected. Request rejected.');
    });
  });
});
