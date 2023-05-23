import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema:`http://${process.env.NEXT_PUBLIC_API_URL}/query`,
  documents: ['src/**/*.tsx'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;