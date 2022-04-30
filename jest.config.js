module.exports = {
    testMatch: ['<rootDir>/src/**/?(*.)test.(ts|tsx)'],
    transform: { '\\.(ts|tsx)$': ['ts-jest'] },
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/setup-tests.ts'],
  };