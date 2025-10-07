import type {
  BudgetCategoryBreakdown,
  BudgetSummary,
  Event,
  MapDay,
  MapPoint,
  MapView,
  Timeline,
  TimelineDay,
  Trip,
  TripConnection,
} from "@/graphql/__generated__/resolvers-types.js";
import {
  categoryFromJSON,
  categoryToJSON,
  Category as GrpcCategory,
  type BudgetSummary as BudgetSummaryMessage,
  type DayMap as DayMapMessage,
  type DayTimeline as DayTimelineMessage,
  Event as EventMessageFactory,
  type Event as EventMessage,
  type GetMapViewResponse,
  type GetTimelineResponse,
  type ListTripsResponse,
  type MapPoint as MapPointMessage,
  Trip as TripMessageFactory,
  type Trip as TripMessage,
} from "@/grpc/__generated__/trip.js";
import type {
  CreateEventInput,
  CreateTripInput,
  UpdateEventInput,
  UpdateTripInput,
} from "@/graphql/__generated__/resolvers-types.js";
import { isoToDate, optionalIsoToDate } from "@/utils/timestamp.js";

const toNumber = (value: unknown): number | null => {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  return null;
};

const toInteger = (value: unknown): number | null => {
  const numeric = toNumber(value);
  if (numeric === null) {
    return null;
  }
  return Math.trunc(numeric);
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const timestampToIso = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (typeof value === "object" && value !== null) {
    const maybeSeconds = (value as { seconds?: unknown }).seconds;
    const maybeNanos = (value as { nanos?: unknown }).nanos;

    if (maybeSeconds === undefined && maybeNanos === undefined) {
      return null;
    }

    const seconds = toNumber(maybeSeconds) ?? 0;
    const nanos = toNumber(maybeNanos) ?? 0;
    const millis = seconds * 1000 + Math.floor(nanos / 1_000_000);
    return new Date(millis).toISOString();
  }

  return null;
};

export const mapTripMessageToDTO = (trip: TripMessage): Trip => ({
  __typename: "Trip",
  id: trip.id ?? "",
  title: trip.title ?? null,
  destination: trip.destination ?? "",
  startDate: timestampToIso(trip.startDate),
  endDate: timestampToIso(trip.endDate),
  budget: toNumber(trip.budget) ?? 0,
  currency: trip.currency ?? "",
  createdAt: timestampToIso(trip.createdAt),
  updatedAt: timestampToIso(trip.updatedAt),
});

export const mapEventMessageToDTO = (event: EventMessage): Event => ({
  __typename: "Event",
  id: event.id ?? "",
  tripId: event.tripId ?? "",
  title: event.title ?? "",
  startTime: timestampToIso(event.startTime),
  endTime: timestampToIso(event.endTime),
  locationName: event.locationName ?? null,
  locationLat: toNumber(event.locationLat),
  locationLng: toNumber(event.locationLng),
  cost: toNumber(event.cost),
  category: categoryToJSON(
    event.category ?? GrpcCategory.CATEGORY_UNSPECIFIED,
  ) as Event["category"],
  notes: event.notes ?? null,
  createdAt: timestampToIso(event.createdAt),
  updatedAt: timestampToIso(event.updatedAt),
});

const mapTimelineDay = (day: DayTimelineMessage): TimelineDay => ({
  __typename: "TimelineDay",
  date: timestampToIso(day.date) ?? new Date(0).toISOString(),
  events: (day.events ?? []).map(mapEventMessageToDTO),
});

export const mapTimelineResponse = (response: GetTimelineResponse): Timeline => ({
  __typename: "Timeline",
  days: (response.days ?? []).map(mapTimelineDay),
});

const mapMapPoint = (point: MapPointMessage): MapPoint => ({
  __typename: "MapPoint",
  eventId: point.eventId ?? "",
  title: point.title ?? "",
  lat: toNumber(point.lat) ?? 0,
  lng: toNumber(point.lng) ?? 0,
  order: toInteger(point.order) ?? 0,
});

const mapMapDay = (day: DayMapMessage): MapDay => ({
  __typename: "MapDay",
  date: timestampToIso(day.date) ?? new Date(0).toISOString(),
  points: (day.points ?? []).map(mapMapPoint),
});

