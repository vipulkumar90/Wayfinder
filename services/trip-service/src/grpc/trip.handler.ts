import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { CreateTripRequest, CreateTripResponse } from '@/generated/trip.js';
import { Trip } from '@/generated/trip.js';
import { createNewTrip } from '@/modules/trip/trip.service.js';

export const createTripHandler = async (
  call: ServerUnaryCall<CreateTripRequest, CreateTripResponse>,
  callback: sendUnaryData<CreateTripResponse>
) => {
  try {
    const input = {
      title: call.request.title,
      destination: call.request.destination,
    };

    const newTrip = await createNewTrip(input);

    const response: CreateTripResponse = {
      trip: {
        id: newTrip.id,
        title: newTrip.title,
        destination: newTrip.destination,
      } as Trip,
    };

    callback(null, response);
  } catch (error) {
    callback(error as Error);
  }
};
