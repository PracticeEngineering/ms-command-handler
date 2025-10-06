import { Inject, Injectable } from '@nestjs/common';
import { IEventPublisher } from '../../application/ports/ievent.publisher';
import { PUBSUB_CLIENT } from '../pubsub/pubsub.module';
import { PubSub } from '@google-cloud/pubsub';
import { LOGGER_PROVIDER_TOKEN } from '../logger/logger.constants';
import type { Logger } from 'pino';

@Injectable()
export class PubSubEventPublisher implements IEventPublisher {
  constructor(
    @Inject(PUBSUB_CLIENT) private readonly pubsub: PubSub,
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly logger: Logger,
  ) {}

  async publish(topicName: string, data: any): Promise<void> {
    this.logger.info({ topicName, data }, `Publishing message to topic.`);
    try {
      const topic = this.pubsub.topic(topicName);
      await topic.publishMessage({ json: data });
      this.logger.info({ topicName }, `Message published successfully.`);
    } catch (error) {
      this.logger.error({ topicName, error }, `Failed to publish message.`);
      throw error; // Re-throw the error to be handled by a global exception filter
    }
  }
}