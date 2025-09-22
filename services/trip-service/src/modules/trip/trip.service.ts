import logger from '@/lib/logger.js';
import { createTripSchema, CreateTripInput } from './trip.schema.js';
import { prisma } from '@/lib/prisma.js';

export const createNewTrip = async (data: CreateTripInput) => {
  const validatedData = createTripSchema.parse(data);

  const newTrip = await prisma.trip.create({
    data: {
      title: data.title,
      userId: data.userId,
      destination: data.destination,
      startDate: data.startDate, // Prisma expects a Date object
      endDate: data.endDate, // This can be null/undefined if optional
      budget: data.budget,
      currency: data.currency,
    },
  });
  logger.info(`Successfully created trip with ID: ${newTrip.id}`);
  return newTrip;
};
