import {
  buildEventMessageFromCreateInput,
  buildEventMessageFromUpdateInput,
  buildTripMessageFromCreateInput,
  buildTripMessageFromUpdateInput,
  mapBudgetSummary,
  mapEventMessageToDTO,
  mapMapViewResponse,
  mapTimelineResponse,
  mapTripMessageToDTO,
  mapTripsConnection,
} from "@/graphql/mappers.js";
import { mapGrpcErrorToGraphql } from "@/graphql/resolver/helpers.js";
import { optionalIsoToDate } from "@/utils/timestamp.js";
import type {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql/__generated__/resolvers-types.js";
import type { MyContext } from "@/types/index.js";

const query: QueryResolvers<MyContext> = {
  trip: async (_parent, args, context) => {
    try {
      const trip = await context.clients.trip.getTrip(
        {
          tripId: args.id,
        },
        context.authMetadata
      );
      return mapTripMessageToDTO(trip);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to fetch trip");
    }
  },

  trips: async (_parent, args, context) => {
    try {
      const response = await context.clients.trip.listTrips(
        {
          pageSize: args.pageSize ?? 0,
          pageToken: args.pageToken ?? "",
        },
        context.authMetadata
      );
      return mapTripsConnection(response);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to list trips");
    }
  },

  event: async (_parent, args, context) => {
    try {
      const event = await context.clients.event.getEvent(
        {
          eventId: args.id,
        },
        context.authMetadata
      );
      return mapEventMessageToDTO(event);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to fetch event");
    }
  },

  events: async (_parent, args, context) => {
    try {
      const response = await context.clients.event.listEvents(
        {
          tripId: args.tripId,
          fromDate: optionalIsoToDate(args.fromDate ?? undefined),
          toDate: optionalIsoToDate(args.toDate ?? undefined),
        },
        context.authMetadata
      );
      return (response.events ?? []).map(mapEventMessageToDTO);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to fetch events");
    }
  },

  timeline: async (_parent, args, context) => {
    try {
      const response = await context.clients.view.getTimeline(
        {
          tripId: args.tripId,
          fromDate: optionalIsoToDate(args.fromDate ?? undefined),
          toDate: optionalIsoToDate(args.toDate ?? undefined),
        },
        context.authMetadata
      );
      return mapTimelineResponse(response);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to fetch timeline");
    }
  },

  mapView: async (_parent, args, context) => {
    try {
      const response = await context.clients.view.getMapView(
        {
          tripId: args.tripId,
          date: optionalIsoToDate(args.date ?? undefined),
        },
        context.authMetadata
      );
      return mapMapViewResponse(response);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to fetch map view");
    }
  },

  budget: async (_parent, args, context) => {
    try {
      const response = await context.clients.budget.getBudget(
        {
          tripId: args.tripId,
        },
        context.authMetadata
      );
      return mapBudgetSummary(response.summary);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to fetch budget summary");
    }
  },
};

const mutation: MutationResolvers<MyContext> = {
  createTrip: async (_parent, args, context) => {
    try {
      const trip = await context.clients.trip.createTrip(
        {
          trip: buildTripMessageFromCreateInput(args.input),
        },
        context.authMetadata
      );
      return mapTripMessageToDTO(trip);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to create trip");
    }
  },

  updateTrip: async (_parent, args, context) => {
    try {
      const trip = await context.clients.trip.updateTrip(
        {
          trip: buildTripMessageFromUpdateInput(args.id, args.input),
        },
        context.authMetadata
      );
      return mapTripMessageToDTO(trip);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to update trip");
    }
  },

  deleteTrip: async (_parent, args, context) => {
    try {
      await context.clients.trip.deleteTrip(
        { tripId: args.id },
        context.authMetadata
      );
      return { success: true };
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to delete trip");
    }
  },

  createEvent: async (_parent, args, context) => {
    try {
      const event = await context.clients.event.createEvent(
        {
          event: buildEventMessageFromCreateInput(args.input),
        },
        context.authMetadata
      );
      return mapEventMessageToDTO(event);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to create event");
    }
  },

  updateEvent: async (_parent, args, context) => {
    try {
      const event = await context.clients.event.updateEvent(
        {
          event: buildEventMessageFromUpdateInput(args.id, args.input),
        },
        context.authMetadata
      );
      return mapEventMessageToDTO(event);
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to update event");
    }
  },

  deleteEvent: async (_parent, args, context) => {
    try {
      await context.clients.event.deleteEvent(
        { eventId: args.id },
        context.authMetadata
      );
      return { success: true };
    } catch (error) {
      return mapGrpcErrorToGraphql(error, "Failed to delete event");
    }
  },
};

export const tripResolver = {
  Query: query,
  Mutation: mutation,
};
