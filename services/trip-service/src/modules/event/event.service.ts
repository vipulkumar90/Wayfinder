import { prisma } from '@/lib/prisma.js';
import logger from '@/lib/logger.js';
import type { Prisma } from '@prisma/client';
import {
  CreateEventInput,
  UpdateEventInput,
  createEventSchema,
  updateEventSchema,
} from './event.schema.js';
import { toPrismaCategory } from './category.js';

export const createEvent = async (input: CreateEventInput) => {
  const data = createEventSchema.parse(input);

  const event = await prisma.event.create({
    data: {
      tripId: data.tripId,
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      locationName: data.locationName ?? null,
      locationLat: data.locationLat ?? null,
      locationLng: data.locationLng ?? null,
      cost: data.cost ?? 0,
      category: toPrismaCategory(data.category),
      notes: data.notes ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  logger.info(`Created event ${event.id} for trip ${event.tripId}`);
  return event;
};

export const getEventById = async (id: string) => {
  return prisma.event.findUnique({ where: { id } });
};

export const updateEventById = async (input: UpdateEventInput) => {
  const data = updateEventSchema.parse(input);
  const { id, ...rest } = data;

  const updateData: Prisma.EventUpdateInput = {};

  if (rest.title !== undefined) updateData.title = rest.title;
  if (rest.startTime !== undefined) updateData.startTime = rest.startTime;
  if (rest.endTime !== undefined) updateData.endTime = rest.endTime;
  if (rest.locationName !== undefined) updateData.locationName = rest.locationName ?? null;
  if (rest.locationLat !== undefined) updateData.locationLat = rest.locationLat ?? null;
  if (rest.locationLng !== undefined) updateData.locationLng = rest.locationLng ?? null;
  if (rest.cost !== undefined) updateData.cost = rest.cost ?? 0;
  if (rest.category !== undefined) updateData.category = toPrismaCategory(rest.category);
  if (rest.notes !== undefined) updateData.notes = rest.notes ?? null;
  if (rest.sortOrder !== undefined) updateData.sortOrder = rest.sortOrder;
  if (rest.tripId !== undefined) {
    updateData.trip = { connect: { id: rest.tripId } };
  }

  const event = await prisma.event.update({
    where: { id },
    data: updateData,
  });
  logger.info(`Updated event ${id}`);
  return event;
};

export const deleteEventById = async (id: string) => {
  const event = await prisma.event.delete({ where: { id } });
  logger.info(`Deleted event ${id}`);
  return event;
};

type ListEventsParams = {
  tripId: string;
  fromDate?: Date;
  toDate?: Date;
};

export const listEvents = async ({ tripId, fromDate, toDate }: ListEventsParams) => {
  return prisma.event.findMany({
    where: {
      tripId,
      ...(fromDate || toDate
        ? {
            startTime: {
              ...(fromDate ? { gte: fromDate } : {}),
              ...(toDate ? { lte: toDate } : {}),
            },
          }
        : {}),
    },
    orderBy: [{ startTime: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
};
