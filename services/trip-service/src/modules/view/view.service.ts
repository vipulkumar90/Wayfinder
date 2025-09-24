import type { Prisma, Event as PrismaEvent } from '@prisma/client';
import { getTripWithEvents, type TripWithEvents } from '@/modules/trip/trip.service.js';

const startOfDayUtc = (date: Date) => {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const clampDate = (date: Date, min: Date, max: Date) => {
  if (date < min) return new Date(min);
  if (date > max) return new Date(max);
  return new Date(date);
};

const buildEventDayKey = (event: PrismaEvent) => startOfDayUtc(event.startTime).getTime();

type TimelineDay = {
  date: Date;
  events: PrismaEvent[];
};

const groupEventsByDay = (events: PrismaEvent[]) => {
  const map = new Map<number, PrismaEvent[]>();

  for (const event of events) {
    const key = buildEventDayKey(event);
    const existing = map.get(key) ?? [];
    existing.push(event);
    map.set(key, existing);
  }

  for (const entries of map.values()) {
    entries.sort((a, b) => {
      const startDiff = a.startTime.getTime() - b.startTime.getTime();
      if (startDiff !== 0) return startDiff;
      const createdDiff = a.createdAt.getTime() - b.createdAt.getTime();
      if (createdDiff !== 0) return createdDiff;
      return a.id.localeCompare(b.id);
    });
  }

  return map;
};

const buildDayRange = (trip: TripWithEvents, fromDate?: Date, toDate?: Date): Date[] => {
  const tripStart = startOfDayUtc(trip.startDate);
  const tripEnd = startOfDayUtc(trip.endDate);

  const rangeStart = fromDate ? clampDate(startOfDayUtc(fromDate), tripStart, tripEnd) : tripStart;
  const rangeEnd = toDate ? clampDate(startOfDayUtc(toDate), tripStart, tripEnd) : tripEnd;

  if (rangeStart > rangeEnd) {
    return [];
  }

  const days: Date[] = [];
  for (let cursor = rangeStart; cursor <= rangeEnd; cursor = addDays(cursor, 1)) {
    days.push(new Date(cursor));
  }

  return days;
};

export const buildTimeline = async (params: {
  tripId: string;
  fromDate?: Date;
  toDate?: Date;
}) => {
  const trip = await getTripWithEvents(params.tripId);
  if (!trip) {
    return null;
  }

  const dayRange = buildDayRange(trip, params.fromDate, params.toDate);
  const groupedEvents = groupEventsByDay(trip.events);

  const days: TimelineDay[] = dayRange.map((date) => ({
    date,
    events: groupedEvents.get(date.getTime()) ?? [],
  }));

  return {
    trip,
    days,
  };
};

type MapDay = {
  date: Date;
  events: PrismaEvent[];
};

const filterEventsWithLocation = (events: PrismaEvent[]) =>
  events.filter((event) => event.locationLat !== null && event.locationLng !== null);

export const buildMapView = async (params: {
  tripId: string;
  date?: Date;
}) => {
  const trip = await getTripWithEvents(params.tripId);
  if (!trip) {
    return null;
  }

  const targetDays = params.date
    ? buildDayRange(trip, params.date, params.date)
    : buildDayRange(trip);

  if (targetDays.length === 0) {
    return { trip, days: [] as MapDay[] };
  }

  const groupedEvents = groupEventsByDay(trip.events);

  const days: MapDay[] = targetDays.map((date) => ({
    date,
    events: filterEventsWithLocation(groupedEvents.get(date.getTime()) ?? []),
  }));

  return {
    trip,
    days,
  };
};