export const mapMapViewResponse = (response: GetMapViewResponse): MapView => ({
  __typename: "MapView",
  days: (response.days ?? []).map(mapMapDay),
});

export const mapBudgetSummary = (
  response: BudgetSummaryMessage | null | undefined,
): BudgetSummary => {
  const spentByCategoryEntries = Object.entries(response?.spentByCategory ?? {});
  return {
    __typename: "BudgetSummary",
    tripId: response?.tripId ?? "",
    totalBudget: toNumber(response?.totalBudget) ?? 0,
    amountSpent: toNumber(response?.amountSpent) ?? 0,
    remaining: toNumber(response?.remaining) ?? 0,
    spentByCategory: spentByCategoryEntries.map(([category, amount]) => ({
      __typename: "BudgetCategoryBreakdown",
      category,
      amount: toNumber(amount) ?? 0,
    })) as BudgetCategoryBreakdown[],
  };
};

export const mapTripsConnection = (response: ListTripsResponse): TripConnection => {
  const token = response.nextPageToken ?? null;
  return {
    __typename: "TripConnection",
    items: (response.trips ?? []).map(mapTripMessageToDTO),
    nextPageToken: token && token.length > 0 ? token : null,
  };
};

export const buildTripMessageFromCreateInput = (
  input: CreateTripInput,
): TripMessage =>
  TripMessageFactory.fromPartial({
    title: input.title ?? undefined,
    destination: input.destination,
    startDate: isoToDate(input.startDate),
    endDate: isoToDate(input.endDate),
    budget: input.budget,
    currency: input.currency,
  });

export const buildTripMessageFromUpdateInput = (
  id: string,
  input: UpdateTripInput,
): TripMessage => {
  const partial: Partial<TripMessage> = { id };
  if (isNonEmptyString(input.title)) {
    partial.title = input.title;
  }
  if (isNonEmptyString(input.destination)) {
    partial.destination = input.destination;
  }
  if (isNonEmptyString(input.currency)) {
    partial.currency = input.currency;
  }
  if (isNonEmptyString(input.startDate)) {
    partial.startDate = isoToDate(input.startDate);
  }
  if (isNonEmptyString(input.endDate)) {
    partial.endDate = isoToDate(input.endDate);
  }
  if (input.budget !== null && input.budget !== undefined) {
    partial.budget = input.budget;
  }
  return TripMessageFactory.fromPartial(partial);
};

export const buildEventMessageFromCreateInput = (
  input: CreateEventInput,
): EventMessage =>
  EventMessageFactory.fromPartial({
    tripId: input.tripId,
    title: input.title,
    startTime: isoToDate(input.startTime),
    endTime: input.endTime ? isoToDate(input.endTime) : undefined,
    locationName: input.locationName ?? undefined,
    locationLat: input.locationLat ?? undefined,
    locationLng: input.locationLng ?? undefined,
    cost: input.cost ?? undefined,
    category: input.category
      ? categoryFromJSON(input.category)
      : GrpcCategory.CATEGORY_UNSPECIFIED,
    notes: input.notes ?? undefined,
  });

export const buildEventMessageFromUpdateInput = (
  id: string,
  input: UpdateEventInput,
): EventMessage => {
  const partial: Partial<EventMessage> = { id };
  if (isNonEmptyString(input.title)) {
    partial.title = input.title;
  }
  if (isNonEmptyString(input.startTime)) {
    partial.startTime = isoToDate(input.startTime);
  }
  if (isNonEmptyString(input.endTime)) {
    partial.endTime = isoToDate(input.endTime);
  }
  if (isNonEmptyString(input.locationName)) {
    partial.locationName = input.locationName;
  }
  if (input.locationLat !== null && input.locationLat !== undefined) {
    partial.locationLat = input.locationLat;
  }
  if (input.locationLng !== null && input.locationLng !== undefined) {
    partial.locationLng = input.locationLng;
  }
  if (input.cost !== null && input.cost !== undefined) {
    partial.cost = input.cost;
  }
  if (isNonEmptyString(input.category)) {
    partial.category = categoryFromJSON(input.category);
  }
  if (isNonEmptyString(input.notes)) {
    partial.notes = input.notes;
  }
  return EventMessageFactory.fromPartial(partial);
};
