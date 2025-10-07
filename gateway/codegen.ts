import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/graphql/schema/**/*.ts",
  generates: {
    "src/graphql/__generated__/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "@/types/index.js#MyContext",
        scalars: {
          DateTime: "string",
        },
        enumsAsTypes: true,
        useTypeImports: true,
      },
    },
  },
};

export default config;
