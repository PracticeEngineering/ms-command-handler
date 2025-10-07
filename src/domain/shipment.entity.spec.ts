import { Shipment } from './shipment.entity';

describe('Shipment Entity', () => {
  it('should create a shipment instance and assign properties correctly', () => {
    const now = new Date();
    const shipmentData = {
      id: 'test-uuid',
      trackingId: 'test-tracking-id',
      currentStatus: 'CREATED',
      createdAt: now,
      updatedAt: now,
    };
    const shipment = new Shipment(shipmentData);

    expect(shipment).toBeInstanceOf(Shipment);
    expect(shipment.id).toBe('test-uuid');
    expect(shipment.trackingId).toBe('test-tracking-id');
    expect(shipment.currentStatus).toBe('CREATED');
    expect(shipment.createdAt).toBe(now);
    expect(shipment.updatedAt).toBe(now);
  });
});
