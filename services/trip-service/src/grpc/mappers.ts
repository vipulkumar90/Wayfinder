import type { Trip as PrismaTrip, Event as PrismaEvent } from '@prisma/client';
import {
  Category,
  categoryFromJSON,
  type Trip as TripMessage,
  type Event as EventMessage,
} from '@/generated/trip.js';
import type { CreateTripInput, UpdateTripInput } from '@/modules/trip/trip.schema.js';
import type { CreateEventInput, UpdateEventInput } from '@/modules/event/event.schema.js';
import { toGrpcCategory } from '@/modules/event/category.js';

type TimestampInput =
  | Date
  | {
      seconds?: number | string;
      nanos?: number | string;
    }
  | string
  | undefined;

const getFirstDefined = <T = unknown>(source: unknown, keys: string[]): T | undefined => {
  if (!source || typeof source !== 'object') return undefined;
  for (const key of keys) {
    const value = (source as Record<string, T | undefined>)[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
};

const toDateValue = (value: TimestampInput): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
  if (typeof value === 'object' && 'seconds' in value) {
    const secondsRaw = (value.seconds ?? 0) as number | string;
    const nanosRaw = (value.nanos ?? 0) as number | string;
    const seconds = Number(secondsRaw);
    const nanos = Number(nanosRaw);
    if (!Number.isFinite(seconds) || !Number.isFinite(nanos)) return undefined;
    return new Date(seconds * 1000 + Math.round(nanos / 1_000_000));
  }
  return undefined;
};

const toNumberValue = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const toTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toStringOrEmpty = (value: unknown): string => toTrimmedString(value) ?? '';

const toCategoryValue = (value: unknown): Category | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return categoryFromJSON(value);
  if (typeof value === 'string') return categoryFromJSON(value);
  return undefined;
};

const ensureDate = (value: Date | undefined) => value ?? new Date(NaN);
const ensureNumber = (value: number | undefined) => (value !== undefined ? value : Number.NaN);

type TripPayload = TripMessage | Record<string, unknown>;
type EventPayload = EventMessage | Record<string, unknown>;

export const mapTripModelToMessage = (trip: PrismaTrip): TripMessage => ({
  id: trip.id,
  title: trip.title ?? undefined,
  userId: trip.userId,
  destination: trip.destination,
  startDate: trip.startDate,
  endDate: trip.endDate,
  budget: trip.budget,
  currency: trip.currency,
  createdAt: trip.createdAt,
  updatedAt: trip.updatedAt,
});

export const mapEventModelToMessage = (event: PrismaEvent): EventMessage => ({
  id: event.id,
  tripId: event.tripId,
  title: event.title,
  startTime: event.startTime,
  endTime: event.endTime ?? undefined,
  locationName: event.locationName ?? '',
  locationLat: event.locationLat ?? 0,
  locationLng: event.locationLng ?? 0,
  cost: event.cost ?? 0,
  category: toGrpcCategory(event.category),
  notes: event.notes ?? '',
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
});

export const mapTripMessageToCreateInput = (trip: TripPayload): CreateTripInput => {
  const startDate = toDateValue(getFirstDefined(trip, ['startDate', 'start_date']));
  const endDate = toDateValue(getFirstDefined(trip, ['endDate', 'end_date']));
  const budget = toNumberValue(getFirstDefined(trip, ['budget']));

  return {
    title: toTrimmedString(getFirstDefined(trip, ['title'])),
    userId: toStringOrEmpty(getFirstDefined(trip, ['userId', 'user_id'])),
    destination: toStringOrEmpty(getFirstDefined(trip, ['destination'])),
    startDate: ensureDate(startDate),
    endDate: ensureDate(endDate),
    budget: ensureNumber(budget),
    currency: toStringOrEmpty(getFirstDefined(trip, ['currency'])),
  };
};

