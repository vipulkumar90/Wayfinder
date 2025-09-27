import { z } from 'zod';

const currencyRegex = /^[A-Z]{3}$/;

export const createTripSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'title cannot be empty when provided')
      .optional(),
    destination: z.string().min(1, 'destination is required'),
    startDate: z.date(),
    endDate: z.date(),
    budget: z.number().min(0, 'budget must be non-negative'),
    currency: z
      .string()
      .regex(currencyRegex, 'currency must be a 3-letter ISO code'),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'startDate must be before endDate',
    path: ['endDate'],
  });

export const updateTripSchema = createTripSchema
  .partial({
    destination: true,
    startDate: true,
    endDate: true,
    budget: true,
    currency: true,
    title: true,
  })
  .extend({
    id: z.string().min(1, 'trip id is required'),
  })
  .refine((data) => {
    if (data.startDate && data.endDate) {
      return data.startDate < data.endDate;
    }
    return true;
  }, {
    message: 'startDate must be before endDate',
    path: ['endDate'],
  });

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
