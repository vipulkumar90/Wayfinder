import grpc, {
  type ChannelCredentials,
  type Metadata,
  type ServiceError,
} from "@grpc/grpc-js";
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

type GrpcClientCtor<T extends grpc.Client> = new (
  address: string,
  credentials: ChannelCredentials
) => T;

const createServiceClient = <T extends grpc.Client>(
  Ctor: GrpcClientCtor<T>,
  address: string
): T => {
  const client = new Ctor(address, grpc.credentials.createInsecure());
  openClients.push(client);
  return client;
};

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

export interface TripServiceClients {
  trip: TripGrpcClient;
  event: EventGrpcClient;
  view: ViewGrpcClient;
  budget: BudgetGrpcClient;
}

export interface UserServiceClients {
  /** Replace with concrete user service clients once user.proto is available. */
}

export interface AuthServiceClients {
  /** Replace with concrete auth service clients once auth.proto is available. */
}

export interface GrpcClientBundle extends TripServiceClients {
  user?: UserServiceClients;
  auth?: AuthServiceClients;
  services: {
    trip: TripServiceClients;
    user?: UserServiceClients;
    auth?: AuthServiceClients;
  };
}

const buildTripClient = (address: string): TripGrpcClient => {
  const client = createServiceClient(TripServiceClient, address);
  return {
    createTrip: createUnaryCaller<CreateTripRequest, Trip>(client, "createTrip"),
    getTrip: createUnaryCaller<GetTripRequest, Trip>(client, "getTrip"),
    updateTrip: createUnaryCaller<UpdateTripRequest, Trip>(client, "updateTrip"),
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
  const client = createServiceClient(EventServiceClient, address);
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
  const client = createServiceClient(ViewServiceClient, address);
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
  const client = createServiceClient(BudgetServiceClient, address);
  return {
    getBudget: createUnaryCaller<GetBudgetRequest, GetBudgetResponse>(
      client,
      "getBudget"
    ),
  };
};

const buildTripServiceClients = (address: string): TripServiceClients => {
  logger.info("✅ Connecting to Trip gRPC service at %s", address);
  return {
    trip: buildTripClient(address),
    event: buildEventClient(address),
    view: buildViewClient(address),
    budget: buildBudgetClient(address),
  };
};

const buildSkeletonService = <T extends object>(
  serviceName: string,
  address: string
): T => {
  logger.warn(
    "%s gRPC client skeleton initialised for %s; add concrete clients when ready.",
    serviceName,
    address
  );
  return Object.freeze({}) as T;
};

let memoizedClients: GrpcClientBundle | null = null;

export const getGrpcClients = (): GrpcClientBundle => {
  if (memoizedClients) {
    return memoizedClients;
  }

  const services: GrpcClientBundle["services"] = {
    trip: buildTripServiceClients(config.grpc.tripServiceUrl),
  };

  if (config.grpc.userServiceUrl) {
    services.user = buildSkeletonService<UserServiceClients>(
      "User",
      config.grpc.userServiceUrl
    );
  }

  if (config.grpc.authServiceUrl) {
    services.auth = buildSkeletonService<AuthServiceClients>(
      "Auth",
      config.grpc.authServiceUrl
    );
  }

  memoizedClients = {
    ...services.trip,
    services,
    ...(services.user ? { user: services.user } : {}),
    ...(services.auth ? { auth: services.auth } : {}),
  };

  return memoizedClients;
};

export const closeGrpcClients = (): void => {
  for (const client of openClients.splice(0)) {
    client.close();
  }
};