export const mapTripMessageToUpdateInput = (trip: TripPayload): UpdateTripInput => {
  const startDate = toDateValue(getFirstDefined(trip, ['startDate', 'start_date']));
  const endDate = toDateValue(getFirstDefined(trip, ['endDate', 'end_date']));
  const budget = toNumberValue(getFirstDefined(trip, ['budget']));

  return {
    id: toStringOrEmpty(getFirstDefined(trip, ['id'])),
    title: toTrimmedString(getFirstDefined(trip, ['title'])),
    userId: toTrimmedString(getFirstDefined(trip, ['userId', 'user_id'])),
    destination: toTrimmedString(getFirstDefined(trip, ['destination'])),
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
    budget: budget ?? undefined,
    currency: toTrimmedString(getFirstDefined(trip, ['currency'])),
  };
};

export const mapEventMessageToCreateInput = (event: EventPayload): CreateEventInput => {
  const startTime = toDateValue(getFirstDefined(event, ['startTime', 'start_time']));
  const endTime = toDateValue(getFirstDefined(event, ['endTime', 'end_time']));
  const locationLat = toNumberValue(getFirstDefined(event, ['locationLat', 'location_lat']));
  const locationLng = toNumberValue(getFirstDefined(event, ['locationLng', 'location_lng']));
  const cost = toNumberValue(getFirstDefined(event, ['cost']));
  const sortOrder = toNumberValue(getFirstDefined(event, ['sortOrder', 'sort_order']));
  const category = toCategoryValue(getFirstDefined(event, ['category'])) ?? Category.OTHER;

  return {
    tripId: toStringOrEmpty(getFirstDefined(event, ['tripId', 'trip_id'])),
    title: toStringOrEmpty(getFirstDefined(event, ['title'])),
    startTime: ensureDate(startTime),
    endTime: endTime ?? undefined,
    locationName: toTrimmedString(getFirstDefined(event, ['locationName', 'location_name'])),
    locationLat: locationLat ?? undefined,
    locationLng: locationLng ?? undefined,
    cost: cost ?? undefined,
    category,
    notes: toTrimmedString(getFirstDefined(event, ['notes'])),
    sortOrder: sortOrder !== undefined ? Math.trunc(sortOrder) : undefined,
  };
};

export const mapEventMessageToUpdateInput = (event: EventPayload): UpdateEventInput => {
  const startTime = toDateValue(getFirstDefined(event, ['startTime', 'start_time']));
  const endTime = toDateValue(getFirstDefined(event, ['endTime', 'end_time']));
  const locationLat = toNumberValue(getFirstDefined(event, ['locationLat', 'location_lat']));
  const locationLng = toNumberValue(getFirstDefined(event, ['locationLng', 'location_lng']));
  const cost = toNumberValue(getFirstDefined(event, ['cost']));
  const sortOrder = toNumberValue(getFirstDefined(event, ['sortOrder', 'sort_order']));
  const category = toCategoryValue(getFirstDefined(event, ['category']));

  const result: UpdateEventInput = {
    id: toStringOrEmpty(getFirstDefined(event, ['id'])),
  };

  const title = toTrimmedString(getFirstDefined(event, ['title']));
  if (title !== undefined) result.title = title;

  const tripId = toTrimmedString(getFirstDefined(event, ['tripId', 'trip_id']));
  if (tripId !== undefined) result.tripId = tripId;

  if (startTime) result.startTime = startTime;
  if (endTime) result.endTime = endTime;
  const locationName = toTrimmedString(getFirstDefined(event, ['locationName', 'location_name']));
  if (locationName !== undefined) result.locationName = locationName;
  if (locationLat !== undefined) result.locationLat = locationLat;
  if (locationLng !== undefined) result.locationLng = locationLng;
  if (cost !== undefined) result.cost = cost;
  if (category !== undefined) result.category = category;
  const notes = toTrimmedString(getFirstDefined(event, ['notes']));
  if (notes !== undefined) result.notes = notes;
  if (sortOrder !== undefined) result.sortOrder = Math.trunc(sortOrder);

  return result;
};
