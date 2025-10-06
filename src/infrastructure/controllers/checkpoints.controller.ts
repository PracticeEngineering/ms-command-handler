import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { CreateCheckpointUseCase } from '../../application/use-cases/create.checkpoint.use-case';
import { CreateCheckpointDto } from './dtos/create-checkpoint.dto'; 
import { LOGGER_PROVIDER_TOKEN } from '../logger/logger.constants';
import type { Logger } from 'pino';

@Controller('checkpoints')
export class CheckpointsController {
  constructor(
    private readonly createCheckpointUseCase: CreateCheckpointUseCase,
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly logger: Logger,
    ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED) // Devuelve 202 Accepted, ideal para flujos asíncronos
  async createCheckpoint(@Body(new ValidationPipe()) data: CreateCheckpointDto) {
    this.logger.info({ data }, 'Received request to create checkpoint.');
    await this.createCheckpointUseCase.execute(data);
    this.logger.info({ data }, 'Checkpoint processed by use case.');
    return { message: 'Checkpoint received and is being processed.' };
  }
}