import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Category } from '@/grpc/__generated__/trip.js';
import type { Event, Prisma } from '@prisma/client/default.js';

const eventCreateMock: jest.MockedFunction<(args: Prisma.EventCreateArgs) => Promise<Event>> =
  jest.fn();
const eventUpdateMock: jest.MockedFunction<(args: Prisma.EventUpdateArgs) => Promise<Event>> =
  jest.fn();
const eventDeleteMock: jest.MockedFunction<(args: Prisma.EventDeleteArgs) => Promise<Event>> =
  jest.fn();
const eventFindUniqueMock: jest.MockedFunction<
  (args: Prisma.EventFindUniqueArgs) => Promise<Event | null>
> = jest.fn();
const eventFindManyMock: jest.MockedFunction<(args: Prisma.EventFindManyArgs) => Promise<Event[]>> =
  jest.fn();

const loggerMock = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

jest.unstable_mockModule('@/lib/prisma.js', () => ({
  prisma: {
    event: {
      create: eventCreateMock,
      update: eventUpdateMock,
      delete: eventDeleteMock,
      findUnique: eventFindUniqueMock,
      findMany: eventFindManyMock,
    },
  },
}));

jest.unstable_mockModule('@/lib/logger.js', () => ({
  default: loggerMock,
}));

const { createEvent, updateEventById } = await import('@/modules/event/event.service.js');

describe('event.service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates an event with normalized optional fields', async () => {
    const now = new Date('2025-04-10T09:00:00Z');
    const payload = {
      tripId: 'trip_1',
      title: 'Breakfast',
      startTime: now,
      endTime: new Date('2025-04-10T10:00:00Z'),
      cost: undefined,
      category: Category.FOOD,
      notes: undefined,
    };
    const created: Event = {
      id: 'evt_1',
      tripId: 'trip_1',
      title: 'Breakfast',
      startTime: payload.startTime,
      endTime: payload.endTime!,
      locationName: null,
      locationLat: null,
      locationLng: null,
      cost: 0,
      category: 'FOOD',
      notes: null,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    };
    eventCreateMock.mockResolvedValue(created);

    const result = await createEvent(payload);

    expect(eventCreateMock).toHaveBeenCalledWith({
      data: {
        tripId: 'trip_1',
        title: 'Breakfast',
        startTime: payload.startTime,
        endTime: payload.endTime,
        locationName: null,
        locationLat: null,
        locationLng: null,
        cost: 0,
        category: 'FOOD',
        notes: null,
        sortOrder: 0,
      },
    });
    expect(result).toEqual(created);
  });

  it('rejects invalid latitude/longitude combinations', async () => {
    const payload = {
      tripId: 'trip_1',
      title: 'Lunch',
      startTime: new Date('2025-04-10T12:00:00Z'),
      locationLat: 35.0,
    };

    await expect(createEvent(payload as any)).rejects.toThrow(
      /locationLat and locationLng must both be provided/i
    );
    expect(eventCreateMock).not.toHaveBeenCalled();
  });

  it('updates event and reconnects to new trip when provided', async () => {
    const updatePayload = {
      id: 'evt_1',
      tripId: 'trip_2',
      title: 'Dinner',
      category: Category.FOOD,
    };
    const updated: Event = {
      id: 'evt_1',
      tripId: 'trip_2',
      title: 'Dinner',
      startTime: new Date('2025-04-10T18:00:00Z'),
      endTime: new Date('2025-04-10T19:00:00Z'),
      locationName: null,
      locationLat: null,
      locationLng: null,
      cost: 0,
      category: 'FOOD',
      notes: null,
      sortOrder: 0,
      createdAt: new Date('2025-04-10T18:00:00Z'),
      updatedAt: new Date('2025-04-10T18:30:00Z'),
    };
    eventUpdateMock.mockResolvedValue(updated);

    const result = await updateEventById(updatePayload as any);

    expect(eventUpdateMock).toHaveBeenCalledWith({
      where: { id: 'evt_1' },
      data: {
        trip: { connect: { id: 'trip_2' } },
        title: 'Dinner',
        category: 'FOOD',
      },
    });
    expect(result).toEqual(updated);
  });
});
