import { GraphQLError } from "graphql";
import { status as GrpcStatus, type ServiceError } from "@grpc/grpc-js";

const statusToGraphqlCode: Record<number, string> = {
  [GrpcStatus.INVALID_ARGUMENT]: "BAD_USER_INPUT",
  [GrpcStatus.ALREADY_EXISTS]: "BAD_USER_INPUT",
  [GrpcStatus.NOT_FOUND]: "NOT_FOUND",
  [GrpcStatus.PERMISSION_DENIED]: "FORBIDDEN",
  [GrpcStatus.UNAUTHENTICATED]: "UNAUTHENTICATED",
  [GrpcStatus.FAILED_PRECONDITION]: "FAILED_PRECONDITION",
  [GrpcStatus.UNAVAILABLE]: "UNAVAILABLE",
};

const isServiceError = (error: unknown): error is ServiceError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "number"
  );
};

export const mapGrpcErrorToGraphql = (
  error: unknown,
  fallbackMessage: string,
): never => {
  if (isServiceError(error)) {
    const graphqlCode = statusToGraphqlCode[error.code] ?? "INTERNAL_SERVER_ERROR";

    throw new GraphQLError(error.message || fallbackMessage, {
      extensions: {
        code: graphqlCode,
        serviceCode: error.code,
        details: error.details,
      },
    });
  }

  if (error instanceof Error) {
    throw new GraphQLError(error.message, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }

  throw new GraphQLError(fallbackMessage, {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  });
};
