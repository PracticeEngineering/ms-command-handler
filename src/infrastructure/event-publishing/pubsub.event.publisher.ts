import { Inject, Injectable } from '@nestjs/common';
import { IEventPublisher } from '../../application/ports/ievent.publisher';
import { PUBSUB_CLIENT } from '../pubsub/pubsub.module';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubEventPublisher implements IEventPublisher {
  constructor(
    @Inject(PUBSUB_CLIENT) private readonly pubsub: PubSub,
  ) {}

  async publish(topicName: string, data: any): Promise<void> {
    console.log(`Publicando mensaje en el tópico "${topicName}":`, data);
    const topic = this.pubsub.topic(topicName);
    await topic.publishMessage({ json: data });
  }
}