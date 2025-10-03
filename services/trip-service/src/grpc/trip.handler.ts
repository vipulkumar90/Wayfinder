import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import grpc from '@grpc/grpc-js';
import type {
  CreateTripRequest,
  Trip,
  GetTripRequest,
  UpdateTripRequest,
  DeleteTripRequest,
  ListTripsRequest,
  ListTripsResponse,
} from '@/grpc/__generated__/trip.js';
import { Empty } from '@/grpc/__generated__/google/protobuf/empty.js';
import logger from '@/lib/logger.js';
import { validateInput } from '@/utils/validate.js';
import { createTripSchema, updateTripSchema } from '@/modules/trip/trip.schema.js';
import {
  createNewTrip,
  getTripById,
  updateTripById,
  deleteTripById,
  listTrips,
} from '@/modules/trip/trip.service.js';
import {
  mapTripMessageToCreateInput,
  mapTripMessageToUpdateInput,
  mapTripModelToMessage,
} from './mappers.js';
import { isPrismaNotFoundError } from '@/utils/errors.js';
import { readField } from '@/utils/object.js';

const extractUserId = (metadata: grpc.Metadata): string | null => {
  const value = metadata.get('x-user-id');
  if (!value || value.length === 0) {
    return null;
  }
  const first = value[0];
  if (typeof first === 'string') {
    const trimmed = first.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
};

const guardAuthenticated = <T>(
  call: ServerUnaryCall<unknown, T>,
  callback: sendUnaryData<T>
): string | null => {
  const userId = extractUserId(call.metadata);
  if (!userId) {
    callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Authentication required',
    } as grpc.ServiceError);
    return null;
  }
  return userId;
};

export const createTripHandler = async (
  call: ServerUnaryCall<CreateTripRequest, Trip>,
  callback: sendUnaryData<Trip>
) => {
  try {
    const userId = guardAuthenticated(call, callback);
    if (!userId) return;

    const tripData = call.request.trip;

    if (!tripData) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Trip data is required',
      } as grpc.ServiceError);
      return;
    }

    const input = mapTripMessageToCreateInput(tripData);
    const validated = validateInput(createTripSchema, input, callback);
    if (!validated) return;

    const newTrip = await createNewTrip(validated, userId);
    callback(null, mapTripModelToMessage(newTrip));
  } catch (error) {
    logger.error('Error in CreateTrip:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to create trip',
    } as grpc.ServiceError);
  }
};

export const getTripHandler = async (
  call: ServerUnaryCall<GetTripRequest, Trip>,
  callback: sendUnaryData<Trip>
) => {
  try {
    if (!guardAuthenticated(call, callback)) return;

    const tripId =
      readField<string>(call.request, 'tripId', 'trip_id') ??
      (call.request as unknown as { tripId?: string }).tripId;
    if (!tripId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'tripId is required',
      } as grpc.ServiceError);
      return;
    }

    const trip = await getTripById(tripId);
    if (!trip) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Trip ${tripId} not found`,
      } as grpc.ServiceError);
      return;
    }

    callback(null, mapTripModelToMessage(trip));
  } catch (error) {
    logger.error('Error in GetTrip:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to fetch trip',
    } as grpc.ServiceError);
  }
};

export const updateTripHandler = async (
  call: ServerUnaryCall<UpdateTripRequest, Trip>,
  callback: sendUnaryData<Trip>
) => {
  try {
    if (!guardAuthenticated(call, callback)) return;

    const tripData = call.request.trip;
    if (!tripData) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Trip data is required',
      } as grpc.ServiceError);
      return;
    }

    const input = mapTripMessageToUpdateInput(tripData);
    const validated = validateInput(updateTripSchema, input, callback);
    if (!validated) return;

    const updatedTrip = await updateTripById(validated);
    callback(null, mapTripModelToMessage(updatedTrip));
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Trip not found',
      } as grpc.ServiceError);
      return;
    }

    logger.error('Error in UpdateTrip:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to update trip',
    } as grpc.ServiceError);
  }
};

export const deleteTripHandler = async (
  call: ServerUnaryCall<DeleteTripRequest, Empty>,
  callback: sendUnaryData<Empty>
) => {
  try {
    if (!guardAuthenticated(call, callback)) return;

    const tripId =
      readField<string>(call.request, 'tripId', 'trip_id') ??
      (call.request as unknown as { tripId?: string }).tripId;
    if (!tripId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'tripId is required',
      } as grpc.ServiceError);
      return;
    }

    await deleteTripById(tripId);
    callback(null, Empty.create({}));
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Trip not found',
      } as grpc.ServiceError);
      return;
    }

    logger.error('Error in DeleteTrip:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to delete trip',
    } as grpc.ServiceError);
  }
};

export const listTripsHandler = async (
  call: ServerUnaryCall<ListTripsRequest, ListTripsResponse>,
  callback: sendUnaryData<ListTripsResponse>
) => {
  try {
    const userId = guardAuthenticated(call, callback);
    if (!userId) return;
    const pageSize =
      readField<number>(call.request, 'pageSize', 'page_size') ?? call.request.pageSize;
    const pageToken =
      readField<string>(call.request, 'pageToken', 'page_token') ?? call.request.pageToken;

    const result = await listTrips({
      userId,
      pageSize: pageSize || 20,
      pageToken: pageToken || undefined,
    });

    callback(null, {
      trips: result.trips.map(mapTripModelToMessage),
      nextPageToken: result.nextPageToken ?? '',
    });
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Invalid page token provided',
      } as grpc.ServiceError);
      return;
    }

    logger.error('Error in ListTrips:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to list trips',
    } as grpc.ServiceError);
  }
};
