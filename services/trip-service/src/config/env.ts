import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(50051),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Env configuration validation error: ${parsed.error.message}`);
}

const env = parsed.data;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
};
