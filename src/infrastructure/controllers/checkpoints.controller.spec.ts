import { Test, TestingModule } from '@nestjs/testing';
import { CheckpointsController } from './checkpoints.controller';
import { CreateCheckpointUseCase } from '../../application/use-cases/create.checkpoint.use-case';
import { CreateCheckpointDto, ShipmentStatus } from './dtos/create-checkpoint.dto';
import { LOGGER_PROVIDER_TOKEN } from '../logger/logger.constants';
import { HttpStatus } from '@nestjs/common';

describe('CheckpointsController', () => {
  let controller: CheckpointsController;
  let createCheckpointUseCase: CreateCheckpointUseCase;

  const mockCreateCheckpointUseCase = {
    execute: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckpointsController],
      providers: [
        {
          provide: CreateCheckpointUseCase,
          useValue: mockCreateCheckpointUseCase,
        },
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<CheckpointsController>(CheckpointsController);
    createCheckpointUseCase = module.get<CreateCheckpointUseCase>(CreateCheckpointUseCase);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckpoint', () => {
    it('should call CreateCheckpointUseCase with the correct data and return an accepted message', async () => {
      const createCheckpointDto: CreateCheckpointDto = {
        trackingId: 'test-tracking-id',
        status: ShipmentStatus.IN_TRANSIT,
        location: 'Test Location',
      };

      mockCreateCheckpointUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.createCheckpoint(createCheckpointDto);

      expect(createCheckpointUseCase.execute).toHaveBeenCalledWith(createCheckpointDto);
      expect(mockLogger.info).toHaveBeenCalledWith({ data: createCheckpointDto }, 'Received request to create checkpoint.');
      expect(result).toEqual({ message: 'Checkpoint received and is being processed.' });
    });

    it('should handle errors from the use case', async () => {
        const createCheckpointDto: CreateCheckpointDto = {
            trackingId: 'test-tracking-id',
            status: ShipmentStatus.IN_TRANSIT,
            location: 'Test Location',
        };

        const error = new Error('Use case error');
        mockCreateCheckpointUseCase.execute.mockRejectedValue(error);

        await expect(controller.createCheckpoint(createCheckpointDto)).rejects.toThrow('Use case error');
    });
  });
});
