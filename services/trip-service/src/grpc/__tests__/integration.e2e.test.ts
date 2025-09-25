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
} from '@/generated/trip.js';
import { Empty } from '@/generated/google/protobuf/empty.js';

const runIntegration = process.env.RUN_INTEGRATION === '1';
const integrationDescribe = runIntegration ? describe : describe.skip;

const SERVICE_ADDR = process.env.TRIP_SERVICE_ADDR ?? 'localhost:50051';

const unaryCall = <Req, Res>(
  method: (request: Req, callback: grpc.requestCallback<Res>) => grpc.ClientUnaryCall,
  request: Req
): Promise<Res> =>
  new Promise((resolve, reject) => {
    method(request, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response as Res);
    });
  });

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
    for (const eventId of createdEventIds) {
      const req: DeleteEventRequest = { eventId };
      try {
        await unaryCall<DeleteEventRequest, Empty>(eventClient.deleteEvent.bind(eventClient), req);
      } catch {
        /* ignore cleanup errors */
      }
    }

    for (const tripId of createdTripIds) {
      const req: DeleteTripRequest = { tripId };
      try {
        await unaryCall<DeleteTripRequest, Empty>(tripClient.deleteTrip.bind(tripClient), req);
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

    const createReq: CreateTripRequest = {
      trip: {
        id: '',
        title: 'Integration Trip',
        userId: `integration-user-${Math.random().toString(16).slice(2)}`,
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
      createReq
    );
    const createdIdFromResponse = created.id;

    const listReq: ListTripsRequest = {
      userId: created.userId,
      pageSize: 10,
      pageToken: '',
    };

    const listResponse = await unaryCall<ListTripsRequest, ListTripsResponse>(
      tripClient.listTrips.bind(tripClient),
      listReq
    );
    const match = listResponse.trips.find((trip) => trip.title === createReq.trip?.title);
    expect(match).toBeDefined();

    const tripId = match?.id || createdIdFromResponse;
    expect(tripId).toBeTruthy();
    if (tripId) {
      createdTripIds.push(tripId);
    }

    const deleteReq: DeleteTripRequest = { tripId: tripId ?? '' };
    await unaryCall<DeleteTripRequest, Empty>(tripClient.deleteTrip.bind(tripClient), deleteReq);

    createdTripIds.pop();
  });

  it('creates an event and fetches timeline/budget data', async () => {
    const startDate = futureDate(5);
    const endDate = futureDate(7);

    const tripReq: CreateTripRequest = {
      trip: {
        id: '',
        title: 'Event Trip',
        userId: `integration-user-${Math.random().toString(16).slice(2)}`,
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
      tripReq
    );
    const tripList = await unaryCall<ListTripsRequest, ListTripsResponse>(
      tripClient.listTrips.bind(tripClient),
      {
        userId: trip.userId,
        pageSize: 5,
        pageToken: '',
      }
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
      eventReq
    );
    createdEventIds.push(createdEvent.id);
    expect(createdEvent.id).toBeTruthy();

    const listEventsReq: ListEventsRequest = { tripId };
    const events = await unaryCall<ListEventsRequest, ListEventsResponse>(
      eventClient.listEvents.bind(eventClient),
      listEventsReq
    );
    expect(events.events.some((evt) => evt.id === createdEvent.id)).toBe(true);

    const timelineReq: GetTimelineRequest = { tripId };
    const timeline = await unaryCall<GetTimelineRequest, GetTimelineResponse>(
      viewClient.getTimeline.bind(viewClient),
      timelineReq
    );
    expect(timeline.days.length).toBeGreaterThan(0);

    const budgetReq: GetBudgetRequest = { tripId };
    const budget = await unaryCall<GetBudgetRequest, GetBudgetResponse>(
      budgetClient.getBudget.bind(budgetClient),
      budgetReq
    );
    expect(budget.summary).toBeDefined();
  });
});
