module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(js|ts)$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/.*'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
