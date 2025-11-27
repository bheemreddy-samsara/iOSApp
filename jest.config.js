module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/types$': '<rootDir>/src/types.ts',
  },
  testMatch: ['<rootDir>/tests/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    // Exclude React Native UI components (tested via E2E with Detox)
    '!src/components/**',
    '!src/screens/**',
    '!src/navigation/**',
    // Include repositories and services (testable business logic)
    // Include hooks (can be tested with @testing-library/react-hooks)
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
