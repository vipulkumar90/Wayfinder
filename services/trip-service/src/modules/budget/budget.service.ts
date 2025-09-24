import { getTripWithEvents } from '@/modules/trip/trip.service.js';

export const buildBudgetSummary = async (tripId: string) => {
  const trip = await getTripWithEvents(tripId);

  if (!trip) {
    return null;
  }

  const amountSpent = trip.events.reduce((sum, event) => sum + (event.cost ?? 0), 0);

  const spentByCategory = trip.events.reduce<Record<string, number>>((acc, event) => {
    const category = event.category ?? 'OTHER';
    const cost = event.cost ?? 0;
    acc[category] = (acc[category] ?? 0) + cost;
    return acc;
  }, {});

  return {
    trip,
    summary: {
      totalBudget: trip.budget,
      amountSpent,
      remaining: trip.budget - amountSpent,
      spentByCategory,
    },
  };
};
