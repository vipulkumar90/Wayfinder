import { beforeAll, afterAll, describe, expect, it } from '@jest/globals';
import grpc from '@grpc/grpc-js';
import {
  TripServiceClient,
  EventServiceClient,
  ViewServiceClient,
  BudgetServiceClient,
  Category,
  type Trip as TripMessage,
  type Event as EventMessage,
  type CreateTripRequest,
  type DeleteTripRequest,
  type ListTripsRequest,
  type CreateEventRequest,
  type DeleteEventRequest,
  type ListEventsRequest,
  type GetTimelineRequest,
  type GetBudgetRequest,
  type Trip as TripResponse,
  type Event as EventResponse,
  type ListTripsResponse,
  type ListEventsResponse,
  type GetTimelineResponse,
  type GetBudgetResponse,
} from '@/grpc/__generated__/trip.js';
import { Empty } from '@/grpc/__generated__/google/protobuf/empty.js';

const runIntegration = process.env.RUN_INTEGRATION === '1';
const integrationDescribe = runIntegration ? describe : describe.skip;

const SERVICE_ADDR = process.env.TRIP_SERVICE_ADDR ?? 'localhost:50051';

const unaryCall = <Req, Res>(
  method:
    | ((request: Req, callback: grpc.requestCallback<Res>) => grpc.ClientUnaryCall)
    | ((request: Req, metadata: grpc.Metadata, callback: grpc.requestCallback<Res>) => grpc.ClientUnaryCall),
  request: Req,
  metadata?: grpc.Metadata
): Promise<Res> =>
  new Promise((resolve, reject) => {
    const callback: grpc.requestCallback<Res> = (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response as Res);
    };

    if (metadata) {
      (method as (
        request: Req,
        metadata: grpc.Metadata,
        callback: grpc.requestCallback<Res>
      ) => grpc.ClientUnaryCall)(request, metadata, callback);
      return;
    }

    (method as (
      request: Req,
      callback: grpc.requestCallback<Res>
    ) => grpc.ClientUnaryCall)(request, callback);
  });

const makeAuthMetadata = (userId: string, token = `token-${userId}`) => {
  const metadata = new grpc.Metadata();
  metadata.set('x-user-id', userId);
  metadata.set('authorization', `Bearer ${token}`);
  return metadata;
};

