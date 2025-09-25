import { describe, expect, it } from '@jest/globals';
import { mapTripMessageToCreateInput, mapEventMessageToCreateInput } from '@/grpc/mappers.js';
import { Category } from '@/generated/trip.js';

describe('mappers', () => {
  it('converts snake_case trip payload into domain input', () => {
    const payload = {
      title: 'Kyoto Escape',
      user_id: 'user_123',
      destination: 'Kyoto, Japan',
      start_date: { seconds: 1744243200, nanos: 0 },
      end_date: { seconds: 1744329600, nanos: 0 },
      budget: '2500',
      currency: 'USD',
    };

    const input = mapTripMessageToCreateInput(payload as any);

    expect(input.userId).toBe('user_123');
    expect(input.startDate.toISOString()).toBe('2025-04-10T00:00:00.000Z');
    expect(input.endDate.toISOString()).toBe('2025-04-11T00:00:00.000Z');
    expect(input.budget).toBe(2500);
  });

  it('normalizes event payload with timestamps and coordinates', () => {
    const payload = {
      trip_id: 'trip_1',
      title: 'Sushi Dinner',
      start_time: { seconds: 1744329600, nanos: 0 },
      end_time: { seconds: 1744333200, nanos: 0 },
      location_lat: '35.0116',
      location_lng: '135.7681',
      cost: '120.50',
      category: 'FOOD',
      notes: 'Reserve table',
    };

    const input = mapEventMessageToCreateInput(payload as any);

    expect(input.tripId).toBe('trip_1');
    expect(input.startTime.toISOString()).toBe('2025-04-11T00:00:00.000Z');
    expect(input.locationLat).toBeCloseTo(35.0116);
    expect(input.locationLng).toBeCloseTo(135.7681);
    expect(input.cost).toBeCloseTo(120.5);
    expect(input.category).toBe(Category.FOOD);
    expect(input.notes).toBe('Reserve table');
  });
});
