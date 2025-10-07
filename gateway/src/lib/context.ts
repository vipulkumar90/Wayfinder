import { Metadata } from "@grpc/grpc-js";
import type { Request } from "express";
import { getGrpcClients } from "@/grpc/clients.js";
import logger from "@/lib/logger.js";
import type { AuthenticatedUser, MyContext } from "@/types/index.js";

const grpcClients = getGrpcClients();

const AUTHORIZATION_HEADER = "authorization";
const BEARER_PREFIX = "bearer ";
const FALLBACK_VIRTUAL_USER_ID = "virtual-user";

const normaliseHeader = (
  value: string | string[] | undefined
): string | null => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0]?.trim() || null : null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const extractBearerToken = (req: Request): string | null => {
  const headerValue = normaliseHeader(req.headers[AUTHORIZATION_HEADER]);
  if (!headerValue) {
    return null;
  }

  const lower = headerValue.toLowerCase();
  if (!lower.startsWith(BEARER_PREFIX)) {
    return null;
  }

  const token = headerValue.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
};

const verifyToken = async (token: string): Promise<AuthenticatedUser> => {
  logger.debug(
    "Auth service unavailable; using virtual verification for provided token."
  );

  return {
    userId: FALLBACK_VIRTUAL_USER_ID,
    token,
    claims: {},
  };
};

const resolveAuthenticatedUser = async (
  req: Request
): Promise<AuthenticatedUser | null> => {
  const token = extractBearerToken(req);
  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch (error) {
    logger.warn(
      "Token verification failed; ignoring auth header. Reason: %s",
      (error as Error).message
    );
    return null;
  }
};

const buildAuthMetadata = (userId: string | null): Metadata => {
  const metadata = new Metadata();
  if (!userId) {
    return metadata;
  }

  metadata.set("x-user-id", userId);

  return metadata;
};

export const context = async ({
  req,
}: {
  req: Request;
}): Promise<MyContext> => {
  const authenticatedUser = await resolveAuthenticatedUser(req);
  const userId = authenticatedUser?.userId ?? null;
  const authMetadata = buildAuthMetadata(userId);

  return {
    userId,
    authMetadata,
    req,
    clients: grpcClients,
  };
};