integrationDescribe('gRPC integration', () => {
  let tripClient: TripServiceClient;
  let eventClient: EventServiceClient;
  let viewClient: ViewServiceClient;
  let budgetClient: BudgetServiceClient;

  const createdTripIds: string[] = [];
  const createdEventIds: string[] = [];

  const futureDate = (daysAhead: number) => new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

  beforeAll(() => {
    tripClient = new TripServiceClient(SERVICE_ADDR, grpc.credentials.createInsecure());
    eventClient = new EventServiceClient(SERVICE_ADDR, grpc.credentials.createInsecure());
    viewClient = new ViewServiceClient(SERVICE_ADDR, grpc.credentials.createInsecure());
    budgetClient = new BudgetServiceClient(SERVICE_ADDR, grpc.credentials.createInsecure());
  });

  afterAll(async () => {
    const cleanupMetadata = makeAuthMetadata('cleanup-user');
    for (const eventId of createdEventIds) {
      const req: DeleteEventRequest = { eventId };
      try {
        await unaryCall<DeleteEventRequest, Empty>(
          eventClient.deleteEvent.bind(eventClient),
          req,
          cleanupMetadata
        );
      } catch {
        /* ignore cleanup errors */
      }
    }

    for (const tripId of createdTripIds) {
      const req: DeleteTripRequest = { tripId };
      try {
        await unaryCall<DeleteTripRequest, Empty>(
          tripClient.deleteTrip.bind(tripClient),
          req,
          cleanupMetadata
        );
      } catch {
        /* ignore cleanup errors */
      }
    }

    tripClient.close();
    eventClient.close();
    viewClient.close();
    budgetClient.close();
  });

  it('creates, lists, and deletes a trip', async () => {
    const startDate = futureDate(7);
    const endDate = futureDate(9);
    const userId = `integration-user-${Math.random().toString(16).slice(2)}`;
    const metadata = makeAuthMetadata(userId);

    const createReq: CreateTripRequest = {
      trip: {
        id: '',
        title: 'Integration Trip',
        destination: 'Integration City',
        startDate,
        endDate,
        budget: 1234,
        currency: 'USD',
        createdAt: undefined,
        updatedAt: undefined,
      } satisfies TripMessage,
    };

    const created = await unaryCall<CreateTripRequest, TripResponse>(
      tripClient.createTrip.bind(tripClient),
      createReq,
      metadata
    );
    const createdIdFromResponse = created.id;

    const listReq: ListTripsRequest = {
      pageSize: 10,
      pageToken: '',
    };

    const listResponse = await unaryCall<ListTripsRequest, ListTripsResponse>(
      tripClient.listTrips.bind(tripClient),
      listReq,
      metadata
    );
    const match = listResponse.trips.find((trip) => trip.title === createReq.trip?.title);
    expect(match).toBeDefined();

    const tripId = match?.id || createdIdFromResponse;
    expect(tripId).toBeTruthy();
    if (tripId) {
      createdTripIds.push(tripId);
    }

    const deleteReq: DeleteTripRequest = { tripId: tripId ?? '' };
    await unaryCall<DeleteTripRequest, Empty>(
      tripClient.deleteTrip.bind(tripClient),
      deleteReq,
      metadata
    );

    createdTripIds.pop();
  });

  it('creates an event and fetches timeline/budget data', async () => {
    const startDate = futureDate(5);
    const endDate = futureDate(7);
    const userId = `integration-user-${Math.random().toString(16).slice(2)}`;
    const metadata = makeAuthMetadata(userId);

    const tripReq: CreateTripRequest = {
      trip: {
        id: '',
        title: 'Event Trip',
        destination: 'Event City',
        startDate,
        endDate,
        budget: 2000,
        currency: 'USD',
        createdAt: undefined,
        updatedAt: undefined,
      } satisfies TripMessage,
    };

    const trip = await unaryCall<CreateTripRequest, TripResponse>(
      tripClient.createTrip.bind(tripClient),
      tripReq,
      metadata
    );
    const tripList = await unaryCall<ListTripsRequest, ListTripsResponse>(
      tripClient.listTrips.bind(tripClient),
      {
        pageSize: 5,
        pageToken: '',
      },
      metadata
    );

    const persistedTrip = tripList.trips.find((t) => t.destination === tripReq.trip?.destination);
    const tripId = persistedTrip?.id || trip.id;
    expect(tripId).toBeTruthy();
    createdTripIds.push(tripId);

    const eventStart = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);
    const eventEnd = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000);

    const eventReq: CreateEventRequest = {
      event: {
        id: '',
        tripId: tripId,
        title: 'Dinner Reservation',
        startTime: eventStart,
        endTime: eventEnd,
        locationName: 'Restaurant',
        locationLat: 35.0,
        locationLng: 139.0,
        cost: 150,
        category: Category.FOOD,
        notes: 'Integration test event',
        createdAt: undefined,
        updatedAt: undefined,
      } satisfies EventMessage,
    };

    const createdEvent = await unaryCall<CreateEventRequest, EventResponse>(
      eventClient.createEvent.bind(eventClient),
      eventReq,
      metadata
    );
    createdEventIds.push(createdEvent.id);
    expect(createdEvent.id).toBeTruthy();

    const listEventsReq: ListEventsRequest = { tripId };
    const events = await unaryCall<ListEventsRequest, ListEventsResponse>(
      eventClient.listEvents.bind(eventClient),
      listEventsReq,
      metadata
    );
    expect(events.events.some((evt) => evt.id === createdEvent.id)).toBe(true);

    const timelineReq: GetTimelineRequest = { tripId };
    const timeline = await unaryCall<GetTimelineRequest, GetTimelineResponse>(
      viewClient.getTimeline.bind(viewClient),
      timelineReq,
      metadata
    );
    expect(timeline.days.length).toBeGreaterThan(0);

    const budgetReq: GetBudgetRequest = { tripId };
    const budget = await unaryCall<GetBudgetRequest, GetBudgetResponse>(
      budgetClient.getBudget.bind(budgetClient),
      budgetReq,
      metadata
    );
    expect(budget.summary).toBeDefined();
  });
});
