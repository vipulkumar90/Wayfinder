import logger from '@/lib/logger.js';
import { prisma } from '@/lib/prisma.js';
import type { Prisma } from '@prisma/client';
import {
  CreateTripInput,
  UpdateTripInput,
  createTripSchema,
  updateTripSchema,
} from './trip.schema.js';

export const createNewTrip = async (data: CreateTripInput) => {
  const validatedData = createTripSchema.parse(data);

  const newTrip = await prisma.trip.create({
    data: {
      title: validatedData.title,
      userId: validatedData.userId,
      destination: validatedData.destination,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      budget: validatedData.budget,
      currency: validatedData.currency,
    },
  });
  logger.info(`Successfully created trip with ID: ${newTrip.id}`);
  return newTrip;
};

export const getTripById = async (id: string) => {
  return prisma.trip.findUnique({ where: { id } });
};

export const updateTripById = async (data: UpdateTripInput) => {
  const validatedData = updateTripSchema.parse(data);

  const { id, ...updateData } = validatedData;

  const updatedTrip = await prisma.trip.update({
    where: { id },
    data: updateData,
  });
  logger.info(`Updated trip ${id}`);
  return updatedTrip;
};

export const deleteTripById = async (id: string) => {
  const deleted = await prisma.trip.delete({ where: { id } });
  logger.info(`Deleted trip ${id}`);
  return deleted;
};

type ListTripsParams = {
  userId?: string;
  pageSize: number;
  pageToken?: string;
};

export const listTrips = async ({ userId, pageSize, pageToken }: ListTripsParams) => {
  const take = Math.min(Math.max(pageSize || 20, 1), 100);

  const where = userId ? { userId } : undefined;

  const trips = await prisma.trip.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    take: take + 1,
    ...(pageToken
      ? {
          cursor: { id: pageToken },
          skip: 1,
        }
      : {}),
  });

  let nextPageToken: string | undefined;
  if (trips.length > take) {
    const nextItem = trips.pop();
    nextPageToken = nextItem?.id;
  }

  return {
    trips,
    nextPageToken,
  };
};

export const getTripWithEvents = async (id: string) => {
  return prisma.trip.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: [{ startTime: 'asc' }, { sortOrder: 'asc' }],
      },
    },
  });
};

export type TripWithEvents = Prisma.TripGetPayload<{ include: { events: true } }>;
