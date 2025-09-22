import { ZodType, z } from 'zod';
import grpc from '@grpc/grpc-js';
import type { sendUnaryData, ServiceError } from '@grpc/grpc-js';

/**
 * Validates input data against a Zod type.
 * Throws a prettifyError that is human readable error if validation fails.
 * @param schema
 * @param data
 * @returns {T}
 * @throws {UserInputError} If validation fails
 */
export const validateInput = <T>(
  schema: ZodType<T>,
  data: unknown,
  callback: sendUnaryData<any>
): T | null => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = z.prettifyError(result.error);

    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: errorMessage,
    } as grpc.ServiceError);
    return null;
  }
  return result.data;
};
