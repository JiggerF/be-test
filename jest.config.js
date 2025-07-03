
// Jest is not needed if project using Vitest test runner
// vitest.config.js has globals=true which overrides the need for jest.config.js
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};

process.env.NODE_ENV = 'test';