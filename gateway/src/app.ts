import express, { Request } from "express";
import cors from "cors";
import http from "http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import config from "./config/env.js";
import { typeDefs } from "./graphql/schema/index.js";
import { resolvers } from "./graphql/resolver/index.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirective } from "./directives/auth.directive.js";
import logger from "./lib/logger.js";
import { context } from "./lib/context.js";
import helmet from "helmet";
import { closeGrpcClients } from "./grpc/clients.js";

const app = express();
const httpServer = http.createServer(app);

// Configure Apollo Server
let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = authDirective(schema, "auth");
const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// start Apollo Server
await apolloServer.start();
logger.info("✅ Apollo Server started");

//Configure Express Middleware
// cors()
app.use(cors());
// For parsing application/json
app.use(express.json());

// Helmet for security
app.use(
  helmet({
    contentSecurityPolicy: config.env !== "development",
  })
);

// Configure GraphQL API
app.use("/graphql", expressMiddleware(apolloServer, { context }));

httpServer.listen(config.port, () => {
  logger.info(`
===========================================
🚀 Server ready at http://localhost:${config.port} 🚀
===========================================`);
});

// Graceful shutting down
const gracefulShutdown = (signal: string) => {
  logger.info(`👋 ${signal} received. Shutting down gracefully...`);

  httpServer.close(async () => {
    logger.info("🛑 HTTP server closed.");

    closeGrpcClients();
    logger.info("🔌 gRPC clients disconnected.");

    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
