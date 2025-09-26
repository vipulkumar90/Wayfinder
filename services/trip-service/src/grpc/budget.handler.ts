import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import grpc from '@grpc/grpc-js';
import type { GetBudgetRequest, GetBudgetResponse, BudgetSummary } from '@/generated/trip.js';
import logger from '@/lib/logger.js';
import { buildBudgetSummary } from '@/modules/budget/budget.service.js';
import { readField } from '@/utils/object.js';

export const getBudgetHandler = async (
  call: ServerUnaryCall<GetBudgetRequest, GetBudgetResponse>,
  callback: sendUnaryData<GetBudgetResponse>
) => {
  try {
    const tripId =
      readField<string>(call.request, 'tripId', 'trip_id') ??
      (call.request as unknown as { tripId?: string }).tripId;
    if (!tripId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'tripId is required',
      } as grpc.ServiceError);
      return;
    }

    const result = await buildBudgetSummary(tripId);
    if (!result) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Trip not found',
      } as grpc.ServiceError);
      return;
    }

    const summary: BudgetSummary = {
      tripId: result.trip.id,
      totalBudget: result.summary.totalBudget,
      amountSpent: result.summary.amountSpent,
      remaining: result.summary.remaining,
      spentByCategory: result.summary.spentByCategory,
    };

    callback(null, { summary });
  } catch (error) {
    logger.error('Error in GetBudget:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to compute budget summary',
    } as grpc.ServiceError);
  }
};
