import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { CreateTripRequest, Trip } from '@/generated/trip.js';
import { createNewTrip } from '@/modules/trip/trip.service.js';
import * as grpc from '@grpc/grpc-js';
import logger from '@/lib/logger.js';
import { validateInput } from '@/utils/validate.js';
import { createTripSchema } from '@/modules/trip/trip.schema.js';

export const createTripHandler = async (
  call: ServerUnaryCall<CreateTripRequest, Trip>,
  callback: sendUnaryData<Trip>
) => {
  try {
    const tripData = call.request.trip;

    if (!tripData) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Trip data is required',
      } as grpc.ServiceError);
      return;
    }

    const input = {
      name: tripData.title,
      userId: tripData.userId,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budget: tripData.budget,
      currency: tripData.currency,
    };

    const validateResult = validateInput(createTripSchema, input, callback);

    if (!validateResult) return;

    const newTrip = await createNewTrip(validateResult);

    const response: Trip = {
      id: newTrip.id,
      title: newTrip.title || undefined,
      userId: newTrip.id,
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate || undefined,
      budget: newTrip.budget,
      currency: newTrip.currency,
      createdAt: newTrip.createdAt,
      updatedAt: newTrip.updatedAt,
    };

    callback(null, response);
  } catch (error) {
    logger.error('Error in createTripHandler:', error);

    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to create trip',
    } as grpc.ServiceError);
  }
};
