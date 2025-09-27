import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^./google/protobuf/(.*)\\.js$': '<rootDir>/src/grpc/__generated__/google/protobuf/$1.ts',
    '^./trip.schema.js$': '<rootDir>/src/modules/trip/trip.schema.ts',
    '^./event.schema.js$': '<rootDir>/src/modules/event/event.schema.ts',
    '^./category.js$': '<rootDir>/src/modules/event/category.ts',
    '^./mappers.js$': '<rootDir>/src/grpc/mappers.ts',
    '^@/(.*)\\.js$': '<rootDir>/src/$1.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'cjs', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  setupFiles: ['dotenv/config'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/grpc/__generated__/**', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
};

export default config;
