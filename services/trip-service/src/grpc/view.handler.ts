import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import grpc from '@grpc/grpc-js';
import type {
  GetTimelineRequest,
  GetTimelineResponse,
  DayTimeline,
  GetMapViewRequest,
  GetMapViewResponse,
  DayMap,
  MapPoint,
} from '@/generated/trip.js';
import logger from '@/lib/logger.js';
import { buildTimeline, buildMapView } from '@/modules/view/view.service.js';
import { mapEventModelToMessage } from './mappers.js';

export const getTimelineHandler = async (
  call: ServerUnaryCall<GetTimelineRequest, GetTimelineResponse>,
  callback: sendUnaryData<GetTimelineResponse>
) => {
  try {
    const { tripId, fromDate, toDate } = call.request;
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

    const result = await buildTimeline({
      tripId,
      fromDate: fromDate ?? undefined,
      toDate: toDate ?? undefined,
    });

    if (!result) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Trip not found',
      } as grpc.ServiceError);
      return;
    }

    const response: GetTimelineResponse = {
      days: result.days.map<DayTimeline>((day) => ({
        date: day.date,
        events: day.events.map(mapEventModelToMessage),
      })),
    };

    callback(null, response);
  } catch (error) {
    logger.error('Error in GetTimeline:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to generate timeline',
    } as grpc.ServiceError);
  }
};

export const getMapViewHandler = async (
  call: ServerUnaryCall<GetMapViewRequest, GetMapViewResponse>,
  callback: sendUnaryData<GetMapViewResponse>
) => {
  try {
    const { tripId, date } = call.request;
    if (!tripId) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'tripId is required',
      } as grpc.ServiceError);
      return;
    }

    const result = await buildMapView({
      tripId,
      date: date ?? undefined,
    });

    if (!result) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Trip not found',
      } as grpc.ServiceError);
      return;
    }

    const response: GetMapViewResponse = {
      days: result.days
        .map<DayMap>((day) => {
          const points: MapPoint[] = day.events.map((event, index) => ({
            eventId: event.id,
            title: event.title,
            lat: event.locationLat ?? 0,
            lng: event.locationLng ?? 0,
            order: index,
          }));

          return {
            date: day.date,
            points,
          };
        })
        .filter((day) => day.points.length > 0),
    };

    callback(null, response);
  } catch (error) {
    logger.error('Error in GetMapView:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to generate map view',
    } as grpc.ServiceError);
  }
};
