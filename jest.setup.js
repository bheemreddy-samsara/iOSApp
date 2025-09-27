// Jest setup for Node environment testing
// Mock React Native modules for Node testing
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};