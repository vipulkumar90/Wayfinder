import { afterEach, describe, expect, it, jest } from '@jest/globals';
import type { Prisma, Trip } from '@prisma/client/default.js';

const tripCreateMock: jest.MockedFunction<(args: Prisma.TripCreateArgs) => Promise<Trip>> =
  jest.fn();
const tripUpdateMock: jest.MockedFunction<(args: Prisma.TripUpdateArgs) => Promise<Trip>> =
  jest.fn();
const tripDeleteMock: jest.MockedFunction<(args: Prisma.TripDeleteArgs) => Promise<Trip>> =
  jest.fn();
const tripFindUniqueMock: jest.MockedFunction<
  (args: Prisma.TripFindUniqueArgs) => Promise<Trip | null>
> = jest.fn();
const tripFindManyMock: jest.MockedFunction<(args: Prisma.TripFindManyArgs) => Promise<Trip[]>> =
  jest.fn();

const loggerMock = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

jest.unstable_mockModule('@/lib/prisma.js', () => ({
  prisma: {
    trip: {
      create: tripCreateMock,
      update: tripUpdateMock,
      delete: tripDeleteMock,
      findUnique: tripFindUniqueMock,
      findMany: tripFindManyMock,
    },
  },
}));

jest.unstable_mockModule('@/lib/logger.js', () => ({
  default: loggerMock,
}));

const { createNewTrip, updateTripById, listTrips } = await import('@/modules/trip/trip.service.js');

const baseTrip: Trip = {
  id: 'trip_123',
  title: 'Tokyo Adventure',
  userId: 'user_123',
  destination: 'Tokyo, Japan',
  startDate: new Date('2025-04-10T00:00:00Z'),
  endDate: new Date('2025-04-12T23:59:59Z'),
  budget: 1500,
  currency: 'USD',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
} as Trip;

describe('trip.service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates a new trip with trimmed inputs', async () => {
    const input = {
      title: '  Tokyo Adventure  ',
      userId: 'user_123',
      destination: 'Tokyo, Japan',
      startDate: new Date('2025-04-10T00:00:00Z'),
      endDate: new Date('2025-04-12T23:59:59Z'),
      budget: 1500,
      currency: 'USD',
    };
    tripCreateMock.mockResolvedValue(baseTrip);

    const result = await createNewTrip(input);

    expect(tripCreateMock).toHaveBeenCalledWith({
      data: {
        title: 'Tokyo Adventure',
        userId: input.userId,
        destination: input.destination,
        startDate: input.startDate,
        endDate: input.endDate,
        budget: input.budget,
        currency: input.currency,
      },
    });
    expect(result).toEqual(baseTrip);
  });

  it('rejects trips where startDate is after endDate', async () => {
    const input = {
      title: 'Bad Trip',
      userId: 'user_123',
      destination: 'Nowhere',
      startDate: new Date('2025-04-12T00:00:00Z'),
      endDate: new Date('2025-04-10T00:00:00Z'),
      budget: 100,
      currency: 'USD',
    };

    await expect(createNewTrip(input)).rejects.toThrow(/startDate must be before endDate/i);
    expect(tripCreateMock).not.toHaveBeenCalled();
  });

  it('applies pagination defaults in listTrips', async () => {
    tripFindManyMock.mockResolvedValue([baseTrip]);

    const result = await listTrips({ userId: 'user_123', pageSize: 0, pageToken: undefined });

    expect(tripFindManyMock).toHaveBeenCalledWith({
      where: { userId: 'user_123' },
      orderBy: { createdAt: 'asc' },
      take: 21,
    });
    expect(result.nextPageToken).toBeUndefined();
    expect(result.trips).toHaveLength(1);
  });
});
