import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLError, GraphQLSchema } from "graphql";
import type { MyContext } from "@/types/index.js";

/**
 * Adds a simple `@auth` directive to any field requiring an authenticated user.
 */
export const authDirective = (
  schema: GraphQLSchema,
  directiveName: string
): GraphQLSchema =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (!authDirective) {
        return fieldConfig;
      }

      const originalResolve = fieldConfig.resolve ?? defaultFieldResolver;
      fieldConfig.resolve = async (source, args, context: MyContext, info) => {
        if (!context.userId) {
          throw new GraphQLError("Authentication required", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        return originalResolve.call(fieldConfig, source, args, context, info);
      };

      return fieldConfig;
    },
  });
