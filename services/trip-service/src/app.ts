import path from 'path';
import { fileURLToPath } from 'url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
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

try {
  await prisma.$connect();
  logger.info('✅ Successfully connected to the database.');
} catch (error) {
  logger.error('❌ Failed to connect to the database.', error);
  process.exit(1); // Exit if the database connection fails
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Here is a absolute path
const PROTO_FILE = path.resolve(__dirname, '../../../shared/protos/trip.proto');

const options: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDef = protoLoader.loadSync(PROTO_FILE, options);

const proto = (grpc.loadPackageDefinition(packageDef) as any).trip.v1;

const server = new grpc.Server();

server.addService(proto.TripService.service, {
  CreateTrip: createTripHandler,
  GetTrip: getTripHandler,
  UpdateTrip: updateTripHandler,
  DeleteTrip: deleteTripHandler,
  ListTrips: listTripsHandler,
});

server.addService(proto.EventService.service, {
  CreateEvent: createEventHandler,
  GetEvent: getEventHandler,
  UpdateEvent: updateEventHandler,
  DeleteEvent: deleteEventHandler,
  ListEvents: listEventsHandler,
});

server.addService(proto.ViewService.service, {
  GetTimeline: getTimelineHandler,
  GetMapView: getMapViewHandler,
});

server.addService(proto.BudgetService.service, {
  GetBudget: getBudgetHandler,
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
