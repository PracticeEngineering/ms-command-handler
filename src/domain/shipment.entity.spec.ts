import { Shipment } from './shipment.entity';

describe('Shipment Entity', () => {
  it('should create a shipment instance and assign properties correctly', () => {
    const shipment = new Shipment();
    const now = new Date();

    shipment.id = 'test-uuid';
    shipment.trackingId = 'test-tracking-id';
    shipment.currentStatus = 'CREATED';
    shipment.createdAt = now;
    shipment.updatedAt = now;

    expect(shipment).toBeInstanceOf(Shipment);
    expect(shipment.id).toBe('test-uuid');
    expect(shipment.trackingId).toBe('test-tracking-id');
    expect(shipment.currentStatus).toBe('CREATED');
    expect(shipment.createdAt).toBe(now);
    expect(shipment.updatedAt).toBe(now);
  });
});
