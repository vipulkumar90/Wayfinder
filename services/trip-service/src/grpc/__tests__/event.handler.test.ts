import { afterEach, describe, expect, it, jest } from '@jest/globals';
import grpc from '@grpc/grpc-js';
import { Category, type CreateEventRequest, type Event as EventMessage } from '@/grpc/__generated__/trip.js';
import { Category as PrismaCategory, type Event } from '@prisma/client/default.js';

const createEventMock: jest.MockedFunction<(input: any) => Promise<Event>> = jest.fn();
const getEventMock = jest.fn();
const updateEventMock = jest.fn();
const deleteEventMock = jest.fn();
const listEventsMock = jest.fn();

const validateInputMock: jest.MockedFunction<(schema: unknown, data: unknown, cb: any) => any> =
  jest.fn();

jest.unstable_mockModule('@/modules/event/event.service.js', () => ({
  createEvent: createEventMock,
  getEventById: getEventMock,
  updateEventById: updateEventMock,
  deleteEventById: deleteEventMock,
  listEvents: listEventsMock,
}));

jest.unstable_mockModule('@/utils/validate.js', () => ({
  validateInput: validateInputMock,
}));

const { createEventHandler } = await import('@/grpc/event.handler.js');

const buildCall = (request: Partial<CreateEventRequest>) =>
  ({ request } as unknown as grpc.ServerUnaryCall<CreateEventRequest, EventMessage>);

describe('event.handler - CreateEvent', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates event and returns response', async () => {
    const eventInput = {
      tripId: 'trip_1',
      title: 'Dinner',
      startTime: new Date('2025-04-11T18:00:00Z'),
      endTime: new Date('2025-04-11T20:00:00Z'),
      cost: 120,
      category: Category.FOOD,
    };

    const createdEvent: Event = {
      id: 'evt_1',
      tripId: eventInput.tripId,
      title: eventInput.title,
      startTime: eventInput.startTime,
      endTime: eventInput.endTime,
      locationName: null,
      locationLat: null,
      locationLng: null,
      cost: eventInput.cost ?? 0,
      category: PrismaCategory.FOOD,
      notes: null,
      sortOrder: 0,
      createdAt: new Date('2025-04-10T00:00:00Z'),
      updatedAt: new Date('2025-04-10T00:00:00Z'),
    };

    validateInputMock.mockReturnValue(eventInput);
    createEventMock.mockResolvedValue(createdEvent);

    const callback = jest.fn();
    const call = buildCall({ event: eventInput as unknown as EventMessage });

    await createEventHandler(call, callback);

    expect(validateInputMock).toHaveBeenCalled();
    expect(createEventMock).toHaveBeenCalledWith(eventInput);
    const [error, response] = callback.mock.calls[0] as [grpc.ServiceError | null, EventMessage?];
    expect(error).toBeNull();
    expect(response).toMatchObject({
      id: 'evt_1',
      title: eventInput.title,
      tripId: eventInput.tripId,
    });
  });

  it('returns INVALID_ARGUMENT when event payload missing', async () => {
    const callback = jest.fn();
    const call = buildCall({});

    await createEventHandler(call, callback);

    const [error] = callback.mock.calls[0] as [grpc.ServiceError | null, EventMessage?];
    expect(error?.code).toBe(grpc.status.INVALID_ARGUMENT);
    expect(createEventMock).not.toHaveBeenCalled();
  });

  it('stops when validation fails', async () => {
    validateInputMock.mockImplementation((_schema, _data, cb) => {
      cb({ code: grpc.status.INVALID_ARGUMENT, message: 'bad event' });
      return null;
    });

    const callback = jest.fn();
    const call = buildCall({ event: {} as EventMessage });

    await createEventHandler(call, callback);

    expect(createEventMock).not.toHaveBeenCalled();
    const [error] = callback.mock.calls[0] as [grpc.ServiceError | null, EventMessage?];
    expect(error?.code).toBe(grpc.status.INVALID_ARGUMENT);
  });
});
