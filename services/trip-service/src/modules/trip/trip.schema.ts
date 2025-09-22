import { z } from 'zod';

const timestampSchema = z
  .object({
    seconds: z.number(),
    nanos: z.number(),
  })
  .transform((ts) => new Date(ts.seconds * 1000));

export const createTripSchema = z
  .object({
    title: z.string().optional(),
    userId: z.string().min(1, 'user_id is required'),
    destination: z.string().min(1, 'destination is required'),

    startDate: timestampSchema.refine((date) => date > new Date(), {
      message: 'start_date must be in the future',
    }),
    endDate: timestampSchema,

    budget: z.number().min(0, 'budget must be non-negative'),
    currency: z.string().regex(/^[A-Z]{3}$/, 'currency must be a 3-letter ISO code'),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'start_date must be before end_date',
    path: ['endDate'],
  });

export type CreateTripInput = z.infer<typeof createTripSchema>;
