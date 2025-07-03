import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enables global test functions like `describe`, `it`, etc.
    coverage: {
      reporter: ['text', 'json-summary', 'json', 'html'], // Output coverage in json-summary format for CI github actions
      reportOnFailure: true  // If you want a coverage even if tests are failing
    },
  },
});