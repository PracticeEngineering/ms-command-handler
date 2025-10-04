import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateCheckpointUseCase } from '../../application/use-cases/create-checkpoint.use-case';
import { CreateCheckpointDto } from './dtos/create-checkpoint.dto'; 

@Controller('checkpoints')
export class CheckpointsController {
  constructor(private readonly createCheckpointUseCase: CreateCheckpointUseCase) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED) // Devuelve 202 Accepted, ideal para flujos asíncronos
  async createCheckpoint(@Body(new ValidationPipe()) data: CreateCheckpointDto) {
    await this.createCheckpointUseCase.execute(data);
    return { message: 'Checkpoint received and is being processed.' };
  }
}