import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().nonempty(),
  destination: z.string().nonempty(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
