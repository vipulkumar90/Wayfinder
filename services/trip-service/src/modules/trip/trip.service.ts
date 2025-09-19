import { createTripSchema, CreateTripInput } from './trip.schema.js';
import * as tripRepository from './trip.repository.js';

export const createNewTrip = async (data: CreateTripInput) => {
  const validatedData = createTripSchema.parse(data);
  const newTrip = await tripRepository.create(validatedData);
  return newTrip;
};
