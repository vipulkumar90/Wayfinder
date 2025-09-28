import grpc, { type Metadata, type ServiceError } from "@grpc/grpc-js";
import config from "@/config/env.js";
import logger from "@/lib/logger.js";
import {
  BudgetServiceClient,
  type CreateEventRequest,
  type CreateTripRequest,
  type DeleteEventRequest,
  type DeleteTripRequest,
  EventServiceClient,
  type Event,
  type GetBudgetRequest,
  type GetBudgetResponse,
  type GetEventRequest,
  type GetMapViewRequest,
  type GetMapViewResponse,
  type GetTimelineRequest,
  type GetTimelineResponse,
  type GetTripRequest,
  type ListEventsRequest,
  type ListEventsResponse,
  type ListTripsRequest,
  type ListTripsResponse,
  TripServiceClient,
  type Trip,
  type UpdateEventRequest,
  type UpdateTripRequest,
  ViewServiceClient,
} from "@/grpc/__generated__/trip.js";

const openClients: grpc.Client[] = [];

const createUnaryCaller =
  <TRequest, TResponse>(client: grpc.Client, methodName: string) =>
  (request: TRequest, metadata?: Metadata): Promise<TResponse> =>
    new Promise((resolve, reject) => {
      const method = (client as unknown as Record<string, unknown>)[methodName];
      if (typeof method !== "function") {
        reject(
          new Error(`gRPC method ${methodName} is not available on the client`)
        );
        return;
      }

      const callback = (error: ServiceError | null, response: TResponse) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      };

      if (metadata) {
        (method as Function).call(client, request, metadata, callback);
        return;
      }

      (method as Function).call(client, request, callback);
    });

export interface TripGrpcClient {
  createTrip(request: CreateTripRequest, metadata?: Metadata): Promise<Trip>;
  getTrip(request: GetTripRequest, metadata?: Metadata): Promise<Trip>;
  updateTrip(request: UpdateTripRequest, metadata?: Metadata): Promise<Trip>;
  deleteTrip(
    request: DeleteTripRequest,
    metadata?: Metadata
  ): Promise<Record<string, never>>;
  listTrips(
    request: ListTripsRequest,
    metadata?: Metadata
  ): Promise<ListTripsResponse>;
}

export interface EventGrpcClient {
  createEvent(request: CreateEventRequest, metadata?: Metadata): Promise<Event>;
  getEvent(request: GetEventRequest, metadata?: Metadata): Promise<Event>;
  updateEvent(request: UpdateEventRequest, metadata?: Metadata): Promise<Event>;
  deleteEvent(
    request: DeleteEventRequest,
    metadata?: Metadata
  ): Promise<Record<string, never>>;
  listEvents(
    request: ListEventsRequest,
    metadata?: Metadata
  ): Promise<ListEventsResponse>;
}

export interface ViewGrpcClient {
  getTimeline(
    request: GetTimelineRequest,
    metadata?: Metadata
  ): Promise<GetTimelineResponse>;
  getMapView(
    request: GetMapViewRequest,
    metadata?: Metadata
  ): Promise<GetMapViewResponse>;
}

export interface BudgetGrpcClient {
  getBudget(
    request: GetBudgetRequest,
    metadata?: Metadata
  ): Promise<GetBudgetResponse>;
}

export interface GrpcClientBundle {
  trip: TripGrpcClient;
  event: EventGrpcClient;
  view: ViewGrpcClient;
  budget: BudgetGrpcClient;
}

const buildTripClient = (address: string): TripGrpcClient => {
  const client = new TripServiceClient(
    address,
    grpc.credentials.createInsecure()
  );
  openClients.push(client);
  return {
    createTrip: createUnaryCaller<CreateTripRequest, Trip>(
      client,
      "createTrip"
    ),
    getTrip: createUnaryCaller<GetTripRequest, Trip>(client, "getTrip"),
    updateTrip: createUnaryCaller<UpdateTripRequest, Trip>(
      client,
      "updateTrip"
    ),
    deleteTrip: createUnaryCaller<DeleteTripRequest, Record<string, never>>(
      client,
      "deleteTrip"
    ),
    listTrips: createUnaryCaller<ListTripsRequest, ListTripsResponse>(
      client,
      "listTrips"
    ),
  };
};

const buildEventClient = (address: string): EventGrpcClient => {
  const client = new EventServiceClient(
    address,
    grpc.credentials.createInsecure()
  );
  openClients.push(client);
  return {
    createEvent: createUnaryCaller<CreateEventRequest, Event>(
      client,
      "createEvent"
    ),
    getEvent: createUnaryCaller<GetEventRequest, Event>(client, "getEvent"),
    updateEvent: createUnaryCaller<UpdateEventRequest, Event>(
      client,
      "updateEvent"
    ),
    deleteEvent: createUnaryCaller<DeleteEventRequest, Record<string, never>>(
      client,
      "deleteEvent"
    ),
    listEvents: createUnaryCaller<ListEventsRequest, ListEventsResponse>(
      client,
      "listEvents"
    ),
  };
};

const buildViewClient = (address: string): ViewGrpcClient => {
  const client = new ViewServiceClient(
    address,
    grpc.credentials.createInsecure()
  );
  openClients.push(client);
  return {
    getTimeline: createUnaryCaller<GetTimelineRequest, GetTimelineResponse>(
      client,
      "getTimeline"
    ),
    getMapView: createUnaryCaller<GetMapViewRequest, GetMapViewResponse>(
      client,
      "getMapView"
    ),
  };
};

const buildBudgetClient = (address: string): BudgetGrpcClient => {
  const client = new BudgetServiceClient(
    address,
    grpc.credentials.createInsecure()
  );
  openClients.push(client);
  return {
    getBudget: createUnaryCaller<GetBudgetRequest, GetBudgetResponse>(
      client,
      "getBudget"
    ),
  };
};

let memoizedClients: GrpcClientBundle | null = null;

export const getGrpcClients = (): GrpcClientBundle => {
  if (memoizedClients) {
    return memoizedClients;
  }

  const target = config.grpc.tripServiceUrl;
  logger.info(`✅ Connecting to gRPC services at ${target}`);

  memoizedClients = {
    trip: buildTripClient(target),
    event: buildEventClient(target),
    view: buildViewClient(target),
    budget: buildBudgetClient(target),
  };

  return memoizedClients;
};

export const closeGrpcClients = (): void => {
  for (const client of openClients.splice(0)) {
    client.close();
  }
};
