import { prisma } from '@/lib/prisma.js'; // Note the .js extension for NodeNext
import { CreateTripInput } from './trip.schema.js';

export const create = (data: CreateTripInput) => {
  return prisma.trip.create({
    data: {
      ...data,
      startDate: new Date(),
      budget: 0,
    },
  });
};
