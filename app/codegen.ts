import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: `http://api.localhost/introspection`,
  documents: ["src/**/*.tsx"],
  generates: {
    "./src/lib/graphql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
