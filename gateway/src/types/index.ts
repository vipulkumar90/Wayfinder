import type { Request } from "express";
import type { Metadata } from "@grpc/grpc-js";
import type {
  BudgetGrpcClient,
  EventGrpcClient,
  TripGrpcClient,
  ViewGrpcClient,
} from "@/grpc/clients.js";

/**
 * Core context passed to every GraphQL resolver.
 */
export interface AuthenticatedUser {
  userId: string;
  token: string;
  claims: Record<string, unknown>;
}

export interface RequestContext {
  userId: string | null;
  authMetadata: Metadata;
  req: Request;
}

/**
 * Lazily shared gRPC clients for downstream microservices.
 */
export interface GrpcClients {
  trip: TripGrpcClient;
  event: EventGrpcClient;
  view: ViewGrpcClient;
  budget: BudgetGrpcClient;
}

/**
 * Combined context shape available to resolvers.
 */
export interface MyContext extends RequestContext {
  clients: GrpcClients;
}
