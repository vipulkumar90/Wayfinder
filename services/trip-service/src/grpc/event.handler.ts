import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import grpc from '@grpc/grpc-js';
import type {
  CreateEventRequest,
  Event,
  GetEventRequest,
  UpdateEventRequest,
  DeleteEventRequest,
  ListEventsRequest,
  ListEventsResponse,
} from '@/grpc/__generated__/trip.js';
import { Empty } from '@/grpc/__generated__/google/protobuf/empty.js';
import logger from '@/lib/logger.js';
import { validateInput } from '@/utils/validate.js';
import { createEventSchema, updateEventSchema } from '@/modules/event/event.schema.js';
import {
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
  listEvents,
} from '@/modules/event/event.service.js';
import {
  mapEventMessageToCreateInput,
  mapEventMessageToUpdateInput,
  mapEventModelToMessage,
} from './mappers.js';
import { isPrismaForeignKeyError, isPrismaNotFoundError } from '@/utils/errors.js';
import { readField } from '@/utils/object.js';

export const createEventHandler = async (
  call: ServerUnaryCall<CreateEventRequest, Event>,
  callback: sendUnaryData<Event>
) => {
  try {
    const eventData = call.request.event;
    if (!eventData) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Event data is required',
      } as grpc.ServiceError);
      return;
    }

    const input = mapEventMessageToCreateInput(eventData);
    const validated = validateInput(createEventSchema, input, callback);
    if (!validated) return;

    const event = await createEvent(validated);
    callback(null, mapEventModelToMessage(event));
  } catch (error) {
    if (isPrismaForeignKeyError(error)) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Trip for event not found',
      } as grpc.ServiceError);
      return;
    }

    logger.error('Error in CreateEvent:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to create event',
    } as grpc.ServiceError);
  }
};

export const getEventHandler = async (
  call: ServerUnaryCall<GetEventRequest, Event>,
  callback: sendUnaryData<Event>
) => {
  try {
    const eventId =
      readField<string>(call.request, 'eventId', 'event_id') ??
      (call.request as unknown as { eventId?: string }).eventId;
    if (!eventId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'eventId is required',
      } as grpc.ServiceError);
      return;
    }

    const event = await getEventById(eventId);
    if (!event) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Event ${eventId} not found`,
      } as grpc.ServiceError);
      return;
    }

    callback(null, mapEventModelToMessage(event));
  } catch (error) {
    logger.error('Error in GetEvent:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to fetch event',
    } as grpc.ServiceError);
  }
};

export const updateEventHandler = async (
  call: ServerUnaryCall<UpdateEventRequest, Event>,
  callback: sendUnaryData<Event>
) => {
  try {
    const eventData = call.request.event;
    if (!eventData) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Event data is required',
      } as grpc.ServiceError);
      return;
    }

    const input = mapEventMessageToUpdateInput(eventData);
    const validated = validateInput(updateEventSchema, input, callback);
    if (!validated) return;

    const event = await updateEventById(validated);
    callback(null, mapEventModelToMessage(event));
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Event not found',
      } as grpc.ServiceError);
      return;
    }

    if (isPrismaForeignKeyError(error)) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Trip for event not found',
      } as grpc.ServiceError);
      return;
    }

    logger.error('Error in UpdateEvent:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to update event',
    } as grpc.ServiceError);
  }
};

export const deleteEventHandler = async (
  call: ServerUnaryCall<DeleteEventRequest, Empty>,
  callback: sendUnaryData<Empty>
) => {
  try {
    const eventId =
      readField<string>(call.request, 'eventId', 'event_id') ??
      (call.request as unknown as { eventId?: string }).eventId;
    if (!eventId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'eventId is required',
      } as grpc.ServiceError);
      return;
    }

    await deleteEventById(eventId);
    callback(null, Empty.create({}));
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Event not found',
      } as grpc.ServiceError);
      return;
    }

    logger.error('Error in DeleteEvent:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to delete event',
    } as grpc.ServiceError);
  }
};

export const listEventsHandler = async (
  call: ServerUnaryCall<ListEventsRequest, ListEventsResponse>,
  callback: sendUnaryData<ListEventsResponse>
) => {
  try {
    const tripId =
      readField<string>(call.request, 'tripId', 'trip_id') ??
      (call.request as unknown as { tripId?: string }).tripId;
    const fromDate =
      readField<Date>(call.request, 'fromDate', 'from_date') ?? call.request.fromDate;
    const toDate = readField<Date>(call.request, 'toDate', 'to_date') ?? call.request.toDate;
    if (!tripId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'tripId is required',
      } as grpc.ServiceError);
      return;
    }

    if (fromDate && toDate && toDate < fromDate) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'toDate must be after fromDate',
      } as grpc.ServiceError);
      return;
    }

    const events = await listEvents({
      tripId,
      fromDate: fromDate ?? undefined,
      toDate: toDate ?? undefined,
    });

    callback(null, {
      events: events.map(mapEventModelToMessage),
    });
  } catch (error) {
    logger.error('Error in ListEvents:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to list events',
    } as grpc.ServiceError);
  }
};
