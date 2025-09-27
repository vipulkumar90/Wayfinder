import { afterEach, describe, expect, it, jest } from '@jest/globals';
import grpc from '@grpc/grpc-js';
import type { CreateTripRequest, Trip as TripMessage } from '@/grpc/__generated__/trip.js';
import type { Trip } from '@prisma/client/default.js';

const createTripMock: jest.MockedFunction<(input: any, userId: string) => Promise<Trip>> =
  jest.fn();
const getTripMock = jest.fn();
const updateTripMock = jest.fn();
const deleteTripMock = jest.fn();
const listTripsMock = jest.fn();

const validateInputMock: jest.MockedFunction<(schema: unknown, data: unknown, cb: any) => any> =
  jest.fn();

jest.unstable_mockModule('@/modules/trip/trip.service.js', () => ({
  createNewTrip: createTripMock,
  getTripById: getTripMock,
  updateTripById: updateTripMock,
  deleteTripById: deleteTripMock,
  listTrips: listTripsMock,
}));

jest.unstable_mockModule('@/utils/validate.js', () => ({
  validateInput: validateInputMock,
}));

const { createTripHandler } = await import('@/grpc/trip.handler.js');

const buildMetadata = (userId = 'user_123') => {
  const metadata = new grpc.Metadata();
  metadata.set('x-user-id', userId);
  return metadata;
};

const buildCall = (request: Partial<CreateTripRequest>, metadata = buildMetadata()) =>
  ({
    request: request as CreateTripRequest,
    metadata,
  } as unknown as grpc.ServerUnaryCall<CreateTripRequest, TripMessage>);

describe('trip.handler - CreateTrip', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates trip successfully and returns mapped response', async () => {
    const tripInput = {
      title: 'Tokyo Adventure',
      userId: 'user_123',
      destination: 'Tokyo, Japan',
      startDate: new Date('2025-04-10T00:00:00Z'),
      endDate: new Date('2025-04-12T23:59:59Z'),
      budget: 1500,
      currency: 'USD',
    };

    const createdTrip: Trip = {
      id: 'trip_123',
      title: tripInput.title,
      userId: tripInput.userId,
      destination: tripInput.destination,
      startDate: tripInput.startDate,
      endDate: tripInput.endDate,
      budget: tripInput.budget,
      currency: tripInput.currency,
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T01:00:00Z'),
    };

    validateInputMock.mockImplementation((_schema, data) => data);
    createTripMock.mockResolvedValue(createdTrip);

    const callback = jest.fn();
    const call = buildCall({ trip: tripInput as unknown as TripMessage });

    await createTripHandler(call, callback);

    expect(validateInputMock).toHaveBeenCalledTimes(1);
    expect(validateInputMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), callback);
    expect(createTripMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: tripInput.title,
        destination: tripInput.destination,
        budget: tripInput.budget,
        currency: tripInput.currency,
      }),
      'user_123'
    );
    expect(callback).toHaveBeenCalledTimes(1);
    const [error, response] = callback.mock.calls[0] as [grpc.ServiceError | null, TripMessage?];
    expect(error).toBeNull();
    expect(response).toMatchObject({
      id: 'trip_123',
      title: tripInput.title,
      destination: tripInput.destination,
      budget: tripInput.budget,
      currency: tripInput.currency,
    });
  });

  it('returns INVALID_ARGUMENT when request is missing trip data', async () => {
    const callback = jest.fn();
    const call = buildCall({});

    await createTripHandler(call, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const [error, response] = callback.mock.calls[0] as [grpc.ServiceError | null, TripMessage?];
    expect(response).toBeUndefined();
    expect(error?.code).toBe(grpc.status.INVALID_ARGUMENT);
    expect(createTripMock).not.toHaveBeenCalled();
  });

  it('propagates validation failure and skips service call', async () => {
    validateInputMock.mockImplementation((_schema, _data, cb) => {
      cb({ code: grpc.status.INVALID_ARGUMENT, message: 'validation failed' });
      return null;
    });

    const callback = jest.fn();
    const call = buildCall({ trip: {} as TripMessage });

    await createTripHandler(call, callback);

    expect(createTripMock).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
    const [error] = callback.mock.calls[0] as [grpc.ServiceError | null, TripMessage?];
    expect(error?.code).toBe(grpc.status.INVALID_ARGUMENT);
  });

  it('returns INTERNAL on service error', async () => {
    const tripInput = {
      title: 'Trip',
      userId: 'user_1',
      destination: 'Tokyo',
      startDate: new Date('2025-04-10T00:00:00Z'),
      endDate: new Date('2025-04-11T00:00:00Z'),
      budget: 100,
      currency: 'USD',
    };
    validateInputMock.mockReturnValue(tripInput);
    createTripMock.mockRejectedValue(new Error('db down'));

    const callback = jest.fn();
    const call = buildCall({ trip: tripInput as unknown as TripMessage });

    await createTripHandler(call, callback);

    const [error] = callback.mock.calls[0] as [grpc.ServiceError | null, TripMessage?];
    expect(error?.code).toBe(grpc.status.INTERNAL);
  });
});
