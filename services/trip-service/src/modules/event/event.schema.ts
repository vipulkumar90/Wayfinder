import { z } from 'zod';
import { Category } from '@/grpc/__generated__/trip.js';

const categorySchema = z.enum(Category).refine((value) => value !== Category.UNRECOGNIZED, {
  message: 'category is invalid',
});

export const createEventSchema = z
  .object({
    tripId: z.string().min(1, 'tripId is required'),
    title: z.string().min(1, 'title is required'),
    startTime: z.date(),
    endTime: z.date().optional(),
    locationName: z
      .string()
      .trim()
      .max(255, 'locationName must be 255 characters or fewer')
      .optional(),
    locationLat: z
      .number()
      .min(-90, 'locationLat must be between -90 and 90')
      .max(90, 'locationLat must be between -90 and 90')
      .optional(),
    locationLng: z
      .number()
      .min(-180, 'locationLng must be between -180 and 180')
      .max(180, 'locationLng must be between -180 and 180')
      .optional(),
    cost: z.number().min(0, 'cost cannot be negative').optional(),
    category: categorySchema.default(Category.OTHER),
    notes: z.string().optional(),
    sortOrder: z.number().int().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endTime && data.endTime < data.startTime) {
      ctx.addIssue({
        path: ['endTime'],
        code: z.ZodIssueCode.custom,
        message: 'endTime must be after startTime',
      });
    }

    if (
      (data.locationLat !== undefined && data.locationLng === undefined) ||
      (data.locationLng !== undefined && data.locationLat === undefined)
    ) {
      ctx.addIssue({
        path: ['locationLat'],
        code: z.ZodIssueCode.custom,
        message: 'locationLat and locationLng must both be provided',
      });
    }
  });

export const updateEventSchema = createEventSchema
  .partial()
  .extend({
    id: z.string().min(1, 'event id is required'),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime && data.endTime < data.startTime) {
      ctx.addIssue({
        path: ['endTime'],
        code: 'custom',
        message: 'endTime must be after startTime',
      });
    }

    if (
      (data.locationLat !== undefined && data.locationLng === undefined) ||
      (data.locationLng !== undefined && data.locationLat === undefined)
    ) {
      ctx.addIssue({
        path: ['locationLat'],
        code: 'custom',
        message: 'locationLat and locationLng must both be provided',
      });
    }
  });

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
