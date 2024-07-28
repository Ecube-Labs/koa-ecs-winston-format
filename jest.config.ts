module.exports = {
  verbose: true,
  testRegex: ['.*\\.spec\\.ts$', '.*\\.test\\.ts$'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', './tsconfig.json'],
  },
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules'],
  preset: 'ts-jest',
  testMatch: null,
  testEnvironment: 'node',
};
