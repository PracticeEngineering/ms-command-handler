export class Shipment {
  id: string; // uuid
  trackingId: string;
  currentStatus: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: { id: string; trackingId: string; currentStatus: string; createdAt: Date; updatedAt: Date; }) {
    this.id = data.id;
    this.trackingId = data.trackingId;
    this.currentStatus = data.currentStatus;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  isDuplicateStatus(newStatus: string): boolean {
    return this.currentStatus === newStatus;
  }
}