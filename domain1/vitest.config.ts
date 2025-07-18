import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export const defaultConfig = {
    plugins: [tsconfigPaths()], // path alias resolution in Vite

  test: {
    globals: true, // Enables global test functions like `describe`, `it`, etc.
    coverage: {
      thresholds: { // Coverage thresholds for CI
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      reporter: [
        'text-summary', // shows in terminal
        'json-summary', // structured format for pipelines,
        'json', // structured format for pipelines
        'html'], 
      reportOnFailure: true,  // If you want a coverage even if tests are failing,
      include: ['src/**/*.ts'], // Only include app logic inside src/
      exclude: [  // Exclude test files, models, build/bin, config, etc.
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/__tests__/**',
        '**/test/**',
        '**/models/**',
        '**/*.d.ts',
        'vitest.config.ts',
        'bin/**',            // bin folder
        'lib/**',            // root lib folder
        'node_modules/**',
        'localstack-data/**',
        'dist/**',           // build artifacts here
        '.vscode/**'         // just in case
      ]
    },
  },
};


export default defineConfig(defaultConfig);