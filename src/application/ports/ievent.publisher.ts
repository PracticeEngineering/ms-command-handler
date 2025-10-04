export const EVENT_PUBLISHER = 'EventPublisher';

export interface IEventPublisher {
  publish(pattern: string, data: any): void;
}