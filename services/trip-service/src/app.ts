import grpc from '@grpc/grpc-js';
import { prisma } from '@/lib/prisma.js';
import config from './config/env.js';
import logger from './lib/logger.js';
import {
  createTripHandler,
  getTripHandler,
  updateTripHandler,
  deleteTripHandler,
  listTripsHandler,
} from './grpc/trip.handler.js';
import {
  createEventHandler,
  getEventHandler,
  updateEventHandler,
  deleteEventHandler,
  listEventsHandler,
} from './grpc/event.handler.js';
import { getTimelineHandler, getMapViewHandler } from './grpc/view.handler.js';
import { getBudgetHandler } from './grpc/budget.handler.js';
import {
  TripServiceService,
  EventServiceService,
  ViewServiceService,
  BudgetServiceService,
} from '@/grpc/__generated__/trip.js';

try {
  await prisma.$connect();
  logger.info('✅ Successfully connected to the database.');
} catch (error) {
  logger.error('❌ Failed to connect to the database.', error);
  process.exit(1); // Exit if the database connection fails
}

const server = new grpc.Server();

server.addService(TripServiceService, {
  createTrip: createTripHandler,
  getTrip: getTripHandler,
  updateTrip: updateTripHandler,
  deleteTrip: deleteTripHandler,
  listTrips: listTripsHandler,
});

server.addService(EventServiceService, {
  createEvent: createEventHandler,
  getEvent: getEventHandler,
  updateEvent: updateEventHandler,
  deleteEvent: deleteEventHandler,
  listEvents: listEventsHandler,
});

server.addService(ViewServiceService, {
  getTimeline: getTimelineHandler,
  getMapView: getMapViewHandler,
});

server.addService(BudgetServiceService, {
  getBudget: getBudgetHandler,
});

server.bindAsync(`0.0.0.0:${config.port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    logger.error(`❌ gRPC server error: ${err.message}`);
    return;
  }
  logger.info('===============================================');
  logger.info(`🚀 gRPC server ready on port ${port}`);
  logger.info('===============================================');
});

const gracefulShutdown = (signal: string) => {
  logger.info(`👋 ${signal} received. Shutting down gracefully...`);

  server.tryShutdown(async (error) => {
    if (error) {
      logger.error('gRPC server shutdown error', error);
    }
    logger.info('🛑 gRPC server closed.');

    await prisma.$disconnect();
    logger.info('🔌 Prisma connection to database closed.');

    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
